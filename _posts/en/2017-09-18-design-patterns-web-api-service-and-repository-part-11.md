---
title:  "Design Patterns: Asp.Net Core Web API, services, and repositories"
subtitle: "Part 11: Integration testing"
date:   2017-09-18 00:00:00 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2017-07-00-asp-net-core-design-patterns.png"
lang: en
categories: en/articles
tags: 
- Design Patterns
- Asp.Net Core
- Web API
- C#
- Unit Test
- XUnit
- Façade Pattern
- Repository Pattern
- NoSQL
- Azure
- Azure Table Storage
- ForEvolve Framework
proficiency-level: Intermediate
---

TODO...<!--more-->

[Skip the shared part](#integration-of-the-ninja)

{% include design-patterns-web-api-service-and-repository/series.md %}

## Integration of the Ninja
We now have a fully unit tested Ninja sub-system but, we still need to integrate it together if we want it to work.

---

> We could compare this to lego blocks.
> We first created the blocks, but we still have no castle built.

---

Let's first take a look at our initial diagram:
<figure>
    <img src="//cdn.forevolve.com/blog/images/2017/controller-service-repo-ninja-with-DI.png">
    <figcaption>An HTTP request from the <code>Controller</code> to the data source, fully decoupled.</figcaption>
</figure>

We modified the `NinjaRepository` a little, adding two new dependencies:

- `INinjaMappingService` that help us map our ninja.
- `ITableStorageRepository<NinjaEntity>` that handle the Azure SDK code for us.

The new diagram looks like this:

<figure>
    <img src="//cdn.forevolve.com/blog/images/2017/controller-service-repo-ninja-with-DI-2.png">
    <figcaption>An HTTP request from the <code>Controller</code> to the data source, fully decoupled, including the dependencies.</figcaption>
</figure>

If we add the indirect `ForEvolve.Azure` dependencies, we end up with:

<figure>
    <img src="//cdn.forevolve.com/blog/images/2017/controller-service-repo-ninja-with-DI-3.png">
    <figcaption>An HTTP request from the <code>Controller</code> to the data source, fully decoupled, including the `ForEvolve.Azure` dependency.</figcaption>
</figure>



### Integration tests
Let's do some integration testing here.

First, we will replace Azure Table Storage by a Fake: `NinjaEntityTableStorageRepositoryFake`.
Why? 
Because it will be easier to assess success or failure and the tests will run faster (no need to access a remote data source).

`NinjaEntityTableStorageRepositoryFake` is a light inmemory implementation of `ITableStorageRepository<NinjaEntity>` with a few extras.

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.IntegrationTests
{
    public class NinjaEntityTableStorageRepositoryFake : ITableStorageRepository<NinjaEntity>
    {
        private List<NinjaEntity> InternalEntities { get; }
        private List<NinjaEntity> MergedEntities { get; }

        public NinjaEntityTableStorageRepositoryFake()
        {
            InternalEntities = new List<NinjaEntity>();
            MergedEntities = new List<NinjaEntity>();
        }

        public async Task<NinjaEntity> InsertOrMergeAsync(NinjaEntity item)
        {
            var current = await ReadOneAsync(item.PartitionKey, item.RowKey);
            if (current != null)
            {
                current.Level = item.Level;
                current.Name = item.Name;
                MergedEntities.Add(current);
                return current;
            }
            InternalEntities.Add(item);
            return item;
        }

        public async Task<NinjaEntity> InsertOrReplaceAsync(NinjaEntity item)
        {
            var current = await ReadOneAsync(item.PartitionKey, item.RowKey);
            if(current != null)
            {
                InternalEntities.Remove(current);
            }
            InternalEntities.Add(item);
            return item;
        }

        public Task<IEnumerable<NinjaEntity>> ReadAllAsync()
        {
            return Task.FromResult(InternalEntities.AsEnumerable());
        }

        public async Task<NinjaEntity> ReadOneAsync(string partitionKey, string rowkey)
        {
            var item = (await ReadPartitionAsync(partitionKey))
                .FirstOrDefault(x => x.RowKey == rowkey);
            return item;
        }

        public Task<IEnumerable<NinjaEntity>> ReadPartitionAsync(string partitionKey)
        {
            var items = InternalEntities
                .Where(x => x.PartitionKey == partitionKey);
            return Task.FromResult(items);
        }

        public async Task<NinjaEntity> RemoveAsync(string partitionKey, string rowkey)
        {
            var item = await ReadOneAsync(partitionKey, rowkey);
            InternalEntities.Remove(item);
            return item;
        }

        public async Task<IEnumerable<NinjaEntity>> RemoveAsync(string partitionKey)
        {
            var items = await ReadPartitionAsync(partitionKey);
            InternalEntities.RemoveAll(x => x.PartitionKey == partitionKey);
            return items;
        }

        internal bool HasBeenMerged(NinjaEntity item)
        {
            var mergedItem = MergedEntities.FirstOrDefault(x => x.PartitionKey == item.PartitionKey && x.RowKey == item.RowKey);
            return mergedItem != null;
        }

        internal void AddRange(IEnumerable<NinjaEntity> ninjaCollection)
        {
            InternalEntities.AddRange(ninjaCollection);
        }

        internal int EntityCount => InternalEntities.Count;

        internal NinjaEntity ElementAt(int index)
        {
            return InternalEntities[index];
        }
    }
}
```

Now the shared part of `NinjaControllerTest`.

I faked the `IClanRepository` by injecting a custom list of clans for the test, overriding the default.
We are testing the whole system (but Azure), so clans name will be validated.

I also created a `NinjaEntityTableStorageRepositoryFake` instance that tests can use. 
I also added it to the `IServiceCollection`, overriding the default.

The `PopulateTableStorageFake` method will help fill our fake repository.

`AssertNinjaEntityEqualNinja` will help us validate `Ninja` received over HTTP against the "database" `NinjaEntity`.

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.IntegrationTests
{
    public class NinjaControllerTest : BaseHttpTest
    {
        protected NinjaEntityTableStorageRepositoryFake TableStorageFake { get; }

        protected string ClanName1 => "Iga";
        protected string ClanName2 => "Kōga";

        public NinjaControllerTest()
        {
            TableStorageFake = new NinjaEntityTableStorageRepositoryFake();
        }

        protected override void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<ITableStorageRepository<NinjaEntity>>(x => TableStorageFake);
            services.AddSingleton<IEnumerable<Clan>>(x => new List<Clan> {
                new Clan{ Name = ClanName1 },
                new Clan{ Name = ClanName2 }
            });
        }

        // ...

        protected List<NinjaEntity> PopulateTableStorageFake(int amountOfNinjaToCreate, string clanName)
        {
            var ninjaList = new List<NinjaEntity>();
            for (int i = 0; i < amountOfNinjaToCreate; i++)
            {
                var ninja = new NinjaEntity
                {
                    Level = i,
                    Name = $"Ninja {i}",
                    PartitionKey = clanName,
                    RowKey = $"NinjaKey {i}"
                };
                ninjaList.Add(ninja);
            }
            TableStorageFake.AddRange(ninjaList);
            return ninjaList;
        }

        protected void AssertNinjaEntityEqualNinja(NinjaEntity entity, Ninja ninja)
        {
            Assert.Equal(entity.PartitionKey, ninja.Clan.Name);
            Assert.Equal(entity.RowKey, ninja.Key);
            Assert.Equal(entity.Name, ninja.Name);
            Assert.Equal(entity.Level, ninja.Level);
        }
    }
}
```

### Startup dependencies
Now that our integration tests are ready, it is time to register our dependencies with the DI Container.

I divided the dependencies into three groups:

1. Mappers
1. Ninja
1. ForEvolve.Azure

#### Mappers
In `Startup.ConfigureServices`, we will add the following:

```csharp
services.TryAddSingleton<IMapper<Ninja, NinjaEntity>, NinjaToNinjaEntityMapper>();
services.TryAddSingleton<IMapper<NinjaEntity, Ninja>, NinjaEntityToNinjaMapper>();
services.TryAddSingleton<IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>, NinjaEntityEnumerableToNinjaMapper>();
```

These define our mappers.

#### Ninja
In `Startup.ConfigureServices`, we will add the following:

```csharp
services.TryAddSingleton<INinjaService, NinjaService>();
services.TryAddSingleton<INinjaRepository, NinjaRepository>();
services.TryAddSingleton<INinjaMappingService, NinjaMappingService>();
```

These represent our core Ninja pipeline.

#### ForEvolve.Azure

##### Configurations
By default, Asp.Net Core 2.0 do most of the configuration plumbing for us.
The only thing we will need to do is get the configurations injected in the `Startup` class by adding a constructor and a property (for future references).

``` csharp
public Startup(IConfiguration configuration)
{
    Configuration = configuration;
}

public IConfiguration Configuration { get; }
```

Once this is done, we can access our configurations.

##### ConfigureServices

In `Startup.ConfigureServices`, we will add the following:

```csharp
services.TryAddSingleton<ITableStorageRepository<NinjaEntity>, TableStorageRepository<NinjaEntity>>();
services.TryAddSingleton<ITableStorageSettings>(x => new TableStorageSettings
{
    AccountKey = Configuration.GetValue<string>("AzureTable:AccountKey"),
    AccountName = Configuration.GetValue<string>("AzureTable:AccountName"),
    TableName = Configuration.GetValue<string>("AzureTable:TableName")
});
```

Most of the classes and interfaces are taken from the `ForEvolve.Azure` assembly and will help us access Azure Table Storage.

The main class is `TableStorageRepository<NinjaEntity>`, associated to the `ITableStorageRepository<NinjaEntity>` interface that is injected in our `NinjaRepository`.
To create the `TableStorageRepository`, we need to provide a `ITableStorageSettings`.
The default `TableStorageSettings` implementation should do the job but, we need to set some values.
These values will come from the application configurations.

- **AccountKey:** this is one of your Azure Storage "Access Keys."
- **AccountName:** this is your Azure Storage name, the one you entered during creation.
- **TableName:** this is the name of the table to use.

<figure>
    <img src="//cdn.forevolve.com/blog/images/2017/azure-storage-access-keys.png">
    <figcaption>To access your Azure Storage <strong>Access Keys</strong> click on this menu item.</figcaption>
</figure>

###### Application settings
By default, Asp.Net Core 2 read from `appsettings.json`, `appsettings.{env.EnvironmentName}.json`, User Secrets and Environment Variables.

---

> See the source code of [WebHost.cs](https://github.com/aspnet/MetaPackages/blob/rel/2.0.0/src/Microsoft.AspNetCore/WebHost.cs#L157) for more information about the `CreateDefaultBuilder()` method which create the default configuration options.

---

We will use the first 3 of these settings location.
If we were to deploy our application, we would also use the Environment Variables as well.

To start, in the `appsettings.json`, we will add the default settings.
They are mostly placeholders but the `TableName`.

``` json
  "AzureTable": {
    "AccountKey": "[Configure your account key in secrets]",
    "AccountName": "[Configure your account name in secrets]",
    "TableName": "Ninja"
  }
```

In the `appsettings.Development.json` we will override the `TableName` to make sure that we are not writing to the "production" table (in case it is on the same Azure Storage Account). 

``` json
  "AzureTable": {
    "TableName": "NinjaDev"
  }
```

Finally, we will add our credentials to the User Secrets, using the secrets manager (don't worry, it is only JSON).

<figure>
    <header>Secret Manager</header>
    <blockquote>The Secret Manager tool stores sensitive data for development work outside of your project tree. The Secret Manager tool is a project tool that can be used to store secrets for a .NET Core project during development. With the Secret Manager tool, you can associate app secrets with a specific project and share them across multiple projects.</blockquote>
    <figcaption>Quoted from <a href="https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets#secret-manager">Safe storage of app secrets during development in ASP.NET Core</a>.</figcaption>
</figure>

To open the secrets manager, right-click the `ForEvolve.Blog.Samples.NinjaApi` project then clicks the `Manage User Secrets` menu item.

<figure>
    <img src="//cdn.forevolve.com/blog/images/2017/vs-right-click-manage-user-secrets.png">
    <figcaption>VS 2017: find the "Manage User Secrets" element in the project context menu.</figcaption>
</figure>

This should open an empty `secrets.json` file.
We will use this file to manage our credentials.

In my opinions, the biggest upside of secrets is that **it is located outside of the solution directory**.
Due to this, secrets are **not added to source control**, which gives the option of configuring **settings per developer** (connection strings, accounts, username, password, etc.). It also allow you to keep the production credentials somewhere else; developers might not even have access to production credentials.

<figure>
    <header>Warning</header>
    <blockquote>The Secret Manager tool does not encrypt the stored secrets and should not be treated as a trusted store. It is for development purposes only. The keys and values are stored in a JSON configuration file in the user profile directory.</blockquote>
    <figcaption>Quoted from <a href="https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets#secret-manager">Safe storage of app secrets during development in ASP.NET Core</a>.</figcaption>
</figure>

We will add our development credentials to `secrets.json`.

``` json
{
  "AzureTable": {
    "AccountKey": "some-key==",
    "AccountName": "some-account-name"
  }
}
```

##### That's it for Azure!
It takes way longer to write or read this part of the article than it takes to actually do the job.

As you can see, it is ultra easy to connect to Azure Table Storage when using the ForEvolve Framework.
You only need to define a few settings and register a few services.
There are other functionalities in the framework, but I will keep that for another day.

### That's it for the Ninja subsystem integration
Right now, if we run the API, we should be able to access the ninja's data from a browser or with a tool like Postman.

If we run our automated tests, everything should be green!

## The end of this article
Congratulation, you reached this end of the article series!

Moreover, **this end** was not a typo.
I have many ideas to build on top of the Ninja API: I might write articles based on this code in the future.

### What have we covered in this article?
In this article:

- We implemented the `NinjaRepository`
- We created the Ninja mapping subsystem
- We used `ForEvolve.Azure` to connect the Ninja App to Azure Table Storage
- We explored the new Asp.Net Core 2.0 default configuration and used 3 out of 4 of its sources.

I hope you enjoyed the little ForEvolve Framework glimpse, it is still a work in progress, and there are many functionalities that I would like to add to it (and probably a lot more that I have not thought of yet).

If you have any interest, question or time to invest: feel free to leave a comment here or open an issue in the [ForEvolve Framework GitHub](https://github.com/ForEvolve/ForEvolve-Framework) repository.

### What's next?
What's next?
You guys & gals tell me...

What are you up to now that you played a little around with Repositories, Services, and Web APIs?
Any project in mind?
A ninja game ahead?

I hope you enjoyed, feel free to leave a comment and happy coding!

{% include design-patterns-web-api-service-and-repository/footer.md %}
