---
title:  "Design Patterns: Asp.Net Core Web API, services, and repositories"
subtitle: "Part 10: the NinjaRepository and the ForEvolve.Azure"
date:   2017-09-13 00:00:00 -0500
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

It is now time to complete our Ninja subsystem! 

To be prepared, in the previous articles, we implemented a mapping subsystem and visited the Façade design pattern, we also created our data model and introduced Azure Table Storage.

In this article:

1. We will implement the `NinjaRepository`
1. We will connect the `NinjaRepository` to Azure Table Storage (which cost basically nothing)
1. I will introduce an open source framework that I am building; from that framework, the `ForEvolve.Azure` package will help us get things done faster than using `WindowsAzure.Storage` directly.<!--more-->

[Skip the shared part](#forevolveazure)

{% include design-patterns-web-api-service-and-repository/series.md %}

## ForEvolve.Azure
To access an Azure Table, we could use the Azure SDK or the REST API over HTTP.
However, I picked an even simpler solution: use and inject an `ITableStorageRepository<TModel>`; provided by `ForEvolve.Azure`.

*We will configure `ITableStorageRepository<TModel>` later, for now, let's just assume that it is working fine (it is just an interface after all).*

At the time of this writing, the `ITableStorageRepository<TModel>` interface look like this:

``` csharp
namespace ForEvolve.Azure.Storage.Table
{
    public interface ITableStorageRepository<TModel>
        where TModel : class, ITableEntity, new()
    {
        Task<IEnumerable<TModel>> ReadPartitionAsync(string partitionKey);
        Task<TModel> ReadOneAsync(string partitionKey, string rowkey);
        Task<IEnumerable<TModel>> ReadAllAsync();
        Task<TModel> InsertOrMergeAsync(TModel item);
        Task<TModel> InsertOrReplaceAsync(TModel item);
        Task<TModel> DeleteOneAsync(string partitionKey, string rowkey);
        Task<IEnumerable<TModel>> DeletePartitionAsync(string partitionKey);
        Task<TModel> InsertAsync(TModel item);
        Task<TModel> ReplaceAsync(TModel item);
        Task<TModel> MergeAsync(TModel item);
    }
}
```

`TModel` is the data model to read/write from/to Azure Table Storage.
In this case, `TModel` will be `NinjaEntity`.

As you can see, it is close to a CRUD repository interface with the following supported operations:

- Read all
- Read a partition
- Read an entity
- Delete an entity
- Delete a partition
- Replace an entity (update).
- Merge different entities (partial update).
- Insert a new entity.
- Insert and update can also use `InsertOrMergeAsync` and `InsertOrReplaceAsync` depending on your application needs.

---

> **ForEvolve Framework**
>
> The ForEvolve Framework is a toolbox that I am building to help speed up repetitive tasks, like accessing an Azure Table. 
> There are multiple helpers in it, and many more that I want to add.
>
> `ForEvolve.Azure` is part of the ForEvolve Framework meta package installed earlier.
>
> If this is not done already, install the `ForEvolve` meta-package from my [MyGet](https://www.myget.org/F/forevolve/api/v3/index.json) feed.
> If you do not know [How to use a custom NuGet feed in Visual Studio 2017](/en/articles/2017/08/06/how-to-use-a-custom-nuget-feed-in-visual-studio-2017/), feel free to take a look at that article.

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

---

> In another App, you should maybe consider using `InsertAsync` instead of `InsertOrReplaceAsync` if you want better control over your data.

---


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

---

> In another App, you should maybe consider using `ReplaceAsync` or `MergeAsync` instead of `InsertOrMergeAsync` if you want better control over your data.

---

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

- Delegate the call to `ITableStorageRepository<NinjaEntity>.DeleteOneAsync(partitionKey, rowkey)` 
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
            .Setup(x => x.DeleteOneAsync(clanName, ninjaKey))
            .ReturnsAsync(deletedEntity)
            .Verifiable();
        NinjaMappingServiceMock
            .Setup(x => x.Map(deletedEntity))
            .Returns(expectedNinja)
            .Verifiable();

        // Act
        var result = await RepositoryUnderTest.DeleteAsync(clanName, ninjaKey);

        // Assert
        NinjaEntityTableStorageRepositoryMock.Verify(x => x.DeleteOneAsync(clanName, ninjaKey), Times.Once);
        NinjaMappingServiceMock.Verify(x => x.Map(deletedEntity), Times.Once);
        Assert.Same(expectedNinja, result);
    }
}
```

The implementation code:

``` csharp
public async Task<Ninja> DeleteAsync(string clanName, string ninjaKey)
{
    var deletedEntity = await _ninjaEntityTableStorageRepository.DeleteOneAsync(clanName, ninjaKey);
    var deletedNinja = _ninjaMappingService.Map(deletedEntity);
    return deletedNinja;
}
```

## The end of this article
We finally have an `INinjaRepository` implementation: the `NinjaRepository` class and our Ninja API is almost completed!

The 53 passing tests give us the green light to continue and finalize the system.

### What have we covered in this article?
In this article:

- We implemented the `NinjaRepository` and used our Ninja mapping subsystem.
- We also used `ForEvolve.Azure` to connect the Ninja App to Azure Table Storage.

### What's next?
In the next and "final" article of this series, we will integrate our subsystems together!