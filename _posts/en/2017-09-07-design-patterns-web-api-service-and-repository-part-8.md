---
title:  "Design Patterns: Asp.Net Core Web API, services, and repositories"
subtitle: "Part 8: the NinjaRepository, Azure table storage and the ForEvolve Framework"
date:   2017-09-07 00:00:00 -0500
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

So far, we implemented the clan's feature, using a static in-memory storage.
We also implemented most of the ninja feature, excluding the data-access logic, where we stopped at the `INinjaRepository` level.

In this article:

1. We will implement the `NinjaRepository`
1. We will connect the `NinjaRepository` to Azure Table Storage (which cost basically nothing)
1. I will introduce an open source framework that I am building; from that framework, the `ForEvolve.Azure` package will help us get things done faster than using `WindowsAzure.Storage` directly.
1. We will store our credentials using secrets instead of application settings.<!--more-->

[Skip the shared part](#azure-table-storage)

{% include design-patterns-web-api-service-and-repository/series.md %}

## Azure Table Storage
I will start by quoting Microsoft on this one:

<figure>
    <blockquote>
        Azure Table storage is a service that stores structured NoSQL data in the cloud, providing a key/attribute store with a schemaless design. Because Table storage is schemaless, it is easy to adapt your data as your application evolve. Access to Table storage data is fast and cost-effective for many types of applications and is typically lower in cost than traditional SQL for similar volumes of data.
    </blockquote>
    <figcaption>
        Quoted from 
        <a href="https://docs.microsoft.com/en-us/azure/storage/storage-dotnet-how-to-use-tables">Get started with Azure Table storage using .NET</a>
    </figcaption>
</figure>

In my word, an Azure Table is like a big SQL table with a composite key (`PartitionKey` + `RowKey`), but instead of user-defined columns (a schema), columns are variable, based on the entity you want to store in your table. 
More on that, it is cheap and fast. In my humble opinion, this is a great way to store data.

### The Storage Account
To get started:

1. You will need an Azure subscription (if you do not already have one, it requires a credit card, but MS will give you free credits. I also doubt that our Ninja API will cost you any money, no matter what - Table storage is cheap).
1. You will need to create an Azure Storage in your account

#### Create a subscription
To create a sub, go to [https://azure.microsoft.com](https://azure.microsoft.com) and follow the instructions.
This should be fairly easy.

If you already have one, great!

#### Create Azure Storage 
Once you have an Azure account, create a new Storage Account resource.

Managing your Azure resources is out of the scope of this article, so I will leave you on your own for a little while.

If you are clueless, feel free to start here: [Create a storage account](https://docs.microsoft.com/en-us/azure/storage/storage-create-storage-account#create-a-storage-account)

But basically, you click the green `+` sign, search for `storage`, select `Storage account - blob, file, table, queue` and click `Create`.

![Create Azure Storage Account](//cdn.forevolve.com/blog/images/2017/create-azure-storage.png)

Once this is done, you need to fill in the form presented to you.

---

> **Tip** 
>
> In the form, use the little "information icons" if you are not sure. 
> Microsoft made our life easier there...

---

#### Create an Azure Storage Table
We do not need to create a Table; it will be created automatically later.

## Data Model
As I previously stated: our data source will be an Azure Table Storage.
Indirectly, we will use the Azure SDK through `ForEvolve.Azure`.

---

> Azure Table (SDK) Rule #1
>
> Our entity classes (the objects that we want to store in an Azure Table) must implement `ITableEntity`.

---

That said, we need to create a new class that will represent the persisted `Ninja`'s data.
Let's call the ninja's data representation class `NinjaEntity`.
To make it easy, we will simply inherit from `TableEntity` instead of manually implementing `ITableEntity`.

Here is the `NinjaEntity` class:

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Models
{
    public class NinjaEntity : TableEntity
    {
        public string Name { get; set; }
        public int Level { get; set; }
    }
}
```

Compared to the `Ninja` class, there are a few missing properties, right?

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Models
{
    public class Ninja
    {
        public string Key { get; set; }
        public Clan Clan { get; set; }
        public string Name { get; set; }
        public int Level { get; set; }
    }
}
```

Actually, we are fine, `ITableEntity` has the following two required properties.

``` csharp
public string PartitionKey { get; set; }
public string RowKey { get; set; }
```

From the relational point of view, an Azure Table has a composite primary key, combining `PartitionKey` and `RowKey`.
There is more to it than that, but for this article, it will be enough.
To skip the database modeling part, we will use the clan name as the `PartitionKey` and the ninja key as the `RowKey`.

<aside>
    <header>
        Partitions
    </header>
    <figure>
        <blockquote>
            Partitions are always served from one partition server and each partition server can serve one or more partitions.
        </blockquote>
        <figcaption>
            <cite><a href="https://docs.microsoft.com/en-us/rest/api/storageservices/designing-a-scalable-partitioning-strategy-for-azure-table-storage#uyuyuyuyuy">Designing a Scalable Partitioning Strategy for Azure Table Storage</a></cite>
        </figcaption>
    </figure>
    <footer>
        <p>
            <strong>What does this mean?</strong><br>
            This means that with the current design, all ninja of a single clan will always be served by the same partition server.
            By assuming that a clan is united (fight together), this is a good scaling strategy.
        </p>
        <p>
            More over, we could also be <a href="https://docs.microsoft.com/en-us/rest/api/storageservices/Performing-Entity-Group-Transactions" target="_blank">Performing Entity Group Transactions</a>.
            To perform transactions, all entities must be in the same partition.
        </p>
    </footer>
</aside>

To be able to save our ninja in the Azure Table Storage, we will map `Ninja` objects to `NinjaEntity` objects as follow:

- `Ninja.Clan.Name` to `NinjaEntity.PartitionKey`
- `Ninja.Key` to `NinjaEntity.RowKey`
- `Ninja.Name` to `NinjaEntity.Name`
- `Ninja.Level` to `NinjaEntity.Level`

---

> **Tools**
>
> To keep the external dependencies low, we will code the mapping manually.
> In a real life project I would recommend the use of a library like
> [AutoMapper](http://automapper.org/).
> AutoMapper is a great tool that allows copying one object into another (and much more).

---

## NinjaMappingService
Before going further, we will create an `INinjaMappingService` interface that will become our "ninja mapping hub."

The `INinjaMappingService` responsibility is to offer a centralized and convenient way to convert `Ninja` to `NinjaEntity` and vice versa.
We will also need to convert `IEnumerable<NinjaEntity>` to `IEnumerable<Ninja>` (for the `ReadAll*()` methods).

In its current state, our Ninja App does not need to convert `IEnumerable<Ninja>` to `IEnumerable<NinjaEntity>` so we will omit that functionality to keep our project clean of useless code.
If the need of such operation ever arises, we will add it then, and only then.

> I could have added those methods directly in the `NinjaRepository` class, but remember SOLID and it single responsibility principle (SRP): **A class should have only one reason to change**.

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Services
{
    public interface INinjaMappingService
    {
        Ninja Map(NinjaEntity entity);
        NinjaEntity Map(Ninja ninja);
        IEnumerable<Ninja> Map(IEnumerable<NinjaEntity> entity);
    }
}
```

While thinking about it, a little more, I want to use `Ninja Map(NinjaEntity entity);` in `IEnumerable<Ninja> Map(IEnumerable<NinjaEntity> entity);`.
This could be a little harder to test than expected, which leads me to a more fine-grained design.

We will keep the `INinjaMappingService`, but it will simply become a **Façade**.

---

<aside>
    <section class="with-amazon-content">
        <figure class="blog-content">
            <header>Façade Pattern</header>
            <blockquote>The role of the Façade pattern is to provide different high-level views of subsystems whose details are hidden from users. In general, the operations that might be desirable from a user's perspective could be made up of different selections of parts of the subsystems.</blockquote>
            <figcaption>
                Excerpted from <cite>C# 3.0 Design Patterns: Use the Power of C# 3.0 to Solve Real-World Problems</cite> by Judith Bishop, published by O'Reilly Media.
                Two chapters are available online at <a href="https://msdn.microsoft.com/en-us/library/orm-9780596527730-01-04.aspx#Anchor_0">msdn.microsoft.com</a>.
            </figcaption>
        </figure>
        <aside class="amazon-content">
            <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=forevolve-20&marketplace=amazon&region=US&placement=059652773X&asins=059652773X&linkId=c1c10bedd9bfd94c53969aefe3e249a0&show_border=false&link_opens_in_new_window=true&price_color=404040&title_color=007f00&bg_color=ffffff"></iframe>
        </aside>
    </section>
    <footer>
        This is a great design patterns book. I highly recommend it.
    </footer>
</aside>

---

### Mapping subsystem
Behind our Façade hides the mapping subsystem.
I created a little visual representation of the design.

Beware, the schema looks complicated, but it is pretty simple.
The hard part was to represent the concept in a single diagram.

I used colors to identify elements.

- `Ninja Map(NinjaEntity entity);` reference color is blue.
- `NinjaEntity Map(Ninja ninja);` reference color is green.
- `IEnumerable<Ninja> Map(IEnumerable<NinjaEntity> entity);` reference color is yellow.

Let's take a look:

[![Ninja Mapper diagram](//cdn.forevolve.com/blog/images/2017/ninja-mapper-diagram.gif)](//cdn.forevolve.com/blog/images/2017/ninja-mapper-diagram.gif)

The first large red interface is a generic mapping interface with only one method defined: the `Map` method.

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Mappers
{
    public interface IMapper<TSource, TDestination>
    {
        TDestination Map(TSource entity);
    }
}
```

In the second "row" there are six interfaces. Those interfaces do not exist in code; they are simply defining the generic types of `IMapper<TSource, TDestination>`.
Even more, the first three are the same as the last three; I only needed more space to make the diagram clearer.

> :thought_balloon: I would have needed a 3D diagram to make this clearer...

#### The left side
We will create three classes, each one with a single mapping responsibility (implementing `IMapper<TSource, TDestination>`).

- `NinjaEntityToNinjaMapper` will implement `IMapper<NinjaEntity, Ninja>`
- `NinjaToNinjaEntityMapper` will implement `IMapper<Ninja, NinjaEntity>`
- `NinjaEntityEnumerableToNinjaMapper` will implement `IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>`

I will skip the implementation details since it is a little out of scope, but the full implementation and the tests are available at [GitHub](https://github.com/ForEvolve/ForEvolve.Blog.Samples/tree/master/8.%20NinjaApi%20-%20NinjaRepository/src/ForEvolve.Blog.Samples.NinjaApi/Mappers).
I will only keep the implementation of `NinjaMappingService` in the article.

> This is a very flexible design where each mapper is independent.

#### The right side

As you can maybe deduce from `IMapper<TSource, TDestination>` and the `INinjaMappingService` definition (and the diagram), `INinjaMappingService` can simply inherit from `IMapper<TSource, TDestination>` with three different generic pairs.

The updated `INinjaMappingService` interface now looks like this:

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Services
{
    public interface INinjaMappingService : IMapper<Ninja, NinjaEntity>, IMapper<NinjaEntity, Ninja>, IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>
    {
    }
}
```

The tricky part of the diagram was to illustrate the `NinjaMappingService` class relations. 

In words: `NinjaMappingService` implement `INinjaMappingService` and indirectly uses the three mappers. 
This makes `NinjaMappingService` coupled only with the `IMapper` interface, which keeps our application loosely coupled.

The full description goes as follow:

- `NinjaMappingService` implement `INinjaMappingService`.
- `NinjaMappingService` use an `IMapper<NinjaEntity, Ninja>`. The runtime implementation will be `NinjaEntityToNinjaMapper`.
- `NinjaMappingService` use an `IMapper<Ninja, NinjaEntity>`. The runtime implementation will be `NinjaToNinjaEntityMapper`.
- `NinjaMappingService` use a `IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>`. The runtime implementation will be `NinjaEntityEnumerableToNinjaMapper`.

This is the `Façade` I was talking about earlier. It gives access to the ninja mapping subsystem in a convenient and centralized way.
We could hide the individual mappers, we could create a mapping assembly, we could create a mapper factory, or we could have simply used `AutoMapper` :wink:.

The full `NinjaMappingService` looks like this:

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Services
{
    public class NinjaMappingService : INinjaMappingService
    {
        private readonly IMapper<Ninja, NinjaEntity> _ninjaToNinjaEntityMapper;
        private readonly IMapper<NinjaEntity, Ninja> _ninjaEntityToNinjaMapper;
        private readonly IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>> _ninjaEntityEnumerableToNinjaMapper;

        public NinjaMappingService(
            IMapper<Ninja, NinjaEntity> ninjaToNinjaEntityMapper, 
            IMapper<NinjaEntity, Ninja> ninjaEntityToNinjaMapper, 
            IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>> ninjaEntityEnumerableToNinjaMapper
        )
        {
            _ninjaToNinjaEntityMapper = ninjaToNinjaEntityMapper ?? throw new ArgumentNullException(nameof(ninjaToNinjaEntityMapper));
            _ninjaEntityToNinjaMapper = ninjaEntityToNinjaMapper ?? throw new ArgumentNullException(nameof(ninjaEntityToNinjaMapper));
            _ninjaEntityEnumerableToNinjaMapper = ninjaEntityEnumerableToNinjaMapper ?? throw new ArgumentNullException(nameof(ninjaEntityEnumerableToNinjaMapper));
        }

        public NinjaEntity Map(Ninja entity)
        {
            return _ninjaToNinjaEntityMapper.Map(entity);
        }

        public Ninja Map(NinjaEntity entity)
        {
            return _ninjaEntityToNinjaMapper.Map(entity);
        }

        public IEnumerable<Ninja> Map(IEnumerable<NinjaEntity> entities)
        {
            return _ninjaEntityEnumerableToNinjaMapper.Map(entities);
        }
    }
}
```

Once again, pretty simple code: easy to read, test and reuse.

### Unit tests
To keep the article shorter, I omitted the full mapping subsystem implementation and testing.
However, again, all the code is available on GitHub:

- [Mappers tests](https://github.com/ForEvolve/ForEvolve.Blog.Samples/tree/master/8.%20NinjaApi%20-%20NinjaRepository/test/ForEvolve.Blog.Samples.NinjaApi.Tests/Mappers)
- [NinjaMappingServiceTest](https://github.com/ForEvolve/ForEvolve.Blog.Samples/blob/master/8.%20NinjaApi%20-%20NinjaRepository/test/ForEvolve.Blog.Samples.NinjaApi.Tests/Services/NinjaMappingServiceTest.cs)

Also feel free to post any questions that you may have in the comments.

The `NinjaMappingServiceTest` class code looks like:

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Services
{
    public class NinjaMappingServiceTest
    {
        protected NinjaMappingService ServiceUnderTest { get; }
        protected Mock<IMapper<Ninja, NinjaEntity>> NinjaToNinjaEntityMapperMock { get; }
        protected Mock<IMapper<NinjaEntity, Ninja>> NinjaEntityToNinjaMapperMock { get; }
        protected Mock<IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>> NinjaEntityEnumerableToNinjaMapperMock { get; }

        public NinjaMappingServiceTest()
        {
            NinjaToNinjaEntityMapperMock = new Mock<IMapper<Ninja, NinjaEntity>>();
            NinjaEntityToNinjaMapperMock = new Mock<IMapper<NinjaEntity, Ninja>>();
            NinjaEntityEnumerableToNinjaMapperMock = new Mock<IMapper<IEnumerable<NinjaEntity>, IEnumerable<Ninja>>>();
            ServiceUnderTest = new NinjaMappingService(
                NinjaToNinjaEntityMapperMock.Object,
                NinjaEntityToNinjaMapperMock.Object,
                NinjaEntityEnumerableToNinjaMapperMock.Object
            );
        }

        [Fact]
        public void Map_Ninja_to_NinjaEntity_should_delegate_to_NinjaToNinjaEntityMapper()
        {
            // Arrange
            var ninja = new Ninja();
            var expectedEntity = new NinjaEntity();
            NinjaToNinjaEntityMapperMock
                .Setup(x => x.Map(ninja))
                .Returns(expectedEntity);

            // Act
            var result = ServiceUnderTest.Map(ninja);

            // Assert
            Assert.Same(expectedEntity, result);
        }

        [Fact]
        public void Map_NinjaEntity_to_Ninja_should_delegate_to_NinjaEntityToNinjaMapper()
        {
            // Arrange
            var ninjaEntity = new NinjaEntity();
            var expectedNinja = new Ninja();
            NinjaEntityToNinjaMapperMock
                .Setup(x => x.Map(ninjaEntity))
                .Returns(expectedNinja);

            // Act
            var result = ServiceUnderTest.Map(ninjaEntity);

            // Assert
            Assert.Same(expectedNinja, result);
        }

        [Fact]
        public void Map_NinjaEntityEnumerable_to_NinjaEnumerable_should_delegate_to_NinjaEntityEnumerableToNinjaMapper()
        {
            // Arrange
            var ninjaEntities = new List<NinjaEntity>();
            var expectedNinja = new List<Ninja>();
            NinjaEntityEnumerableToNinjaMapperMock
                .Setup(x => x.Map(ninjaEntities))
                .Returns(expectedNinja);

            // Act
            var result = ServiceUnderTest.Map(ninjaEntities);

            // Assert
            Assert.Same(expectedNinja, result);
        }
    }
}
```

Once again, due to the subsystem design, our tests are more than simple!
Note that I am not testing the mapping here but the Façade.
Each mapper has been previously tested individually (see the [source code](https://github.com/ForEvolve/ForEvolve.Blog.Samples/tree/master/8.%20NinjaApi%20-%20NinjaRepository/test/ForEvolve.Blog.Samples.NinjaApi.Tests/Mappers) or more information).

## ForEvolve.Azure
Another step: we need to access that Azure Table.
To do that, we could use the Azure SDK or even simpler: inject an `ITableStorageRepository<TEntity>`; provided by `ForEvolve.Azure`.

We will configure the use of `ITableStorageRepository<TEntity>` later, for now, let's just assume that it is working fine (it is just an interface after all).

`TEntity` is the entity to read/write.
In this case, `TEntity` is `NinjaEntity`.

---

> **ForEvolve Framework**
>
> The ForEvolve Framework is a toolbox that I am building to help speed up repetitive tasks, like accessing an Azure Table. 
> There are multiple helpers in it, and many more that I want to add.
>
> `ForEvolve.Azure` is part of the ForEvolve Framework meta package installed earlier.
>
> If this is not done already, install the `ForEvolve` meta-package from my [MyGet](https://www.myget.org/F/forevolve/api/v3/index.json) feed.
> If you do not know [How to use a custom NuGet feed in Visual Studio 2017](/en/articles/2017/08/06/how-to-use-a-custom-nuget-feed-in-visual-studio-2017/), feel free to take a look at this article.

---

## NinjaRepository
Back to our main business, let's create that `NinjaRepository` that we are talking about for so long!

- First, `NinjaRepository` must implement `INinjaRepository`.
- Second, we need an entity mapper: `INinjaMappingService`.
- Lastly, we need access to our Table Storage: `ITableStorageRepository<NinjaEntity>`.

Here goes the boilerplate code:

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Repositories
{
    public class NinjaRepository : INinjaRepository
    {
        private readonly INinjaMappingService _ninjaMappingService;
        private readonly ITableStorageRepository<NinjaEntity> _ninjaEntityTableStorageRepository;

        public NinjaRepository(INinjaMappingService ninjaMappingService, ITableStorageRepository<NinjaEntity> ninjaEntityTableStorageRepository)
        {
            _ninjaMappingService = ninjaMappingService ?? throw new ArgumentNullException(nameof(ninjaMappingService));
            _ninjaEntityTableStorageRepository = ninjaEntityTableStorageRepository ?? throw new ArgumentNullException(nameof(ninjaEntityTableStorageRepository));
        }

        public Task<Ninja> CreateAsync(Ninja ninja)
        {
            throw new NotImplementedException();
        }

        public Task<Ninja> DeleteAsync(string clanName, string ninjaKey)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Ninja>> ReadAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Ninja>> ReadAllInClanAsync(string clanName)
        {
            throw new NotImplementedException();
        }

        public Task<Ninja> ReadOneAsync(string clanName, string ninjaKey)
        {
            throw new NotImplementedException();
        }

        public Task<Ninja> UpdateAsync(Ninja ninja)
        {
            throw new NotImplementedException();
        }
    }
}
```

---

> **Ok, but wait! What! A repository in a repository? WTF is that thing?**
>
> **Short answer:**
> Why not?
>
> **Long answer:**
>
> `NinjaRepository` will be responsible for the mapping of domain entities to data entities and, for the data access logic.
>
> 1. `ITableStorageRepository<NinjaEntity>` will do the Azure Table Storage data access.
> 1. `INinjaMappingService` will do the mapping.
> 1. `NinjaRepository` will delegate both responsibilities to external classes, and will only keep the "data access orchestrator's hat" for itself.
>
> `NinjaService` will be kept in the dark about Azure because no `INinjaService` implementation should be aware of any dependency on Azure Storage; data is the responsibility of the Repository.
>
> Clean and lean!

---

### NinjaRepository tests
Enough chatting, let's just jump to the code once again then let's attack each operation one by one.

Let's begin with the `NinjaRepositoryTest` shared code:

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Repositories
{
    public class NinjaRepositoryTest
    {
        protected NinjaRepository RepositoryUnderTest { get; }

        protected Mock<INinjaMappingService> NinjaMappingServiceMock { get; }
        protected Mock<ITableStorageRepository<NinjaEntity>> NinjaEntityTableStorageRepositoryMock { get; }

        public NinjaRepositoryTest()
        {
            NinjaMappingServiceMock = new Mock<INinjaMappingService>();
            NinjaEntityTableStorageRepositoryMock = new Mock<ITableStorageRepository<NinjaEntity>>();
            RepositoryUnderTest = new NinjaRepository(
                NinjaMappingServiceMock.Object,
                NinjaEntityTableStorageRepositoryMock.Object
            );
        }

        // ...
    }
}
```

#### ReadAllAsync

`ReadAllAsync` should:

- Delegate the request to `ITableStorageRepository<NinjaEntity>.ReadAllAsync()` 
- Then map the entities back to ninja
- To finally return those ninjas

The test code:

``` csharp
public class ReadAllAsync : NinjaRepositoryTest
{
    [Fact]
    public async Task Should_map_ReadAll_and_return_the_expected_ninja()
    {
        // Arrange
        var entities = new NinjaEntity[0];
        var expectedNinja = new Ninja[0];
        
        NinjaEntityTableStorageRepositoryMock
            .Setup(x => x.ReadAllAsync())
            .ReturnsAsync(entities)
            .Verifiable();
        NinjaMappingServiceMock
            .Setup(x => x.Map(entities))
            .Returns(expectedNinja)
            .Verifiable();

        // Act
        var result = await RepositoryUnderTest.ReadAllAsync();

        // Assert
        NinjaMappingServiceMock
            .Verify(x => x.Map(entities), Times.Once);
        NinjaEntityTableStorageRepositoryMock
            .Verify(x => x.ReadAllAsync(), Times.Once);
        Assert.Same(expectedNinja, result);
    } 
}
```

The implementation code:

``` csharp
public async Task<IEnumerable<Ninja>> ReadAllAsync()
{
    var entities = await _ninjaEntityTableStorageRepository.ReadAllAsync();
    var ninja = _ninjaMappingService.Map(entities);
    return ninja;
}
```

#### ReadAllInClanAsync

`ReadAllInClanAsync` should:

- Delegate the request to `ITableStorageRepository<NinjaEntity>.ReadPartitionAsync(partitionKey)` 
- Then map the entities back to ninja
- To finaly return those ninja

The test code:

``` csharp
public class ReadAllInClanAsync : NinjaRepositoryTest
{
    [Fact]
    public async Task Should_map_ReadPartition_and_return_the_expected_ninja()
    {
        // Arrange
        var clanName = "My clan";
        var entities = new NinjaEntity[0];
        var expectedNinja = new Ninja[0];
        NinjaEntityTableStorageRepositoryMock
            .Setup(x => x.ReadPartitionAsync(clanName))
            .ReturnsAsync(entities)
            .Verifiable();
        NinjaMappingServiceMock
            .Setup(x => x.Map(entities))
            .Returns(expectedNinja)
            .Verifiable();

        // Act
        var result = await RepositoryUnderTest.ReadAllInClanAsync(clanName);

        // Assert
        NinjaMappingServiceMock
            .Verify(x => x.Map(entities), Times.Once);
        NinjaEntityTableStorageRepositoryMock
            .Verify(x => x.ReadPartitionAsync(clanName), Times.Once);
        Assert.Same(expectedNinja, result);
    }
}
```

The implementation code:

``` csharp
public async Task<IEnumerable<Ninja>> ReadAllInClanAsync(string clanName)
{
    var entities = await _ninjaEntityTableStorageRepository.ReadPartitionAsync(clanName);
    var ninja = _ninjaMappingService.Map(entities);
    return ninja;
}
```

#### ReadOneAsync

`ReadOneAsync` should:

- Delegate the request to `ITableStorageRepository<NinjaEntity>.ReadOneAsync(partitionKey, rowkey)` 
- Then map the entities back to ninja
- To finally return those ninjas

The test code:

``` csharp
public class ReadOneAsync : NinjaRepositoryTest
{
    [Fact]
    public async Task Should_map_ReadOne_and_return_the_expected_ninja()
    {
        // Arrange
        var clanName = "My clan";
        var ninjaKey = "123FB950-57DB-4CD0-B4D1-7E6B00A6163A";
        var entity = new NinjaEntity();
        var expectedNinja = new Ninja();

        NinjaEntityTableStorageRepositoryMock
            .Setup(x => x.ReadOneAsync(clanName, ninjaKey))
            .ReturnsAsync(entity)
            .Verifiable();
        NinjaMappingServiceMock
            .Setup(x => x.Map(entity))
            .Returns(expectedNinja)
            .Verifiable();

        // Act
        var result = await RepositoryUnderTest.ReadOneAsync(clanName, ninjaKey);

        // Assert
        NinjaMappingServiceMock
            .Verify(x => x.Map(entity), Times.Once);
        NinjaEntityTableStorageRepositoryMock
            .Verify(x => x.ReadOneAsync(clanName, ninjaKey), Times.Once);
        Assert.Same(expectedNinja, result);
    }
}
```

The implementation code:

``` csharp
public async Task<Ninja> ReadOneAsync(string clanName, string ninjaKey)
{
    var entity = await _ninjaEntityTableStorageRepository.ReadOneAsync(clanName, ninjaKey);
    var ninja = _ninjaMappingService.Map(entity);
    return ninja;
}
```

#### CreateAsync

`CreateAsync` should:

- Map the ninja to entity 
- Then delegate the call to `ITableStorageRepository<NinjaEntity>.InsertOrReplaceAsync(NinjaEntity item)` 
- Then map the entity back to ninja
- To finally return that new ninja

The test code:

``` csharp
public class CreateAsync : NinjaRepositoryTest
{
    [Fact]
    public async Task Should_map_InsertOrReplace_and_return_the_expected_ninja()
    {
        // Arrange
        var ninjaToCreate = new Ninja();
        var entityToCreate = new NinjaEntity();
        var createdEntity = new NinjaEntity();
        var expectedNinja = new Ninja();

        NinjaMappingServiceMock
            .Setup(x => x.Map(ninjaToCreate))
            .Returns(entityToCreate)
            .Verifiable();
        NinjaEntityTableStorageRepositoryMock
            .Setup(x => x.InsertOrReplaceAsync(entityToCreate))
            .ReturnsAsync(createdEntity)
            .Verifiable();
        NinjaMappingServiceMock
            .Setup(x => x.Map(createdEntity))
            .Returns(expectedNinja)
            .Verifiable();

        // Act
        var result = await RepositoryUnderTest.CreateAsync(ninjaToCreate);

        // Assert
        NinjaMappingServiceMock.Verify(x => x.Map(ninjaToCreate), Times.Once);
        NinjaEntityTableStorageRepositoryMock.Verify(x => x.InsertOrReplaceAsync(entityToCreate), Times.Once);
        NinjaMappingServiceMock.Verify(x => x.Map(createdEntity), Times.Once);
        Assert.Same(expectedNinja, result);
    }
}
```

The implementation code:

``` csharp
public async Task<Ninja> CreateAsync(Ninja ninja)
{
    var entityToCreate = _ninjaMappingService.Map(ninja);
    var createdEntity = await _ninjaEntityTableStorageRepository.InsertOrReplaceAsync(entityToCreate);
    var createNinja = _ninjaMappingService.Map(createdEntity);
    return createNinja;
}
```

#### UpdateAsync

`UpdateAsync` should:

- Map the ninja to entity 
- Then delegate the call to `ITableStorageRepository<NinjaEntity>.InsertOrMergeAsync(NinjaEntity item)` 
- Then map the entity back to ninja
- To finally return that new ninja

The test code:

``` csharp
public class UpdateAsync : NinjaRepositoryTest
{
    [Fact]
    public async Task Should_map_InsertOrMerge_and_return_the_expected_ninja()
    {
        // Arrange
        var ninjaToUpdate = new Ninja();
        var entityToUpdate = new NinjaEntity();
        var updatedEntity = new NinjaEntity();
        var expectedNinja = new Ninja();

        NinjaMappingServiceMock
            .Setup(x => x.Map(ninjaToUpdate))
            .Returns(entityToUpdate)
            .Verifiable();
        NinjaEntityTableStorageRepositoryMock
            .Setup(x => x.InsertOrMergeAsync(entityToUpdate))
            .ReturnsAsync(updatedEntity)
            .Verifiable();
        NinjaMappingServiceMock
            .Setup(x => x.Map(updatedEntity))
            .Returns(expectedNinja)
            .Verifiable();

        // Act
        var result = await RepositoryUnderTest.UpdateAsync(ninjaToUpdate);

        // Assert
        NinjaMappingServiceMock.Verify(x => x.Map(ninjaToUpdate), Times.Once);
        NinjaEntityTableStorageRepositoryMock.Verify(x => x.InsertOrMergeAsync(entityToUpdate), Times.Once);
        NinjaMappingServiceMock.Verify(x => x.Map(updatedEntity), Times.Once);
        Assert.Same(expectedNinja, result);
    }
}
```

The implementation code:

``` csharp
public async Task<Ninja> UpdateAsync(Ninja ninja)
{
    var entityToUpdate = _ninjaMappingService.Map(ninja);
    var updatedEntity = await _ninjaEntityTableStorageRepository.InsertOrMergeAsync(entityToUpdate);
    var updatedNinja = _ninjaMappingService.Map(updatedEntity);
    return updatedNinja;
}
```

#### DeleteAsync

`DeleteAsync` should:

- Delegate the call to `ITableStorageRepository<NinjaEntity>.RemoveAsync(partitionKey, rowkey)` 
- Then map the entity to ninja
- To finally return that deleted ninja

The test code:

``` csharp
public class DeleteAsync : NinjaRepositoryTest
{
    [Fact]
    public async Task Should_map_Remove_and_return_the_expected_ninja()
    {
        // Arrange
        var clanName = "My clan";
        var ninjaKey = "123FB950-57DB-4CD0-B4D1-7E6B00A6163A";
        var deletedEntity = new NinjaEntity();
        var expectedNinja = new Ninja();

        NinjaEntityTableStorageRepositoryMock
            .Setup(x => x.RemoveAsync(clanName, ninjaKey))
            .ReturnsAsync(deletedEntity)
            .Verifiable();
        NinjaMappingServiceMock
            .Setup(x => x.Map(deletedEntity))
            .Returns(expectedNinja)
            .Verifiable();

        // Act
        var result = await RepositoryUnderTest.DeleteAsync(clanName, ninjaKey);

        // Assert
        NinjaEntityTableStorageRepositoryMock.Verify(x => x.RemoveAsync(clanName, ninjaKey), Times.Once);
        NinjaMappingServiceMock.Verify(x => x.Map(deletedEntity), Times.Once);
        Assert.Same(expectedNinja, result);
    }
}
```

The implementation code:

``` csharp
public async Task<Ninja> DeleteAsync(string clanName, string ninjaKey)
{
    var deletedEntity = await _ninjaEntityTableStorageRepository.RemoveAsync(clanName, ninjaKey);
    var deletedNinja = _ninjaMappingService.Map(deletedEntity);
    return deletedNinja;
}
```

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
