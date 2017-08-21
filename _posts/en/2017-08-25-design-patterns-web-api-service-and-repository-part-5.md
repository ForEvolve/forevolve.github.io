---
title:  "Design Patterns: Asp.Net Core Web API, services, and repositories"
subtitle: "Part 5: Repositories, the ClanRepository, and integration testing"
date:   2017-08-25 00:00:00 -0500
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
- Integration Test
- Repository Pattern
proficiency-level: Intermediate
---

In the last article, we talked about the service's role, we completed the `ClansController` implementation, and we created more unit tests to keep improving the quality of our Ninja App.

Now it's time to attack the [Repository Pattern](https://msdn.microsoft.com/en-us/library/ff649690.aspx), create the `IClanRepository` interface, complete the `ClanService` implementation and create the default `ClanRepository` class with, of course, more unit tests.<!--more-->

[Skip the shared part](#repository)

{% include design-patterns-web-api-service-and-repository/series.md %}

## Repository
The role of the Repository is to access data, wherever is the data and in whatever format it could be. For the external world (the domain), the repository must deal in Domain Entities, making the rest of the system decoupled from its data source. 

In our case, the Service will pass domain object to the Repository, and the Repository will map them to data entities, persist them or retrieve them. The Repository could also cache entities, which could be very useful in the case of a remote data source (table storage, another Web API, etc.).

### The `IClanRepository`
Now that we settled on the meaning of a repository and that our `ClanService` implementation is waiting for one, let's code it up.

---

> For the current project, I created the interface in the `Repositories` directory because I feel it makes sense. 
> This could also be `Data`, `DAL`, etc.
> In your own project, it is up to you.

---

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Repositories
{
    public interface IClanRepository
    {
        Task<IEnumerable<Clan>> ReadAllAsync();
        Task<Clan> ReadOneAsync(string clanName);
        Task<Clan> CreateAsync(Clan clan);
        Task<Clan> UpdateAsync(Clan clan);
        Task<Clan> DeleteAsync(string clanName);
    }
}
```

As you can see, this is similar to our `IClanService` interface.
This is mostly because our service does not have much logic beside data access.

---

> In a more complex system, we could have services doing more domain operations instead of only raw data access, like an `IEmailService` that sends emails.

---

## Back to the `ClanService`
Now that we have an interface, it is time to complete the `ClanService` implementation.

### Lets start with the repository injection
In the `ClanService` class, let's add the following private field and constructor.

``` csharp
private IClanRepository _clanRepository;

public ClanService(IClanRepository clanRepository)
{
    _clanRepository = clanRepository ?? throw new ArgumentNullException(nameof(clanRepository));
}
```

As you are probably beginning to be familiar with the pattern, we are injecting an `IClanRepository` interface in the controller; we added a guard clause to ensure the repository is not null then we referenced the injected class in a private field for futur use.

### Completing the tests
Now that the `ClanService` gets an `IClanRepository` implementation injected in its constructor, we need to go back to the `ClanServiceTest` class and update it a little.

Let's start by adding a `protected Mock<IClanRepository> ClanRepositoryMock { get; }` property.
This mock will help us create the missing links between our test cases and our class under test.

The mock update:

``` csharp
protected ClanService ServiceUnderTest { get; }
protected Mock<IClanRepository> ClanRepositoryMock { get; }

public ClanServiceTest()
{
    ClanRepositoryMock = new Mock<IClanRepository>();
    ServiceUnderTest = new ClanService(ClanRepositoryMock.Object);
}
```

In the `ReadAllAsync.Should_return_all_clans()` test method, we added `ClanRepositoryMock.Setup(x => x.ReadAllAsync()).ReturnsAsync(expectedClans);`.
This tells the `Mock<IClanRepository>` that it should return the `expectedClans` list when asked for `ReadAllAsync()`.

``` csharp
[Fact]
public async Task Should_return_all_clans()
{
    // Arrange
    var expectedClans = new ReadOnlyCollection<Clan>(new List<Clan>
    {
        new Clan { Name = "My Clan" },
        new Clan { Name = "Your Clan" },
        new Clan { Name = "His Clan" }
    });
    ClanRepositoryMock
        .Setup(x => x.ReadAllAsync())
        .ReturnsAsync(expectedClans);

    // Act
    var result = await ServiceUnderTest.ReadAllAsync();

    // Assert
    Assert.Same(expectedClans, result);
}
```

In the `ReadOneAsync.Should_return_the_expected_clan()` test method, we added `ClanRepositoryMock.Setup(x => x.ReadOneAsync(clanName)).ReturnsAsync(expectedClan);`.
This tells the `Mock<IClanRepository>` that it should return the `expectedClan` object when asked for `ReadOneAsync("My Clan")`.

``` csharp
[Fact]
public async Task Should_return_the_expected_clan()
{
    // Arrange
    var clanName = "My Clan";
    var expectedClan = new Clan { Name = clanName };
    ClanRepositoryMock
        .Setup(x => x.ReadOneAsync(clanName))
        .ReturnsAsync(expectedClan);

    // Act
    var result = await ServiceUnderTest.ReadOneAsync(clanName);

    // Assert
    Assert.Same(expectedClan, result);
}
```

In the `ReadOneAsync.Should_return_null_if_the_clan_does_not_exist()` test method, we added `ClanRepositoryMock.Setup(x => x.ReadOneAsync(clanName)).ReturnsAsync(default(Clan));`.
This tells the `Mock<IClanRepository>` that it should return `null` when asked for `ReadOneAsync("My Clan")`.

``` csharp
[Fact]
public async Task Should_return_null_if_the_clan_does_not_exist()
{
    // Arrange
    var clanName = "My Clan";
    ClanRepositoryMock
        .Setup(x => x.ReadOneAsync(clanName))
        .ReturnsAsync(default(Clan));

    // Act
    var result = await ServiceUnderTest.ReadOneAsync(clanName);

    // Assert
    Assert.Null(result);
}
```

In the `IsClanExistsAsync.Should_return_true_if_the_clan_exist()` test method, we added `ClanRepositoryMock.Setup(x => x.ReadOneAsync(clanName)).ReturnsAsync(new Clan());`.
This tells the `Mock<IClanRepository>` that it should return a `new Clan()` when asked for `ReadOneAsync("Your Clan")`.

``` csharp
[Fact]
public async Task Should_return_true_if_the_clan_exist()
{
    // Arrange
    var clanName = "Your Clan";
    ClanRepositoryMock
        .Setup(x => x.ReadOneAsync(clanName))
        .ReturnsAsync(new Clan());

    // Act
    var result = await ServiceUnderTest.IsClanExistsAsync(clanName);

    // Assert
    Assert.True(result);
}
```

Finally, in the `IsClanExistsAsync.Should_return_false_if_the_clan_does_not_exist()` test method, we added `ClanRepositoryMock.Setup(x => x.ReadOneAsync(clanName)).ReturnsAsync(default(Clan));`.
This tells the `Mock<IClanRepository>` that it should return `null` when asked for `ReadOneAsync("Unexisting Clan")`.

``` csharp
[Fact]
public async Task Should_return_false_if_the_clan_does_not_exist()
{
    // Arrange
    var clanName = "Unexisting Clan";
    ClanRepositoryMock
        .Setup(x => x.ReadOneAsync(clanName))
        .ReturnsAsync(default(Clan));

    // Act
    var result = await ServiceUnderTest.IsClanExistsAsync(clanName);

    // Assert
    Assert.False(result);
}
```

Now that all our tests are implemented, it is time to make them pass.

---

> **More info**
>
> If you are still confused about mocks or the Moq library, I invite you to investigate and experiment both the tool and the concept after completing this article series.
> A good place to start would be the [Moq Quickstart](https://github.com/Moq/moq4/wiki/Quickstart) guide.

---
### Finishing the service implementation
To make fast progress, we can start by implementing the `CreateAsync`, `UpdateAsync` and `DeleteAsync` methods by changing the `NotImplementedException` by a `NotSupportedException`, like this:

``` csharp
public Task<Clan> CreateAsync(Clan clan)
{
    throw new NotSupportedException();
}

public Task<Clan> UpdateAsync(Clan clan)
{
    throw new NotSupportedException();
}

public Task<Clan> DeleteAsync(string clanName)
{
    throw new NotSupportedException();
}
```

Now if we run all the tests, we have five failing tests and four passing tests.

To continue with easy code, we can implement both `Read*Async` methods by delegating the call directly to the `IClanRepository`, like this:

```` csharp
public Task<IEnumerable<Clan>> ReadAllAsync()
{
    return _clanRepository.ReadAllAsync();
}

public Task<Clan> ReadOneAsync(string clanName)
{
    return _clanRepository.ReadOneAsync(clanName);
}
```

Now if we run all the tests, we have two failing tests and seven passing tests, that's fast progressions, isn't it?

Our last two tests cover the `IsClanExistsAsync` method.
The logic is simple:

- If the clan exist, return `true`.
- If the clan does not exist (is `null`), return `false`.

Once all that English is translated to C# it looks like this:

``` csharp
public async Task<bool> IsClanExistsAsync(string clanName)
{
    var clan = await _clanRepository.ReadOneAsync(clanName);
    return clan != null;
}
```

> *We should start to talk in code; it would be faster, right?*

All tests are now passing! Yeah!

## The default `IClanRepository` implementation
Now that all our specifications are implemented, it is time to continue toward the creation of the default `IClanRepository` implementation; the `ClanRepository` class.

Since it is a simple in-memory implementation, here is what we will do:

1. We will implement an "empty" version of the `IClanRepository` interface.
1. We will inject a collection of clans in the repository constructor.
1. We will create the tests to back our specifications.
1. We will code the methods and make our tests pass.

### The barebone `ClanRepository` class
Since we are getting better at this, it's time to get more productive and quickly complete the first two steps.

First, we need to create the `ClanRepository` class in the `Repositories` directory and implement the `IClanRepository` interface.
I will keep the full implementation away since it is only empty methods that `throw new NotImplementedException();`.

Instead, we will focus on the `ClanRepository`'s dependency. 

> Wait! What! Another dependency?

Yes, by doing that, we will be able to inject the list of existing clans from the composition root.
Responsibility-wise: the `ClanRepository` controls the data access logic, but not the data itself.
Even better, we will be able to inject the data that we want in our tests.

**Here goes the constructor:**

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Repositories
{
    public class ClanRepository : IClanRepository
    {
        private readonly List<Clan> _clans;

        public ClanRepository(IEnumerable<Clan> clans)
        {
            if (clans == null) { throw new ArgumentNullException(nameof(clans)); }
            _clans = new List<Clan>(clans);
        }

        // ...
    }
}
```

### Create some unit test
First, let's put together the `ClanRepository` specifications.

1. `ReadAllAsync` should return the clans passed as the constructor argument `clans`.
1. `ReadOneAsync` should return the `Clan` object or `null` if the clan does not exist.
1. `CreateAsync`, `UpdateAsync` and `DeleteAsync` should all throw a `NotSupportedException` since no data is persisted anywhere but in-memory.

As you can see, it is similar to the `ClanService` class minus the `IsClanExistsAsync` method.
That method is more about logic than data access, so I decided not to pollute our repository with it.

**All of that, in code, looks like this:**

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Repositories
{
    public class ClanRepositoryTest
    {
        protected ClanRepository RepositoryUnderTest { get; }
        protected Clan[] Clans { get; }

        public ClanRepositoryTest()
        {
            Clans = new Clan[]
            {
                new Clan { Name = "My clan" },
                new Clan { Name = "Your clan" },
                new Clan { Name = "His clan" }
            };
            RepositoryUnderTest = new ClanRepository(Clans);
        }

        public class ReadAllAsync : ClanRepositoryTest
        {
            [Fact]
            public async Task Should_return_all_clans()
            {
                // Act
                var result = await RepositoryUnderTest.ReadAllAsync();

                // Assert
                Assert.Collection(result,
                    clan => Assert.Same(Clans[0], clan),
                    clan => Assert.Same(Clans[1], clan),
                    clan => Assert.Same(Clans[2], clan)
                );
            }
        }

        public class ReadOneAsync : ClanRepositoryTest
        {
            [Fact]
            public async Task Should_return_the_expected_clan()
            {
                // Arrange
                var expectedClan = Clans[1];
                var expectedClanName = expectedClan.Name;

                // Act
                var result = await RepositoryUnderTest.ReadOneAsync(expectedClanName);

                // Assert
                Assert.Same(expectedClan, result);
            }

            [Fact]
            public async Task Should_return_null_if_the_clan_does_not_exist()
            {
                // Arrange
                var unexistingClanName = "Unexisting clan";

                // Act
                var result = await RepositoryUnderTest.ReadOneAsync(unexistingClanName);

                // Assert
                Assert.Null(result);
            }
        }

        public class CreateAsync : ClanRepositoryTest
        {
            [Fact]
            public async Task Should_throw_a_NotSupportedException()
            {
                // Arrange, Act, Assert
                var exception = await Assert.ThrowsAsync<NotSupportedException>(() => RepositoryUnderTest.CreateAsync(null));
            }
        }

        public class UpdateAsync : ClanRepositoryTest
        {
            [Fact]
            public async Task Should_throw_a_NotSupportedException()
            {
                // Arrange, Act, Assert
                var exception = await Assert.ThrowsAsync<NotSupportedException>(() => RepositoryUnderTest.UpdateAsync(null));
            }
        }

        public class DeleteAsync : ClanRepositoryTest
        {
            [Fact]
            public async Task Should_throw_a_NotSupportedException()
            {
                // Arrange, Act, Assert
                var exception = await Assert.ThrowsAsync<NotSupportedException>(() => RepositoryUnderTest.DeleteAsync(null));
            }
        }
    }
}
```

If we hit the "Run All" button of the Visual Studio "Test Explorer" window, we should see nine passing test and six failing tests.

### Completing the implementation
Ok, back to our `ClanRepository`.
Again, it will be very similar to the `ClanService` class since we do not support creating, updating and deleting clans.

**Lets jump right to the code:**

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Repositories
{
    public class ClanRepository : IClanRepository
    {
        private readonly List<Clan> _clans;

        public ClanRepository(IEnumerable<Clan> clans)
        {
            if (clans == null) { throw new ArgumentNullException(nameof(clans)); }
            _clans = new List<Clan>(clans);
        }

        public Task<IEnumerable<Clan>> ReadAllAsync()
        {
            return Task.FromResult(_clans.AsEnumerable());
        }

        public Task<Clan> ReadOneAsync(string clanName)
        {
            var clan = _clans.FirstOrDefault(c => c.Name == clanName);
            return Task.FromResult(clan);
        }

        public Task<Clan> CreateAsync(Clan clan)
        {
            throw new NotSupportedException();
        }

        public Task<Clan> UpdateAsync(Clan clan)
        {
            throw new NotSupportedException();
        }

        public Task<Clan> DeleteAsync(string clanName)
        {
            throw new NotSupportedException();
        }
    }
}
```

## One last step
If we hit the run button and navigate to the `GET /v1/clans` endpoint, the server will return an HTTP 500 status code.

The exception thrown is: 

> System.InvalidOperationException: Unable to resolve service for type 'ForEvolve.Blog.Samples.NinjaApi.Services.IClanService' while attempting to activate 'ForEvolve.Blog.Samples.NinjaApi.Controllers.ClansController'.

Well, we unit tested everything, but we forgot that our units must be integrated together.
All those independent classes and interfaces are like bricks, but to make a wall we also need mortar!
And the mortar is our dependency graph.

We need to register our dependencies with the default Asp.Net Core service provider.
To do so, in the `Startup.ConfigureServices` method, we will add our clan's dependencies to the `IServiceCollection`.

We could also create some integration tests in C# or use a tool like [Postman](https://www.getpostman.com/) to automate the testing.

---

> **What is integration testing?**
>
> While *unit tests* are testing every single unit, one by one, *integration tests* are testing the units' integration with one another; often requiring external dependencies like a database.

---

### Integration testing
In Asp.Net Core, we can use XUnit and the `Microsoft.AspNetCore.TestHost.TestServer` class to automate testing.
And since we only have one action to test, why not introduce integration testing in our Ninja App?

We will start by creating a new project, in the `test` directory, named `ForEvolve.Blog.Samples.NinjaApi.IntegrationTests`.
In it, we will create the `BaseHttpTest` abstract class and the `ClansControllerTest` class.

The `BaseHttpTest` abstract class implement some base behaviors that we will be able to reuse in the future.
I could have used a test fixture as well, but I decided to go with a base class instead.
The main reason is to control its behaviors per test basis better.
Instead of say, creating an `Initialize` method, I decided to create an overridable `ConfigureServices` method that will allow us to inject some test dependencies (like our clans).

**The `BaseHttpTest` class:**

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.IntegrationTests
{
    public abstract class BaseHttpTest : IDisposable
    {
        protected TestServer Server { get; }
        protected HttpClient Client { get; }

        protected virtual Uri BaseAddress => new Uri("http://localhost");
        protected virtual string Environment => "Development";

        public BaseHttpTest()
        {
            var builder = new WebHostBuilder()
                .UseEnvironment(Environment)
                .ConfigureServices(ConfigureServices)
                .UseStartup<Startup>();

            Server = new TestServer(builder);
            Client = Server.CreateClient();
            Client.BaseAddress = BaseAddress;
        }

        protected virtual void ConfigureServices(IServiceCollection services)
        {
        }

        #region IDisposable Support

        private bool disposedValue = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    Client.Dispose();
                    Server.Dispose();
                }
                disposedValue = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion
    }
}
```

We created a `TestServer`, that simulate a web server, and an `HttpClient`, bound to that server. We will use the `HttpClient` to send HTTP requests to our Web API.

> To use the `TestServer`, you will need to install the `Microsoft.AspNetCore.TestHost` NuGet package.

The `ClansControllerTest` inherit from `BaseHttpTest` and is composed of only one test.
It also leverages our `BaseHttpTest.ConfigureServices` method by overriding it and defining what clans should be available in our application.

**The `ClansControllerTest` class:**

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.IntegrationTests
{
    public class ClansControllerTest : BaseHttpTest
    {
        public class ReadAllAsync : ClansControllerTest
        {
            private IEnumerable<Clan> Clans => new Clan[] {
                new Clan { Name = "My clan" },
                new Clan { Name = "Your clan" },
                new Clan { Name = "His clan" }
            };

            protected override void ConfigureServices(IServiceCollection services)
            {
                services.AddSingleton(Clans);
            }

            [Fact]
            public async Task Should_return_the_default_clans()
            {
                // Arrange
                var expectedNumberOfClans = Clans.Count();

                // Act
                var result = await Client.GetAsync("v1/clans");

                // Assert
                result.EnsureSuccessStatusCode();
                var clans = await result.Content.ReadAsJsonObjectAsync<Clan[]>();
                Assert.NotNull(clans);
                Assert.Equal(expectedNumberOfClans, clans.Length);
                Assert.Collection(clans,
                    clan => Assert.Equal(Clans.ElementAt(0).Name, clans[0].Name),
                    clan => Assert.Equal(Clans.ElementAt(1).Name, clans[1].Name),
                    clan => Assert.Equal(Clans.ElementAt(2).Name, clans[2].Name)
                );
            }
        }
    }
}
```

At this point, our new test is failing. We have not yet registered our dependencies.

### Back to Startup
Let's open the `Startup.cs` class (of the `ForEvolve.Blog.Samples.NinjaApi` project) and register our dependencies in the `ConfigureServices` method.

**The whole `Startup` class:**

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.TryAddSingleton<IClanService, ClanService>();
            services.TryAddSingleton<IClanRepository, ClanRepository>();
            services.TryAddSingleton<IEnumerable<Clan>>(new Clan[]{
                new Clan { Name = "Iga" },
                new Clan { Name = "Kōga" },
            });
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseMvc();
        }
    }
}
```

> My clans' name source is [Wikipedia](https://en.wikipedia.org/wiki/Ninja).

## The end of this article
Now, running all tests gives us the green light, with 16 passing tests and no failing one, to continue to the second half of our system: the Ninjas.

> We have not tested the default clans ("Iga" and "Kōga"). 
> We could or could not have any or worst an `Exception` could be thrown, and our automated tests would not give us any feedback about it; because no test covers that scenario.
> I leave this task to you to test that out, as an exercice.
>
> In the source code, I implemented a test for that (in `StartupTest.cs`). 
> There are multiple ways to do this and I used the easy one (based on our actual code base).

### What have we covered in this article?
We talked about the repositories role in a system, we defined the `IClanRepository` interface, updated the `ClanService` class, created the `ClanRepository` class, ended up with a few more unit tests and did some integration testing.

What a busy day!

### What's next?
In the next article, we will implement the core of our ninja system except the `NinjaRepository`.
Since we covered the basics, I will go faster.

The plans: `NinjaController`, `INinjaService`, `NinjaService`, `INinjaRepository` and some unit tests.

{% include design-patterns-web-api-service-and-repository/footer.md %}
