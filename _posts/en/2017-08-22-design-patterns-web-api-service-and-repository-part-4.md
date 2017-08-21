---
title:  "Design Patterns: Asp.Net Core Web API, services, and repositories"
subtitle: "Part 4: Services and the ClanService"
date:   2017-08-22 00:00:00 -0500
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

In the last article, we built the empty `ClansController`.
We also created a failing test for its only action.
That test is testing our expectation of the `ClansController.ReadAllAsync()` action.
However, since our action's body is composed of only that one line: `throw new NotImplementedException();`; it cannot pass.

In this article, we will focus on the services part of the patterns.
To do so, we will create the `IClanService` interface and its default implementation, the `ClanService` class.
In the process, we will update the `ClansController` and ensure that its test pass.
As you may expect, we will also create unit tests for the `ClanService` class.<!--more-->

[Skip the shared part](#services)

{% include design-patterns-web-api-service-and-repository/series.md %}

## Services
As we saw in the first part of the series, a controller must delegate the domain logic to an external class; **the service will play that role.**

---

> A service should encapsulate a unit of domain logic.
> For this article, that unit is the **clans**.

---

## Creation of the `IClanService` interface
A service could be seen as an extension of the controller or as a "unit of domain logic." 
In the case of the `IClanService`, we will implement more methods that our controller offers to our clients.

*I may use those methods in a future article, but for now, it will help me explain the concept behind the service.*

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Services
{
    public interface IClanService
    {
        Task<IEnumerable<Clan>> ReadAllAsync();
        Task<Clan> ReadOneAsync(string clanName);
        Task<bool> IsClanExistsAsync(string clanName);
        Task<Clan> CreateAsync(Clan clan);
        Task<Clan> UpdateAsync(Clan clan);
        Task<Clan> DeleteAsync(string clanName);
    }
}
```

If we take a closer look at our domain logic, we have [CRUD operations](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) and a validation method that tells us if a clan exist or not.

For example, in another article, we will use the `IsClanExistsAsync` method to ensure that ninjas are not trying to trick us with fake clans!

## Controller update
Now, we will update our controller, so it uses our new service interface, and we will use `Moq` to `Mock<T>` the service in our controller tests.

### What is a Mock?
<figure>
    <blockquote>
        <strong>Mocks</strong> are objects [...] pre-programmed with expectations which form a specification of the calls they are expected to receive.
    </blockquote>
    <figcaption>
        Definition by Martin Fowler in its article 
        <a href="https://martinfowler.com/articles/mocksArentStubs.html#TheDifferenceBetweenMocksAndStubs">
            <cite>Mocks Aren't Stubs</cite>
        </a>
    </figcaption>
</figure>

### What is Moq?
<figure>
    <blockquote>
        <strong>Moq</strong> is the most popular and friendly mocking framework for .NET
    </blockquote>
    <figcaption>
        Definition by the Moq Team,
        from there <a href="https://github.com/moq/moq4">GitHub repository</a> page.
    </figcaption>
</figure>


### ClansController
Since we defined the `IClanService` we can now use its `ReadAllAsync` method in the `ClansController`.
The `throw new NotImplementedException();` was fun, but not that fun.
It is now the time to get rid of it and complete our `ClansController` implementation.

This is the nice thing about decoupling code with interfaces; we can update the controller only by using a contract (interface).
We do not even need a working implementation. 
Moreover, this also means that the injected service can be of any type, as long as it implements the contract, leading to a flexible system.

Let's read some code that speaks for itself.

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Controllers
{
    [Route("v1/[controller]")]
    public class ClansController : Controller
    {
        private readonly IClanService _clanService;

        public ClansController(IClanService clanService) // Injection of IClanService
        {
            _clanService = clanService ?? throw new ArgumentNullException(nameof(clanService)); // Guard
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Clan>), 200)]
        public async Task<IActionResult> ReadAllAsync()
        {
            throw new NotImplementedException();
        }
    }
}
```

**What have we changed?**

- We prepared the `ClansController` to have a `IClanService` implementation injected in its constructor.
- We added a guard clause to make sure it is not `null`. *See [Part 2: Dependency Injection](/en/articles/2017/07/08/design-patterns-web-api-service-and-repository-part-2/) for more info.*

### ClansControllerTest
Now that we updated the `ClansController`, it is time to update our `ClansControllerTest` class as well.

Let's jump into some more code.

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Controllers
{
    public class ClansControllerTest
    {
        protected ClansController ControllerUnderTest { get; }
        protected Mock<IClanService> ClanServiceMock { get; }

        public ClansControllerTest()
        {
            ClanServiceMock = new Mock<IClanService>(); // IClanService mock
            ControllerUnderTest = new ClansController(ClanServiceMock.Object);
        }

        public class ReadAllAsync : ClansControllerTest
        {
            [Fact]
            public async void Should_return_OkObjectResult_with_a_list_clans()
            {
                // Arrange
                var expectedClans = new Clan[]
                {
                    new Clan { Name = "Test clan 1" },
                    new Clan { Name = "Test clan 2" },
                    new Clan { Name = "Test clan 3" }
                };
                ClanServiceMock
                    .Setup(x => x.ReadAllAsync())
                    .ReturnsAsync(expectedClans); // Mocked the ReadAllAsync() method

                // Act
                var result = await ControllerUnderTest.ReadAllAsync();

                // Assert
                var okResult = Assert.IsType<OkObjectResult>(result);
                Assert.Same(expectedClans, okResult.Value);
            }
        }
    }
}
```

**What have we changed?**

- We created an `IClanService` mock to simulate a service implementation (we are testing our controller, not the service itself).
- We mocked the `ReadAllAsync()` method to return our `expectedClans` collection (we could also see this as **controlling dependencies behaviors**).

---

> If we run the test, it will still fail, but it is expected and ok.
> I am taking my time, doing it step by step, to explore the mental process behind programming and testing.
> I could only show off some code, but GitHub is there for you if that is what you want.

---

### Lets make this test pass
Back to our `ClansController`, it is time for that test to pass, right?

Let's jump right to the code again.

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Controllers
{
    [Route("v1/[controller]")]
    public class ClansController : Controller
    {
        private readonly IClanService _clanService;

        public ClansController(IClanService clanService)
        {
            _clanService = clanService ?? throw new ArgumentNullException(nameof(clanService));
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Clan>), 200)]
        public async Task<IActionResult> ReadAllAsync()
        {
            var allClans = await _clanService.ReadAllAsync();
            return Ok(allClans);
        }
    }
}
```

**What have we changed?**

We replaced the `throw new NotImplementedException();` with the following two lines, making our test pass.

But what are those lines do?

- `var allClans = await _clanService.ReadAllAsync();` delegate the responsability of everthing but the HTTP request to the `IClanService` and get a collection of `Clan` in return.
- `return Ok(allClans);` return an HTTP status code `200 OK` to the client; with, as the response body, the clans.

If we take a second look, the controller now handles both the HTTP request and response delegating the domain logic to the service, which was pretty much our initial description. 
The controller is not aware of anything else.

## The service
Now that the `ClansController` test pass and the `IClanService` interface is defined, it is time to create the `ClanService` class (the class name is unexpected, right?).

We will create the class in the `Services` directory; leading to the following VS-implemented interface skeleton.

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Services
{
    public class ClanService : IClanService
    {
        public Task<Clan> CreateAsync(Clan clan)
        {
            throw new NotImplementedException();
        }

        public Task<Clan> DeleteAsync(string clanName)
        {
            throw new NotImplementedException();
        }

        public Task<bool> IsClanExistsAsync(string clanName)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Clan>> ReadAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Clan> ReadOneAsync(string clanName)
        {
            throw new NotImplementedException();
        }

        public Task<Clan> UpdateAsync(Clan clan)
        {
            throw new NotImplementedException();
        }
    }
}
```

### Testing the ClanService class
Before going further, let's write some tests about our expectations of the service behaviors.

We are creating an in-memory implementation of the `IClanService` interface. 
Why? Because this will let us cover the design pattern before connecting a real data source to the project.
This will also give us the opportunity to talk about and use the patterns twice.

1. Let's start with `ReadAllAsync`: this method is expected to return all the clans.
1. `ReadOneAsync` should return the `Clan` object or `null` if the clan does not exist.
1. `IsClanExistsAsync` should return `true` if the `Clan` exists, otherwise it should return `false`.
1. `CreateAsync`, `UpdateAsync` and `DeleteAsync` should all throw a `NotSupportedException` since no data is persisted anywhere but in-memory.

---

> **Why throw NotSupportedException?**
>
> I throw a `NotSupportedException` because the component does not support the operations (yet).
> 
> I could have omitted the `CreateAsync`, `UpdateAsync` and `DeleteAsync` methods from the interface. 
> But the day that I want to move my clans to a real database (which should happen one day or another), I would have to change my `IClanService` interface, which could break other parts of the system.
> This is especially true if there are external references on the assembly (in another scenario).
> Of course, in this demo project we can easily assess the consequences of such modifications, but in a real project, this can quickly become harder.
>
> I could also have implemented the full Clans API (in the `ClansController`) exposing all CRUD operations.
> In this case, the `NotSupportedException` would have told the consumers that the service does not (yet) support that operation.
>
> As a last note on this, usually, you do not want additional operations and unnecessary code, you want to keep your system to what is necessary and only to that. 
> Adding functionalities that are not used only add to the project maintenance cost.

---

**All of these expectations in code looks like this:**

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Services
{
    public class ClanServiceTest
    {
        protected ClanService ServiceUnderTest { get; }

        public ClanServiceTest()
        {
            ServiceUnderTest = new ClanService();
        }

        public class ReadAllAsync : ClanServiceTest
        {
            [Fact]
            public async Task Should_return_all_clansAsync()
            {
                // Arrange
                var expectedClans = new ReadOnlyCollection<Clan>(new List<Clan>
                {
                    new Clan { Name = "My Clan" },
                    new Clan { Name = "Your Clan" },
                    new Clan { Name = "His Clan" }
                });

                // Act
                var result = await ServiceUnderTest.ReadAllAsync();

                // Assert
                Assert.Same(expectedClans, result);
            }
        }

        public class ReadOneAsync : ClanServiceTest
        {
            [Fact]
            public async Task Should_return_the_expected_clanAsync()
            {
                // Arrange
                var clanName = "My Clan";
                var expectedClan = new Clan { Name = clanName };

                // Act
                var result = await ServiceUnderTest.ReadOneAsync(clanName);

                // Assert
                Assert.Same(expectedClan, result);
            }

            [Fact]
            public async Task Should_return_null_if_the_clan_does_not_existAsync()
            {
                // Arrange
                var clanName = "My Clan";

                // Act
                var result = await ServiceUnderTest.ReadOneAsync(clanName);

                // Assert
                Assert.Null(result);
            }
        }

        public class IsClanExistsAsync : ClanServiceTest
        {
            [Fact]
            public async Task Should_return_true_if_the_clan_existAsync()
            {
                // Arrange
                var clanName = "Your Clan";

                // Act
                var result = await ServiceUnderTest.IsClanExistsAsync(clanName);

                // Assert
                Assert.True(result);
            }
            [Fact]
            public async Task Should_return_false_if_the_clan_does_not_existAsync()
            {
                // Arrange
                var clanName = "Unexisting Clan";

                // Act
                var result = await ServiceUnderTest.IsClanExistsAsync(clanName);

                // Assert
                Assert.False(result);
            }
        }

        public class CreateAsync : ClanServiceTest
        {
            [Fact]
            public async Task Should_create_and_return_the_specified_clanAsync()
            {
                // Arrange, Act, Assert
                var exception = await Assert.ThrowsAsync<NotSupportedException>(() => ServiceUnderTest.CreateAsync(null));
            }
        }

        public class UpdateAsync : ClanServiceTest
        {
            [Fact]
            public async Task Should_update_and_return_the_specified_clan()
            {
                // Arrange, Act, Assert
                var exception = await Assert.ThrowsAsync<NotSupportedException>(() => ServiceUnderTest.UpdateAsync(null));
            }
        }

        public class DeleteAsync : ClanServiceTest
        {
            [Fact]
            public async Task Should_delete_and_return_the_specified_clan()
            {
                // Arrange, Act, Assert
                var exception = await Assert.ThrowsAsync<NotSupportedException>(() => ServiceUnderTest.DeleteAsync(null));
            }
        }
    }
}
```

## The end of this article
At this point, if we hit the "Run All" button of the Visual Studio "Test Explorer" window, we should see one passing test and eight failing tests.

Again, this may not sound that good, but it is.
In the next article, we will write enough code to have all of our tests pass.

### What have we covered in this article?
We talked about the service's role.
We completed the `ClansController` implementation.
We also created more unit tests to keep improving the quality of our Ninja App.

### What's next?
In the next article, we will talk about the Repositories pattern, create the `IClanRepository` interface and the `ClanRepository` class.
We will also complete the `ClanService` class, update its tests to make them pass and create more automated tests.

{% include design-patterns-web-api-service-and-repository/footer.md %}
