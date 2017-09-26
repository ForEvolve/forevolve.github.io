---
title:  "Design Patterns: Asp.Net Core Web API, services, and repositories"
subtitle: "Part 11: Integration testing"
date:   2017-09-28 00:00:00 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2017-07-00-asp-net-core-design-patterns.png"
lang: en
categories: en/articles
tags: 
- Design Patterns
- Asp.Net Core
- Web API
- C#
- Integration Test
- XUnit
- Azure
- Azure Table Storage
- ForEvolve Framework
proficiency-level: Intermediate
---

In the previous article, we completed the last piece of the Ninja API.
In this article, we will glue all of these pieces together by:

- Creating integration tests to integrate the Ninja subsystem confidently
- Connecting the Ninja API to Azure Table Storage
- Leveraging the new Asp.Net Core 2.0 default configuration<!--more-->

[Skip the shared part](#integration-of-the-ninja)

{% include design-patterns-web-api-service-and-repository/series.md %}

## Integration of the Ninja
We now have a fully unit tested Ninja sub-system but, we still need to integrate it together if we want it to work.

---

> We could compare this to lego blocks.
> We first created the blocks, but we still have no castle built.

---

Let's first take a look at our original diagram:
<figure>
    <img src="//cdn.forevolve.com/blog/images/2017/controller-service-repo-ninja-with-DI.png">
    <figcaption>An HTTP request from the <code>Controller</code> to the data source, fully decoupled.</figcaption>
</figure>

We modified the `NinjaRepository` a little, adding two new dependencies:

- `INinjaMappingService` that help us map our ninja.
- `ITableStorageRepository<NinjaEntity>` that handles the Azure Table data access.

The new diagram looks like this:

<figure>
    <img src="//cdn.forevolve.com/blog/images/2017/controller-service-repo-ninja-with-DI-2.png">
    <figcaption>An HTTP request from the <code>Controller</code> to the data source, fully decoupled, including <code>NinjaRepository</code>'s dependencies.</figcaption>
</figure>

If we add the indirect `TableStorageRepository<NinjaEntity>` dependency, we end up with:

<figure>
    <img src="//cdn.forevolve.com/blog/images/2017/controller-service-repo-ninja-with-DI-3.png">
    <figcaption>An HTTP request from the <code>Controller</code> to the data source, fully decoupled, including <code>NinjaRepository</code>'s dependencies and the <code>ITableStorageRepository&lt;NinjaEntity&gt;</code> implementation.</figcaption>
</figure>

### Integration tests
The first thing we will do is plan our integration by creating some integration tests.
The goal behind integration testing is to make sure that all of our units work well together: that our software behaves as expected.

In this article, we will test the Ninja subsystem as a whole, but the data source.
Instead of using a real Azure Storage Table, we will `Mock` the `ForEvolve.Azure.Storage.Table.ITableStorageRepository<NinjaEntity>` interface, so the tests run faster and require less setup.
By doing this, it will also be easier to assess success and failure.

> The `ITableStorageRepository<NinjaEntity>` interface is not part of our system so we can assume that it is working as expected.
> More on that, we do not need to test it out, it is not part of the NinjaApi code.
>
> We could test against a real Azure Storage table or even against the local emulator, but it would have required more setup, which is the principal point I wanted to avoid.
>
> If I find the time, I would like to do that kind of end to end testing (and write about it) in a CI/CD pipeline using Postman/Newman against a real staging Azure Web App. But unfortunately not today.

That said, integration testing does not imply testing the whole system; for example, you could verify the integration of only two components together if you'd feel the need to. It is all about combining the units and making sure the system is working as intended.

> If you remember my Lego block example, it is now time to take those blocks and build a castle with them.

Integration testing is an essential part of testing your software and should not be overlooked. 
I find integration testing (especially end-to-end testing) to be more concrete than unit testing since it allows you to make sure the system behaves as expected, from a user point of view (ex.: make sure that a call to the API does what it should).
It is easier to see the benefit of it than unit tests.

While unit testing is necessary, especially for testing complex features, like algorithms implementation, domain logic, etc. I believe that integration testing is even more important since it focuses on testing the interaction of those units together. 
Of course combining both make sure that units, subsystems and the whole application works as expected, which is even better.

<aside>
    <section class="with-amazon-content">
        <section class="blog-content">
            <header>Test Driven Development</header>
            <p>If you are looking for an introductory book about the concepts behind Test Driven Development, I'd recommend the following. It has about 300 pages, so it is a pretty quick read. Nonetheless, I liked it. I think this book does a great job covering all the basics.</p>
            <p>Even if the book is a little old and the code samples in the book use NUnit instead of XUnit, the concepts remain; after all a test is a test, whatever the tools or the language behind it.</p>
        </section>
        <aside class="amazon-content">
            <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=forevolve-20&marketplace=amazon&region=US&placement=047064320X&asins=047064320X&linkId=09c9fcf83635ce3e79485f88e6debf29&show_border=false&link_opens_in_new_window=true&price_color=404040&title_color=007f00&bg_color=ffffff"></iframe>
        </aside>
    </section>
</aside>

Another point before jumping into the code: while using dependency injection help us decouple our system by moving the system composition responsibility outside of individual components, it also creates that new centralized "integration machine" that combines the units (at the composition root).

To increase the quality of our software, that composition must also be tested. 
We can see this as another significant role of integration testing.

<aside>
    <section class="with-amazon-content">
        <aside class="amazon-content">
            <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=forevolve-20&marketplace=amazon&region=US&placement=1935182501&asins=1935182501&linkId=795a99bab72f6d1a5063a3003a902876&show_border=false&link_opens_in_new_window=true&price_color=404040&title_color=007f00&bg_color=ffffff"></iframe>
        </aside>
        <section class="blog-content">
            <header>Dependency Injection</header>
            <p>I don't want to abuse on linking books, but talking about DI reminded me of this book that I read many years ago.</p>
            <p>
                If you are looking for a book, this is a great read on dependency injection.
                It explains the concepts behind DI very well.
                The book does not focus on .Net Core, but understanding the concepts is still pretty important and remains the same no matter what technology you are using. 
            </p>
            <p>
                I understand that there is a lot of information on the internet nowadays, but sometimes, books and papers still feel great.
                For those allergic to paper, there is still the electronic version :wink:.
            </p>
            <p>I highly recommend it.</p>
        </section>
    </section>
</aside>

#### ITableStorageRepository
Even if we (will) use a Mock, we still have to make sure that an implementation of `ITableStorageRepository<NinjaEntity>` is returned for our real system.
*I could also have phrased this: "especially since we used a Mock".*

Basically, we want to make sure that the units we are not directly testing (the mocked part) are correctly configured with our DI container.

Here is what we will not use in our integration tests:

- When asking for the `ITableStorageRepository<NinjaEntity>` service, the system should return a `TableStorageRepository<NinjaEntity>` instance.
- To build that instance, we will also need an `ITableStorageSettings` implementation, which will be an instance of the `TableStorageSettings` class.

The `ITableStorageSettings` is a simple interface:

``` csharp
public interface ITableStorageSettings : IStorageSettings
{
    string TableName { get; set; }
}

public interface IStorageSettings
{
    CloudStorageAccount CreateCloudStorageAccount();
}
```

The implementations looks like this:

``` csharp
public class TableStorageSettings : StorageSettings, ITableStorageSettings
{
    public string TableName { get; set; }
}

public abstract class StorageSettings : IStorageSettings
{
    public string AccountName { get; set; }
    public string AccountKey { get; set; }
    public bool UseHttps { get; set; } = true;

    public CloudStorageAccount CreateCloudStorageAccount()
    {
        return new CloudStorageAccount(new StorageCredentials(
            AccountName,
            AccountKey
        ), UseHttps);
    }
}
```

*See [ForEvolve.Azure.Storage](https://github.com/ForEvolve/ForEvolve-Framework/tree/master/src/ForEvolve.Azure/Storage) source code for more info.*

The `TableStorageSettings` class add one property to the three inherited from `StorageSettings`.

We will use those three properties:

- `AccountName`
- `AccountKey`
- `TableName`

> You could also use the `DevelopmentTableStorageSettings` class to test against the emulator during development instead of the `TableStorageSettings` class.

Now that we took a little look at the `ForEvolve.Azure.Storage` namespace, let's write those tests.

In the `StartupTest+ServiceProvider` class of the `ForEvolve.Blog.Samples.NinjaApi.IntegrationTests` project, we will add those two tests, enforcing the rules that have previously been stated:

``` csharp
[Fact]
public void Should_return_TableStorageSettings()
{
    // Arrange
    var serviceProvider = Server.Host.Services;

    // Act
    var result = serviceProvider.GetService<ITableStorageSettings>();

    // Assert
    var settings = Assert.IsType<TableStorageSettings>(result);
    Assert.NotNull(settings.AccountKey);
    Assert.NotNull(settings.AccountName);
    Assert.Equal("MyTableName", settings.TableName);
}
```

As you can see, we want to make sure that `AccountKey`, `AccountName`, and `TableName` are set.

> I am testing `AccountKey` and `AccountName` only against `NotNull` because I do not want to hard code any credentials in the project.
> We will set that up later using secrets.

``` csharp
[Fact]
public void Should_return_TableStorageRepository_of_NinjaEntity()
{
    // Arrange
    var serviceProvider = Server.Host.Services;

    // Act
    var result = serviceProvider.GetService<ITableStorageRepository<NinjaEntity>>();

    // Assert
    Assert.IsType<TableStorageRepository<NinjaEntity>>(result);
}
```

Once again, this is a pretty simple test enforcing the expected type of the `ITableStorageRepository<NinjaEntity>` service.

If we run those tests, they will fail. We will make them pass later.

#### NinjaControllerTest
Now that we made sure the `ITableStorageRepository<NinjaEntity>` implementation is tested, we can jump right to the `NinjaControllerTest` class.

The test initialization, shared by all tests, does as follow:

``` csharp
public class NinjaControllerTest : BaseHttpTest
{
    protected Mock<ITableStorageRepository<NinjaEntity>> TableStorageMock { get; }

    protected string ClanName1 => "Iga";
    protected string ClanName2 => "Kōga";

    public NinjaControllerTest()
    {
        TableStorageMock = new Mock<ITableStorageRepository<NinjaEntity>>();
    }

    protected override void ConfigureServices(IServiceCollection services)
    {
        services
            .AddSingleton(x => TableStorageMock.Object)
            .AddSingleton<IEnumerable<Clan>>(x => new List<Clan> {
                new Clan{ Name = ClanName1 },
                new Clan{ Name = ClanName2 }
            });
    }

    // ...
}
```

In this part of the `NinjaControllerTest` class, the `Mock<ITableStorageRepository<NinjaEntity>>` will play the role of the Azure Storage.
To do so, it needs to be registered in the `IServiceCollection`, overriding the default.
If we want to control the test clans (`IEnumerable<Clan>`), we also need to override that default as well. 

That said, do you remember our little refactoring about the extraction of the `EnforceNinjaExistenceAsync` method?
If you do, here is an extension method to help set it up in both `UpdateAsync` and `DeleteAsync` (making sure the validation pass):

``` csharp
public static class TableStorageMockExtensions
{
    public static NinjaEntity SetupEnforceNinjaExistenceAsync(this Mock<ITableStorageRepository<NinjaEntity>> tableStorageMock, string clanName, string ninjaKey)
    {
        var entity = new NinjaEntity(); // Only need to not be null
        tableStorageMock
            .Setup(x => x.ReadOneAsync(clanName, ninjaKey))
            .ReturnsAsync(entity);
        return entity;
    }
}
```

Then these few helpers have been created along the way:

``` csharp
public class NinjaControllerTest : BaseHttpTest
{
    // ...

    protected NinjaEntity CreateEntity(string clanName)
    {
        return CreateEntities(1, clanName).First();
    }

    protected IEnumerable<NinjaEntity> CreateEntities(int amountOfNinjaToCreate, string clanName)
    {
        for (int i = 0; i < amountOfNinjaToCreate; i++)
        {
            var ninja = new NinjaEntity
            {
                Level = i,
                Name = $"Ninja {i}",
                PartitionKey = clanName,
                RowKey = $"NinjaKey {i}"
            };
            yield return ninja;
        }
    }

    protected void AssertNinjaEntityEqualNinja(NinjaEntity entity, Ninja ninja)
    {
        Assert.Equal(entity.PartitionKey, ninja.Clan.Name);
        Assert.Equal(entity.RowKey, ninja.Key);
        Assert.Equal(entity.Name, ninja.Name);
        Assert.Equal(entity.Level, ninja.Level);
    }
}
```

These will help us compare `NinjaEntity` to `Ninja` as well as to create `NinjaEntity` classes.
All of our tests will be executed over HTTP against a real running instance of our Web API, so we can't just compare mocked references anymore.

Lets proceed method by method.

##### ReadAllAsync
We are validating that the ninja, returned by our Web API, are the one returned by our mocked database, the `TableStorageMock` `ReadAllAsync()` method.

``` csharp
public class ReadAllAsync : NinjaControllerTest
{
    [Fact]
    public async Task Should_return_all_ninja_in_azure_table()
    {
        // Arrange
        var superClanNinja = CreateEntities(amountOfNinjaToCreate: 2, clanName: ClanName1);
        var otherClanNinja = CreateEntities(amountOfNinjaToCreate: 2, clanName: ClanName2);
        var all = superClanNinja.Union(otherClanNinja).ToArray();
        var expectedNinjaLength = 4;

        TableStorageMock
            .Setup(x => x.ReadAllAsync())
            .ReturnsAsync(all);

        // Act
        var result = await Client.GetAsync("v1/ninja");

        // Assert
        result.EnsureSuccessStatusCode();
        var ninja = await result.Content.ReadAsJsonObjectAsync<Ninja[]>();
        Assert.NotNull(ninja);
        Assert.Equal(expectedNinjaLength, ninja.Length);
        Assert.Collection(ninja,
            n => AssertNinjaEntityEqualNinja(all[0], n),
            n => AssertNinjaEntityEqualNinja(all[1], n),
            n => AssertNinjaEntityEqualNinja(all[2], n),
            n => AssertNinjaEntityEqualNinja(all[3], n)
        );
    }
}
```

##### ReadAllInClanAsync
We are validating that the ninja, returned by our Web API, are the one returned by our mocked database, the `TableStorageMock` `ReadPartitionAsync()` method.

> As a reminder, our ninja's partition key is the clan's name, which leads us to request the whole partition to query all ninja of a single clan.
> This kind of design can also come in handy if we want to delete a whole clan (by simply deleting the partition).

``` csharp
public class ReadAllInClanAsync : NinjaControllerTest
{
    [Fact]
    public async Task Should_return_all_ninja_in_azure_table_partition()
    {
        // Arrange
        var expectedClanName = ClanName2;
        var expectedNinja = CreateEntities(amountOfNinjaToCreate: 2, clanName: expectedClanName).ToArray();
        var expectedNinjaLength = 2;

        TableStorageMock
            .Setup(x => x.ReadPartitionAsync(expectedClanName))
            .ReturnsAsync(expectedNinja);

        // Act
        var result = await Client.GetAsync($"v1/ninja/{expectedClanName}");

        // Assert
        result.EnsureSuccessStatusCode();
        var ninja = await result.Content.ReadAsJsonObjectAsync<Ninja[]>();
        Assert.NotNull(ninja);
        Assert.Equal(expectedNinjaLength, ninja.Length);
        Assert.Collection(ninja,
            n => AssertNinjaEntityEqualNinja(expectedNinja[0], n),
            n => AssertNinjaEntityEqualNinja(expectedNinja[1], n)
        );
    }
}
```

##### ReadOneAsync
We are validating that the ninja, returned by our Web API, is the one returned by our mocked database, the `TableStorageMock` `ReadOneAsync()` method.

``` csharp
public class ReadOneAsync : NinjaControllerTest
{
    [Fact]
    public async Task Should_return_one_ninja_from_azure_table()
    {
        // Arrange
        var expectedNinja = CreateEntity(ClanName1);
        var clanName = expectedNinja.PartitionKey;
        var ninjaKey = expectedNinja.RowKey;

        TableStorageMock
            .Setup(x => x.ReadOneAsync(clanName, ninjaKey))
            .ReturnsAsync(expectedNinja);

        // Act
        var result = await Client.GetAsync($"v1/ninja/{clanName}/{ninjaKey}");

        // Assert
        result.EnsureSuccessStatusCode();
        var ninja = await result.Content.ReadAsJsonObjectAsync<Ninja>();
        Assert.NotNull(ninja);
        AssertNinjaEntityEqualNinja(expectedNinja, ninja);
    }
}
```

##### CreateAsync
We are validating that the ninja, sent to our Web API, is the one received by our mocked database, the `TableStorageMock` `InsertOrReplaceAsync()` method.

``` csharp
public class CreateAsync : NinjaControllerTest
{
    [Fact]
    public async Task Should_create_the_ninja_in_azure_table()
    {
        // Arrange
        var ninjaToCreate = new Ninja
        {
            Name = "Bob",
            Level = 6,
            Key = "12345",
            Clan = new Clan { Name = ClanName1 }
        };
        var ninjaBody = ninjaToCreate.ToJsonHttpContent();

        var mapper = new Mappers.NinjaEntityToNinjaMapper();
        NinjaEntity createdEntity = null;
        TableStorageMock
            .Setup(x => x.InsertOrReplaceAsync(It.IsAny<NinjaEntity>()))
            .ReturnsAsync((NinjaEntity x) => {
                createdEntity = x;
                return x;
            });

        // Act
        var result = await Client.PostAsync("v1/ninja", ninjaBody);

        // Assert
        result.EnsureSuccessStatusCode();
        var ninja = await result.Content.ReadAsJsonObjectAsync<Ninja>();
        Assert.NotNull(ninja);
        Assert.NotNull(createdEntity);
        AssertNinjaEntityEqualNinja(createdEntity, ninja);
    }
}
```

##### UpdateAsync
We are validating that the ninja, sent to our Web API, is the one received by our mocked database, the `TableStorageMock` `InsertOrMergeAsync()` method.

``` csharp
public class UpdateAsync : NinjaControllerTest
{
    [Fact]
    public async Task Should_update_the_ninja_in_azure_table()
    {
        // Arrange
        var ninjaToUpdate = new Ninja
        {
            Clan = new Clan { Name = ClanName1 },
            Key = "Some UpdateAsync Ninja Key",
            Name = "My new name",
            Level = 1234
        };
        var ninjaBody = ninjaToUpdate.ToJsonHttpContent();

        NinjaEntity updatedEntity = null;
        TableStorageMock
            .Setup(x => x.InsertOrMergeAsync(It.IsAny<NinjaEntity>()))
            .ReturnsAsync((NinjaEntity n) =>
            {
                updatedEntity = n;
                return n;
            });
        TableStorageMock
            .SetupEnforceNinjaExistenceAsync(ClanName1, ninjaToUpdate.Key);

        // Act
        var result = await Client.PutAsync("v1/ninja", ninjaBody);

        // Assert
        result.EnsureSuccessStatusCode();
        var ninja = await result.Content.ReadAsJsonObjectAsync<Ninja>();
        Assert.NotNull(ninja);
        Assert.NotNull(updatedEntity);
        AssertNinjaEntityEqualNinja(updatedEntity, ninja);
    }
}
```

##### DeleteAsync
We are validating that the ninja, sent to our Web API, is the one received by our mocked database, the `TableStorageMock` `DeleteAsync()` method.

``` csharp
public class DeleteAsync : NinjaControllerTest
{
    [Fact]
    public async Task Should_delete_the_ninja_from_azure_table()
    {
        // Arrange
        var ninjaToDelete = CreateEntity(ClanName1);
        var clanName = ninjaToDelete.PartitionKey;
        var ninjaKey = ninjaToDelete.RowKey;

        TableStorageMock
            .SetupEnforceNinjaExistenceAsync(clanName, ninjaKey);
        TableStorageMock
            .Setup(x => x.DeleteOneAsync(clanName, ninjaKey))
            .ReturnsAsync(ninjaToDelete);

        // Act
        var result = await Client.DeleteAsync($"v1/ninja/{clanName}/{ninjaKey}");

        // Assert
        result.EnsureSuccessStatusCode();
        var ninja = await result.Content.ReadAsJsonObjectAsync<Ninja>();
        Assert.NotNull(ninja);
        AssertNinjaEntityEqualNinja(ninjaToDelete, ninja);
    }
}
```

As expected, since we have not defined any bindings, when we run all tests, our new integration tests fail.
However, we now know what we need to do: make them pass!

We could create more integration tests, but the level of test coverage is pretty high as it is (around 90% based on VS Test Coverage results).
Moreover, most code blocks that are not covered are the guard clauses, exceptions constructors and the `Startup` class. 
I am confident that these will not break anything at runtime (if you want 100% code coverage, I leave you to it).

### Startup dependencies
Now that our integration tests are ready, it is time to register our dependencies with the DI Container.

I divided the dependencies into three groups:

1. Mappers
1. Ninja
1. ForEvolve.Azure

#### Mappers
In `Startup.ConfigureServices`, we will add the following:

``` csharp
services.TryAddSingleton<IMapper<Ninja, NinjaEntity>, NinjaToNinjaEntityMapper>();
services.TryAddSingleton<IMapper<NinjaEntity, Ninja>, NinjaEntityToNinjaMapper>();
services.TryAddSingleton<IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>, EnumerableMapper<NinjaEntity, Ninja>>();
```

These define our three mappers:

1. `Ninja` to `NinjaEntity`
1. `NinjaEntity` to `Ninja`
1. `IEnumerable<NinjaEntity>` to `IEnumerable<Ninja>`

#### Ninja
In `Startup.ConfigureServices`, we will add the following:

``` csharp
services.TryAddSingleton<INinjaService, NinjaService>();
services.TryAddSingleton<INinjaRepository, NinjaRepository>();
services.TryAddSingleton<INinjaMappingService, NinjaMappingService>();
```

These represent our core Ninja pipeline.

> I put the `INinjaMappingService` in the ninja's section since it is more of a core service than a mapper (it is a Façade to our mapping subsystem remember?).

#### ForEvolve.Azure
This section is a little less strait-forward since we need to access configurations and use secrets.
Once you know all of this, it is as easy as the previous steps; let's cover all that up!

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

Once this is done, we can access our configurations, as easily as by using the `Configuration` property.

> Great job on this one and cheers to the Asp.Net Core team!
> Asp.Net was never as clean as Asp.Net Core, and Asp.Net Core 1.0 was not close to what Asp.Net Core 2.0 is now.
>
> Keep up the good work!

##### ConfigureServices

Now that we have access to `Configuration`, in `Startup.ConfigureServices`, we will add the following:

``` csharp
services.TryAddSingleton<ITableStorageRepository<NinjaEntity>, TableStorageRepository<NinjaEntity>>();
services.TryAddSingleton<ITableStorageSettings>(x => new TableStorageSettings
{
    AccountKey = Configuration.GetValue<string>("AzureTable:AccountKey"),
    AccountName = Configuration.GetValue<string>("AzureTable:AccountName"),
    TableName = Configuration.GetValue<string>("AzureTable:TableName")
});
```

<aside>
    <header>Alternate Code</header>
    <p>
        We could replace the binding of <code class="highlighter-rouge">ITableStorageSettings</code> with the following line of code and Asp.Net Core will parse all settings automatically:
    </p> 
    <div class="language-csharp highlighter-rouge"><pre class="highlight language-csharp"><code class=" language-csharp">services.TryAddSingleton&lt;ITableStorageSettings&gt;(x => 
        Configuration.GetSection("AzureTable").Get&lt;TableStorageSettings&gt;());</code></pre></div>
    <p>
        However, in the case of this article, I find it more explicit to bind each property individually, clearly illustrating the required data.
        Also, there were only three properties to bind which was trivial.
    </p>
    <p>That said, I pointed this out so you can use this alternate method in your own applications (if you didn't know).</p>
</aside>

Most of the classes and interfaces are taken from the `ForEvolve.Azure` assembly and will help us access Azure Table Storage.

The main class is `TableStorageRepository<NinjaEntity>`, bound to `ITableStorageRepository<NinjaEntity>`, that is injected in the `NinjaRepository`.
However, to create the `TableStorageRepository`, we need to provide an `ITableStorageSettings`, as talked about earlier.
The default `TableStorageSettings` implementation should do the job but, we needed to configure it.

As we previously saw, the `TableStorageSettings` values come from the application configurations, here is the description of each value:

- **AccountKey:** this is one of your Azure Storage "Access Keys."
- **AccountName:** this is your Azure Storage name, the one you entered during creation.
- **TableName:** this is the name of the table to use (you dont need to create anything, just define the name).

<aside>
    <header>AccountKey</header>
    <p>To find your <code>AccountKey</code>, go to Azure, find your Table Storage Account and click on the `Access Keys` menu item.</p>
    <figure>
        <img src="//cdn.forevolve.com/blog/images/2017/azure-storage-access-keys.png">
        <figcaption>To access your Azure Storage <strong>Access Keys</strong> click on this menu item.</figcaption>
    </figure>
</aside>

###### Application settings
We now know what we need and that our values should come from the application configuration, but we don't know how Asp.Net Core handles all of that. In Asp.Net Core 2.0, it is simpler than ever: by default, it read the application settings from `appsettings.json`, `appsettings.{env.EnvironmentName}.json`, User Secrets and Environment Variables, in that order. 
This gives us a lot of possibilities and is provided to us with this simple call: `WebHost.CreateDefaultBuilder(args)`.

---

> See the source code of [WebHost.cs](https://github.com/aspnet/MetaPackages/blob/rel/2.0.0/src/Microsoft.AspNetCore/WebHost.cs#L157) for more information about the `CreateDefaultBuilder()` method which creates the default configuration options.

---

We will configure and use the first 3 of these settings locations.

To start, in the `appsettings.json`, we will add the default settings which are mostly placeholders but the `TableName`.

``` json
  "AzureTable": {
    "AccountKey": "[Configure your account key in secrets]",
    "AccountName": "[Configure your account name in secrets]",
    "TableName": "Ninja"
  }
```

In the `appsettings.Development.json` we will override the `TableName` to make sure that we are not writing to the "staging" table (in case it is on the same Azure Storage Account). 

``` json
  "AzureTable": {
    "TableName": "NinjaDev"
  }
```

> **Tips**
>
> In case of a real project, I would recommend storing production data in a different Storage Account than dev/testing.
>
> Why? 
> So many things can go wrong so fast that I don't even know where to start...
> Just don't use the same storage account.

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
Due to this, secrets are **not added to source control**, which gives the option of configuring **settings per developer** (connection strings, accounts, username, password, etc.). 
It is also allowing you to keep the production credentials somewhere else; developers might not even have access to production credentials.

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

---

> **Where are those secret?**
> 
> Secrets are saved in `%APPDATA%\microsoft\UserSecrets\<userSecretsId>\secrets.json` file.
> Visual Studio knows about `<userSecretsId>` using the value of the `UserSecretsId` tag located in the `csproj` file.
>
> Ex.: in the `ForEvolve.Blog.Samples.NinjaApi.csproj` file: `<UserSecretsId>aspnet-ForEvolve.Blog.Samples.NinjaApi-F62B525A-ACF4-4C7C-BF23-1EB0F434DDE5</UserSecretsId>`

---

##### That's it for Azure!
It takes way longer to write or read this part of the article than it takes to actually do the job.

As you can see, it is ultra easy to connect to Azure Table Storage when using the ForEvolve Framework.
You only need to define a few settings and register a few services.
There are other functionalities in the framework, but I will keep that for another day.

### That's it for the Ninja subsystem integration
At this point, if we run our automated tests, everything should be green!

We should also be able to access the ninja's data from a browser or with a tool like Postman by running the API (`F5`).
We could also build a UI on top of it.

## The end of this article
Congratulation, you reached this end of the article series!

Moreover, **this end** was not a typo.
I have many ideas to build on top of the Ninja API; yes, I might write articles based on this code in the future.

---

> **Backstory of this article series**
> 
> I initially planned on writing a single article (epic fail).
> It quickly became a 5-8 article series.
> However, the 8th part was becoming so long that I split it into 3 pieces, adding a little to each piece.
> Which, after countless hours, led to this 11 article series.

---

### What have we covered in this article?
In this article:

- We created integration tests, testing the API over HTTP (in-memory)
- We integrated the Ninja subsystem
- We used `ForEvolve.Azure` to connect the Ninja App to Azure Table Storage
- We explored the new Asp.Net Core 2.0 default configuration

I hope you enjoyed the little glimpse of the ForEvolve Framework, it is still a work in progress, and there are many functionalities that I would like to add to it (and probably a lot more that I have not thought of yet).

If you have any interest, question, request or time to invest: feel free to leave a comment here or open an issue in the [ForEvolve Framework GitHub](https://github.com/ForEvolve/ForEvolve-Framework) repository.

### What's next?
What's next?
You guys tell me.

- What are you up to now that you played a little around with Repositories, Services, and Web APIs?
- Any project in mind?
- Maybe a ninja game ahead?

I hope you enjoyed, feel free to leave a comment and happy coding!

{% include design-patterns-web-api-service-and-repository/footer.md %}
