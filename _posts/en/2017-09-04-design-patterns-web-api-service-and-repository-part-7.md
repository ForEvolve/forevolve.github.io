---
title:  "Design Patterns: Asp.Net Core Web API, services, and repositories"
subtitle: "Part 7: the NinjaService"
date:   2017-09-04 00:00:00 -0500
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
- Service Layer Pattern
proficiency-level: Intermediate
---

In the previous article, we defined most of the ninja sub-system and implemented the `NinjaController` while in the next article, we will implement the repository, talk about Azure Table Storage and the ForEvolve Framework.

You could see this article as 6.2 since I originally planned to write a single article for both the `NinjaController` and the `NinjaService`. 
Due to its size, I decided to split it in two.<!--more-->

[Skip the shared part](#ninjaservice)

{% include design-patterns-web-api-service-and-repository/series.md %}

## NinjaService
It is now the time to attack the `NinjaService` class!

### Creating the NinjaService
Again, we know the pattern, `NinjaService` must implement `INinjaService` and must use `INinjaRepository` to access the data source.
But this time, using the power of Dependency Injection, we will get an implementation of `IClanService` injected as well.
We will use `IClanService` to validate the ninja's clan.

Let's start with the empty class:

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Services
{
    public class NinjaService : INinjaService
    {
        private readonly INinjaRepository _ninjaRepository;
        private readonly IClanService _clanService;

        public NinjaService(INinjaRepository ninjaRepository, IClanService clanService)
        {
            _ninjaRepository = ninjaRepository ?? throw new ArgumentNullException(nameof(ninjaRepository));
            _clanService = clanService ?? throw new ArgumentNullException(nameof(clanService));
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

### Testing the NinjaService
The test pretty much speaks for themselves, besides the introduction of `.Verifiable()` and `.Verify()`.

---

> **Moq verifiable**
>
> Moq can keep track of what method has been call on our mocks.
> To enable that, you have to call the `Verifiable()` method after the `Setup()` method.
>
> Ex.: `NinjaRepositoryMock.Setup(x => x.DeleteAsync(clanName, ninjaKey)).Verifiable();`
>
> Then you can verify if that happened using one of the `Verify()` method overloads.
>
> Ex.: `NinjaRepositoryMock.Verify(x => x.DeleteAsync(clanName, ninjaKey));` would tell you the `DeleteAsync` method with arguments `clanName` and `ninjaKey` has been called at least once.
>
> You can also be more precise and specify the expected amount of calls.
>
> Ex.: `NinjaRepositoryMock.Verify(x => x.DeleteAsync(clanName, ninjaKey), Times.Never);` will be ok only if the `DeleteAsync` method with arguments `clanName` and `ninjaKey` has never been called.
>
> For more information, see [Moq quickstart verification](https://github.com/Moq/moq4/wiki/Quickstart#verification) section.

---

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Services
{
    public class NinjaServiceTest
    {
        protected NinjaService ServiceUnderTest { get; }
        protected Mock<INinjaRepository> NinjaRepositoryMock { get; }
        protected Mock<IClanService> ClanServiceMock { get; }

        public NinjaServiceTest()
        {
            NinjaRepositoryMock = new Mock<INinjaRepository>();
            ClanServiceMock = new Mock<IClanService>();
            ServiceUnderTest = new NinjaService(NinjaRepositoryMock.Object, ClanServiceMock.Object);
        }

        public class ReadAllAsync : NinjaServiceTest
        {
            [Fact]
            public async void Should_return_all_Ninja()
            {
                // Arrange
                var expectedNinjas = new Ninja[]
                {
                    new Ninja { Name = "Test Ninja 1" },
                    new Ninja { Name = "Test Ninja 2" },
                    new Ninja { Name = "Test Ninja 3" }
                };
                NinjaRepositoryMock
                    .Setup(x => x.ReadAllAsync())
                    .ReturnsAsync(expectedNinjas);

                // Act
                var result = await ServiceUnderTest.ReadAllAsync();

                // Assert
                Assert.Same(expectedNinjas, result);
            }
        }

        public class ReadAllInClanAsync : NinjaServiceTest
        {
            [Fact]
            public async void Should_return_all_Ninja_in_Clan()
            {
                // Arrange
                var clanName = "Some clan name";
                var expectedNinjas = new Ninja[]
                {
                    new Ninja { Name = "Test Ninja 1" },
                    new Ninja { Name = "Test Ninja 2" },
                    new Ninja { Name = "Test Ninja 3" }
                };
                NinjaRepositoryMock
                    .Setup(x => x.ReadAllInClanAsync(clanName))
                    .ReturnsAsync(expectedNinjas)
                    .Verifiable();
                ClanServiceMock
                    .Setup(x => x.IsClanExistsAsync(clanName))
                    .ReturnsAsync(true)
                    .Verifiable();

                // Act
                var result = await ServiceUnderTest.ReadAllInClanAsync(clanName);

                // Assert
                Assert.Same(expectedNinjas, result);
                NinjaRepositoryMock
                    .Verify(x => x.ReadAllInClanAsync(clanName), Times.Once);
                ClanServiceMock
                    .Verify(x => x.IsClanExistsAsync(clanName), Times.Once);
            }

            [Fact]
            public async void Should_throw_ClanNotFoundException_when_clan_does_not_exist()
            {
                // Arrange
                var unexistingClanName = "Some clan name";
                NinjaRepositoryMock
                    .Setup(x => x.ReadAllInClanAsync(unexistingClanName))
                    .Verifiable();
                ClanServiceMock
                    .Setup(x => x.IsClanExistsAsync(unexistingClanName))
                    .ReturnsAsync(false)
                    .Verifiable();

                // Act & Assert
                await Assert.ThrowsAsync<ClanNotFoundException>(() => ServiceUnderTest.ReadAllInClanAsync(unexistingClanName));

                NinjaRepositoryMock
                    .Verify(x => x.ReadAllInClanAsync(unexistingClanName), Times.Never);
                ClanServiceMock
                    .Verify(x => x.IsClanExistsAsync(unexistingClanName), Times.Once);
            }
        }

        public class ReadOneAsync : NinjaServiceTest
        {
            [Fact]
            public async void Should_return_OkObjectResult_with_a_Ninja()
            {
                // Arrange
                var clanName = "Some clan name";
                var ninjaKey = "Some ninja key";
                var expectedNinja = new Ninja { Name = "Test Ninja 1" };
                NinjaRepositoryMock
                    .Setup(x => x.ReadOneAsync(clanName, ninjaKey))
                    .ReturnsAsync(expectedNinja);

                // Act
                var result = await ServiceUnderTest.ReadOneAsync(clanName, ninjaKey);

                // Assert
                Assert.Same(expectedNinja, result);
            }

            [Fact]
            public async void Should_throw_NinjaNotFoundException_when_ninja_does_not_exist()
            {
                // Arrange
                var unexistingClanName = "Some clan name";
                var unexistingNinjaKey = "Some ninja key";
                NinjaRepositoryMock
                    .Setup(x => x.ReadOneAsync(unexistingClanName, unexistingNinjaKey))
                    .ReturnsAsync(default(Ninja));

                // Act & Assert
                await Assert.ThrowsAsync<NinjaNotFoundException>(() => ServiceUnderTest.ReadOneAsync(unexistingClanName, unexistingNinjaKey));
            }
        }

        public class CreateAsync : NinjaServiceTest
        {
            [Fact]
            public async void Should_create_and_return_the_created_Ninja()
            {
                // Arrange
                var expectedNinja = new Ninja();
                NinjaRepositoryMock
                    .Setup(x => x.CreateAsync(expectedNinja))
                    .ReturnsAsync(expectedNinja)
                    .Verifiable();

                // Act
                var result = await ServiceUnderTest.CreateAsync(expectedNinja);

                // Assert
                Assert.Same(expectedNinja, result);
                NinjaRepositoryMock.Verify(x => x.CreateAsync(expectedNinja), Times.Once);
            }
        }

        public class UpdateAsync : NinjaServiceTest
        {
            [Fact]
            public async void Should_update_and_return_the_updated_Ninja()
            {
                // Arrange
                const string ninjaKey = "Some key";
                const string clanKey = "Some clan";
                var expectedNinja = new Ninja
                {
                    Key = ninjaKey, 
                    Clan = new Clan { Name = clanKey }
                };
                NinjaRepositoryMock
                    .Setup(x => x.ReadOneAsync(clanKey, ninjaKey))
                    .ReturnsAsync(expectedNinja);
                NinjaRepositoryMock
                    .Setup(x => x.UpdateAsync(expectedNinja))
                    .ReturnsAsync(expectedNinja)
                    .Verifiable();

                // Act
                var result = await ServiceUnderTest.UpdateAsync(expectedNinja);

                // Assert
                Assert.Same(expectedNinja, result);
                NinjaRepositoryMock.Verify(x => x.UpdateAsync(expectedNinja), Times.Once);
            }

            [Fact]
            public async void Should_throw_NinjaNotFoundException_when_ninja_does_not_exist()
            {
                // Arrange
                var unexistingNinja = new Ninja { Key = "SomeKey", Clan = new Clan { Name = "Some clan" } };
                NinjaRepositoryMock
                    .Setup(x => x.UpdateAsync(unexistingNinja))
                    .Verifiable();
                NinjaRepositoryMock
                    .Setup(x => x.ReadOneAsync("Some clan", "SomeKey"))
                    .ReturnsAsync(default(Ninja))
                    .Verifiable();

                // Act & Assert
                await Assert.ThrowsAsync<NinjaNotFoundException>(() => ServiceUnderTest.UpdateAsync(unexistingNinja));

                // Make sure UpdateAsync is never hit
                NinjaRepositoryMock
                    .Verify(x => x.UpdateAsync(unexistingNinja), Times.Never);

                // Make sure we read the ninja from the repository before atempting an update.
                NinjaRepositoryMock
                    .Verify(x => x.ReadOneAsync("Some clan", "SomeKey"), Times.Once);
            }
        }

        public class DeleteAsync : NinjaServiceTest
        {
            [Fact]
            public async void Should_delete_and_return_the_deleted_Ninja()
            {
                // Arrange
                var clanName = "My clan";
                var ninjaKey = "Some key";
                var expectedNinja = new Ninja { Name = "Test Ninja 1" };
                NinjaRepositoryMock
                    .Setup(x => x.DeleteAsync(clanName, ninjaKey))
                    .ReturnsAsync(expectedNinja)
                    .Verifiable();
                NinjaRepositoryMock
                    .Setup(x => x.ReadOneAsync(clanName, ninjaKey))
                    .ReturnsAsync(expectedNinja);

                // Act
                var result = await ServiceUnderTest.DeleteAsync(clanName, ninjaKey);

                // Assert
                Assert.Same(expectedNinja, result);
                NinjaRepositoryMock.Verify(x => x.DeleteAsync(clanName, ninjaKey), Times.Once);
            }

            [Fact]
            public async void Should_throw_NinjaNotFoundException_when_ninja_does_not_exist()
            {
                // Arrange
                const string clanName = "Some clan name";
                const string ninjaKey = "Some ninja key";

                NinjaRepositoryMock
                    .Setup(x => x.DeleteAsync(clanName, ninjaKey))
                    .Verifiable();
                NinjaRepositoryMock
                    .Setup(x => x.ReadOneAsync(clanName, ninjaKey))
                    .ReturnsAsync(default(Ninja))
                    .Verifiable();

                // Act & Assert
                await Assert.ThrowsAsync<NinjaNotFoundException>(() => ServiceUnderTest.DeleteAsync(clanName, ninjaKey));

                // Make sure UpdateAsync is never hit
                NinjaRepositoryMock
                    .Verify(x => x.DeleteAsync(clanName, ninjaKey), Times.Never);

                // Make sure we read the ninja from the repository before atempting an update.
                NinjaRepositoryMock
                    .Verify(x => x.ReadOneAsync(clanName, ninjaKey), Times.Once);
            }
        }
    }
}
```

### Making the NinjaService tests pass
Let's do the same exercise again and make all `NinjaService` tests pass.

#### ReadAllAsync

**Should_return_all_Ninja**

``` csharp
public Task<IEnumerable<Ninja>> ReadAllAsync()
{
    return _ninjaRepository.ReadAllAsync();
}
```

Bam! down from 10 to 9 failing tests.

#### ReadAllInClanAsync

**Should_return_all_Ninja_in_Clan**

``` csharp
public Task<IEnumerable<Ninja>> ReadAllInClanAsync(string clanName)
{
    return _ninjaRepository.ReadAllInClanAsync(clanName);
}
```

And down from 9 to 8 failing tests.

**Should_throw_ClanNotFoundException_when_clan_does_not_exist**

``` csharp
public async Task<IEnumerable<Ninja>> ReadAllInClanAsync(string clanName)
{
    var isClanExist = await _clanService.IsClanExistsAsync(clanName);
    if (!isClanExist)
    {
        throw new ClanNotFoundException(clanName);
    }
    return await _ninjaRepository.ReadAllInClanAsync(clanName);
}
```

And now only 7 failing tests.

#### ReadOneAsync

**Should_return_OkObjectResult_with_a_Ninja**

``` csharp
public Task<Ninja> ReadOneAsync(string clanName, string ninjaKey)
{
    return _ninjaRepository.ReadOneAsync(clanName, ninjaKey);
}
```

And only 6 failing tests.

**Should_throw_NinjaNotFoundException_when_ninja_does_not_exist**

``` csharp
public async Task<Ninja> ReadOneAsync(string clanName, string ninjaKey)
{
    var ninja = await _ninjaRepository.ReadOneAsync(clanName, ninjaKey);
    if(ninja == null)
    {
        throw new NinjaNotFoundException(clanName, ninjaKey);
    }
    return ninja;
}
```

Down to 5 failing tests.

#### CreateAsync

**Should_create_and_return_the_created_Ninja**

``` csharp
public async Task<Ninja> CreateAsync(Ninja ninja)
{
    var createdNinja = await _ninjaRepository.CreateAsync(ninja);
    return createdNinja;
}
```

Down to 4 failing tests.

#### UpdateAsync

**Should_update_and_return_the_updated_Ninja**

``` csharp
public async Task<Ninja> UpdateAsync(Ninja ninja)
{
    var updatedNinja = await _ninjaRepository.UpdateAsync(ninja);
    return updatedNinja;
}
```

Only 3 failing tests are remaining.

**Should_throw_NinjaNotFoundException_when_ninja_does_not_exist**

``` csharp
public async Task<Ninja> UpdateAsync(Ninja ninja)
{
    var remoteNinja = await _ninjaRepository.ReadOneAsync(ninja.Clan.Name, ninja.Key);
    if (remoteNinja == null)
    {
        throw new NinjaNotFoundException(ninja.Clan.Name, ninja.Key);
    }
    var updatedNinja = await _ninjaRepository.UpdateAsync(ninja);
    return updatedNinja;
}
```

Almost done, only 2 failing tests are remaining.

#### DeleteAsync

**Should_delete_and_return_the_deleted_Ninja**

``` csharp
public Task<Ninja> DeleteAsync(string clanName, string ninjaKey)
{
    return _ninjaRepository.DeleteAsync(clanName, ninjaKey);
}
```

Only 1 failing test to go!

**Should_throw_NinjaNotFoundException_when_ninja_does_not_exist**

``` csharp
public async Task<Ninja> DeleteAsync(string clanName, string ninjaKey)
{
    var remoteNinja = await _ninjaRepository.ReadOneAsync(clanName, ninjaKey);
    if (remoteNinja == null)
    {
        throw new NinjaNotFoundException(clanName, ninjaKey);
    }
    var deletedNinja = await _ninjaRepository.DeleteAsync(clanName, ninjaKey);
    return deletedNinja;
}
```

Yeah! All tests are passing again!

### Some refactoring
If we take a look at the `NinjaService`, there is some code that is there multiple times.
Armed with our unit test suite, we can now start to refactor the `NinjaService` confidently!

**The refactoring target is:**

``` csharp
var ninja = await _ninjaRepository.ReadOneAsync(clanName, ninjaKey);
if(ninja == null)
{
    throw new NinjaNotFoundException(clanName, ninjaKey);
}
```

We use a similar code block in `ReadOneAsync`, `UpdateAsync` and `DeleteAsync` methods.
Let's create a method named `EnforceNinjaExistenceAsync` to keep our code [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)!

#### EnforceNinjaExistenceAsync method

``` csharp
private async Task<Ninja> EnforceNinjaExistenceAsync(string clanName, string ninjaKey)
{
    var remoteNinja = await _ninjaRepository.ReadOneAsync(clanName, ninjaKey);
    if (remoteNinja == null)
    {
        throw new NinjaNotFoundException(clanName, ninjaKey);
    }
    return remoteNinja;
}
```

#### ReadOneAsync, UpdateAsync and DeleteAsync updates

Here are the updated methods:

``` csharp
public async Task<Ninja> DeleteAsync(string clanName, string ninjaKey)
{
    await EnforceNinjaExistenceAsync(clanName, ninjaKey);
    var deletedNinja = await _ninjaRepository.DeleteAsync(clanName, ninjaKey);
    return deletedNinja;
}

public async Task<Ninja> ReadOneAsync(string clanName, string ninjaKey)
{
    var ninja = await EnforceNinjaExistenceAsync(clanName, ninjaKey);
    return ninja;
}

public async Task<Ninja> UpdateAsync(Ninja ninja)
{
    await EnforceNinjaExistenceAsync(ninja.Clan.Name, ninja.Key);
    var updatedNinja = await _ninjaRepository.UpdateAsync(ninja);
    return updatedNinja;
}
```

If we run our tests, all 39 tests are still passing.
This means that we broke nothing!

## Adding clan validation
Here is where it becomes more interesting. 
At the moment, the `NinjaService` is pretty dumb; we can create ninja in unexisting clans.
This should not be tolerated!

Let's add this domain logic to the API.
*As a reminder, the domain logic goes in the `Service`.*

You may or may not remember it, but the shot was already called, and the tooling is already here.
The `IClanService.IsClanExistsAsync` method does what we need to check the clan's existences.

### Adding our tests first
In both `CreateAsync` and `UpdateAsync` methods, there is no clan validation at all.
A user could create some ninja in unexisting clans, which could cause some problems.

To make sure that this cannot happen, we will start by adding the following two tests:

1. `CreateAsync+Should_throw_a_ClanNotFoundException_when_clan_does_not_exist`
1. `UpdateAsync+Should_throw_a_ClanNotFoundException_when_clan_does_not_exist`

We will update both `CreateAsync` and `UpdateAsync` methods one by one (I belive the writing will be clearer this way).

#### CreateAsync
First we will update the `Should_create_and_return_the_created_Ninja` test method to support the call to the `IClanService.IsClanExistsAsync` method.

Here is the updated method:

``` csharp
[Fact]
public async void Should_create_and_return_the_created_Ninja()
{
    // Arrange
    const string clanName = "Some clan name";
    var expectedNinja = new Ninja { Clan = new Clan { Name = clanName } };
    NinjaRepositoryMock
        .Setup(x => x.CreateAsync(expectedNinja))
        .ReturnsAsync(expectedNinja)
        .Verifiable();
    ClanServiceMock
        .Setup(x => x.IsClanExistsAsync(clanName))
        .ReturnsAsync(true);

    // Act
    var result = await ServiceUnderTest.CreateAsync(expectedNinja);

    // Assert
    Assert.Same(expectedNinja, result);
    NinjaRepositoryMock.Verify(x => x.CreateAsync(expectedNinja), Times.Once);
}
```

All tests should still pass.

**Should_throw_a_ClanNotFoundException_when_clan_does_not_exist**

Let's add the new failing test that backs our new specification.

``` csharp
[Fact]
public async void Should_throw_a_ClanNotFoundException_when_clan_does_not_exist()
{
    const string clanName = "Some clan name";
    var expectedNinja = new Ninja { Clan = new Clan { Name = clanName } };
    NinjaRepositoryMock
        .Setup(x => x.CreateAsync(expectedNinja))
        .ReturnsAsync(expectedNinja)
        .Verifiable();
    ClanServiceMock
        .Setup(x => x.IsClanExistsAsync(clanName))
        .ReturnsAsync(false);

    // Act & Assert
    await Assert.ThrowsAsync<ClanNotFoundException>(() => ServiceUnderTest.CreateAsync(expectedNinja));
    
    // Make sure CreateAsync is never called 
    NinjaRepositoryMock.Verify(x => x.CreateAsync(expectedNinja), Times.Never);
}
```

Our new test is failing (obviously).

**NinjaService.CreateAsync**
Let's make the new test pass!

``` csharp
public async Task<Ninja> CreateAsync(Ninja ninja)
{
    var clanExist = await _clanService.IsClanExistsAsync(ninja.Clan.Name);
    if (!clanExist)
    {
        throw new ClanNotFoundException(ninja.Clan);
    }
    var createdNinja = await _ninjaRepository.CreateAsync(ninja);
    return createdNinja;
}
```

Ok, all tests are passing again!

#### UpdateAsync
Now we will update both `Should_update_and_return_the_updated_Ninja` and `Should_throw_NinjaNotFoundException_when_ninja_does_not_exist` test methods to support the call to the `IClanService.IsClanExistsAsync` method by adding the following instruction to the "Arrange" section:

``` csharp
ClanServiceMock
    .Setup(x => x.IsClanExistsAsync(clanKey))
    .ReturnsAsync(true);
```

**Should_throw_a_ClanNotFoundException_when_clan_does_not_exist**

Then, we will add the following new failing test that backs our new specification.

``` csharp
[Fact]
public async void Should_throw_a_ClanNotFoundException_when_clan_does_not_exist()
{
    // Arrange
    const string ninjaKey = "SomeKey";
    const string clanKey = "Some clan";
    var unexistingNinja = new Ninja { Key = ninjaKey, Clan = new Clan { Name = clanKey } };
    NinjaRepositoryMock
        .Setup(x => x.UpdateAsync(unexistingNinja))
        .Verifiable();
    ClanServiceMock
        .Setup(x => x.IsClanExistsAsync(clanKey))
        .ReturnsAsync(false);

    // Act & Assert
    await Assert.ThrowsAsync<ClanNotFoundException>(() => ServiceUnderTest.UpdateAsync(unexistingNinja));

    // Make sure UpdateAsync is never called
    NinjaRepositoryMock
        .Verify(x => x.UpdateAsync(unexistingNinja), Times.Never);
}
```

Again, back to one failing test.

**NinjaService.UpdateAsync**

Let's make the new test pass!

``` csharp
public async Task<Ninja> UpdateAsync(Ninja ninja)
{
    var clanExist = await _clanService.IsClanExistsAsync(ninja.Clan.Name);
    if (!clanExist)
    {
        throw new ClanNotFoundException(ninja.Clan);
    }
    await EnforceNinjaExistenceAsync(ninja.Clan.Name, ninja.Key);
    var updatedNinja = await _ninjaRepository.UpdateAsync(ninja);
    return updatedNinja;
}
```

And all tests are now passign again!

### Some more refactoring
We repeated the same code block a few times; let's extract it to a method to keep our application DRY!

Then, lets refactor `ReadAllInClanAsync`, `CreateAsync` and `UpdateAsync` methods to use the following new method:

``` csharp
private async Task EnforceClanExistenceAsync(string clanName)
{
    var clanExist = await _clanService.IsClanExistsAsync(clanName);
    if (!clanExist)
    {
        throw new ClanNotFoundException(clanName);
    }
}
```

**`ReadAllInClanAsync`, `CreateAsync` and `UpdateAsync`**

``` csharp
public async Task<IEnumerable<Ninja>> ReadAllInClanAsync(string clanName)
{
    await EnforceClanExistenceAsync(clanName);
    return await _ninjaRepository.ReadAllInClanAsync(clanName);
}

public async Task<Ninja> CreateAsync(Ninja ninja)
{
    await EnforceClanExistenceAsync(ninja.Clan.Name);
    var createdNinja = await _ninjaRepository.CreateAsync(ninja);
    return createdNinja;
}

public async Task<Ninja> UpdateAsync(Ninja ninja)
{
    await EnforceClanExistenceAsync(ninja.Clan.Name);
    await EnforceNinjaExistenceAsync(ninja.Clan.Name, ninja.Key);
    var updatedNinja = await _ninjaRepository.UpdateAsync(ninja);
    return updatedNinja;
}
```

Ain't that code cleaner than our previous version?

---

> I believe that code like `await EnforceClanExistenceAsync(clanName);` is easier to read and to understand than it was in its previous form.
> It is almost plain English now, instead of raw code.

---

## The end of this article
Running all tests gives us the green light to continue toward the repository implementation, with 41 passing tests and no failing one.

### What have we covered in this article?
In this article, implemented  and added some domain logic to the `NinjaService`.
We also used our unit tests to ensure that our refactoring hadn't broken anything.

### What's next?
In the next article, we will implement the missing piece of the ninja subsystem: the `NinjaRepository`.
We will use Azure Table Storage to store our ninja's data.

I will also introduce my in-development ForEvolve Framework to access our data easily.

{% include design-patterns-web-api-service-and-repository/footer.md %}
