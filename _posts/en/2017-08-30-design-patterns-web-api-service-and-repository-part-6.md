---
title:  "Design Patterns: Asp.Net Core Web API, services, and repositories"
subtitle: "Part 6: Implementating the ninjas"
date:   2017-08-30 00:00:00 -0500
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

In the previous articles, we covered all the patterns needed to create a system where each responsibility is isolated.
We implemented a `Controller`, a `Service` and a `Repository`.
We also created unit and integration tests covering our specifications (as basic as they were).
Our Clan sub-system is pretty basic indeed, but it allowed us to learn the patterns without bothering too much about external dependencies.

In this article we will implement most of the ninja sub-system while in the next article, we will implement the repository, talk about Azure Table Storage and the ForEvolve Framework.<!--more-->

[Skip the shared part](#defining-the-interfaces)

{% include design-patterns-web-api-service-and-repository/series.md %}

## Defining the interfaces
Now that we understand the patterns and know where we are heading, we will start by defining both our interfaces.

### INinjaService
The ninja service should give us access to the Ninja objects. 
Once again, it will only support CRUD operations.

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Services
{
    public interface INinjaService
    {
        Task<IEnumerable<Ninja>> ReadAllAsync();
        Task<IEnumerable<Ninja>> ReadAllInClanAsync(string clanName);
        Task<Ninja> ReadOneAsync(string clanName, string ninjaKey);
        Task<Ninja> CreateAsync(Ninja ninja);
        Task<Ninja> UpdateAsync(Ninja ninja);
        Task<Ninja> DeleteAsync(string clanName, string ninjaKey);
    }
}
```

### INinjaRepository
The `INinjaRepository` look the same as the `INinjaService` but their responsibilities are different.
The repository's goal is to read and write data while the service is to handle the domain logic.

As you can see, once again, we are building a simple CRUD data access interface.

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Repositories
{
    public interface INinjaRepository
    {
        Task<IEnumerable<Ninja>> ReadAllAsync();
        Task<IEnumerable<Ninja>> ReadAllInClanAsync(string clanName);
        Task<Ninja> ReadOneAsync(string clanName, string ninjaKey);
        Task<Ninja> CreateAsync(Ninja ninja);
        Task<Ninja> UpdateAsync(Ninja ninja);
        Task<Ninja> DeleteAsync(string clanName, string ninjaKey);
    }
}
```

## Controller
Having our interfaces defined will allow us to create the `NinjaController` and unit test it.

As a reminder of the patterns, here is the schema from the first article of the series:
<figure>
    <img src="//cdn.forevolve.com/blog/images/2017/controller-service-repo-ninja-with-DI.png">
    <figcaption>An HTTP request from the <code>Controller</code> to the data source, fully decoupled.</figcaption>
</figure>

### Creating the NinjaController
Once again, the `NinjaController` only exposes CRUD actions.

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Controllers
{
    [Route("v1/[controller]")]
    public class NinjaController : Controller
    {
        private readonly INinjaService _ninjaService;
        public NinjaController(INinjaService ninjaService)
        {
            _ninjaService = ninjaService ?? throw new ArgumentNullException(nameof(ninjaService));
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Ninja>), StatusCodes.Status200OK)]
        public Task<IActionResult> ReadAllAsync()
        {
            throw new NotImplementedException();
        }

        [HttpGet("{clan}")]
        [ProducesResponseType(typeof(IEnumerable<Ninja>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public Task<IActionResult> ReadAllInClanAsync(string clan)
        {
            throw new NotImplementedException();
        }

        [HttpGet("{clan}/{key}")]
        [ProducesResponseType(typeof(Ninja), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public Task<IActionResult> ReadOneAsync(string clan, string key)
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        [ProducesResponseType(typeof(Ninja), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public Task<IActionResult> CreateAsync([FromBody]Ninja ninja)
        {
            throw new NotImplementedException();
        }

        [HttpPut]
        [ProducesResponseType(typeof(Ninja), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public Task<IActionResult> UpdateAsync([FromBody]Ninja value)
        {
            throw new NotImplementedException();
        }

        [HttpDelete("{clan}/{key}")]
        [ProducesResponseType(typeof(Ninja), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public Task<IActionResult> DeleteAsync(string clan, string key)
        {
            throw new NotImplementedException();
        }
    }
}
```

---

<aside>
    <header>
        <code>ProducesResponseTypeAttribute</code>
    </header>
    <p>
        As you may have noticed, I decorated the controller actions with <code>ProducesResponseType</code> attributes.
        Since all actions are returning <code>IActionResult</code>, these attributes allowed me to define the real response type for each HTTP status code.
        For now, it is only useful for the humans programming the APIs, but we could auto-generate documentation of our APIs and even auto-generate REST clients.
    </p>
    <p>
        See <a href="https://github.com/domaindrivendev/Swashbuckle.AspNetCore">Swashbuckle.AspNetCore</a>, which is a Swagger Spec generation tool, that includes an auto-generated UI.
        Swashbuckle will use the <code>ProducesResponseTypeAttribute</code>s and turn them into Swagger Specifications for you.
    </p>
    <figure>
        <blockquote>
            Swagger is the world’s largest framework of API developer tools for the OpenAPI Specification(OAS), enabling development across the entire API lifecycle, from design and documentation, to test and deployment.
        </blockquote>
        <figcaption>
            The definition is from the official <a href="https://swagger.io/">Swagger</a> home page.
        </figcaption>
    </figure>
    <p><strong>More tooling</strong></p>
    <p>
        I never had the opportunity to use any of the following tools, but they both seem promising.
        They are on my "to try" list.
        That said, I will leave the links here for you to experiment and judge for yourself.
        When I get the opportunity to try them out, I will do my best to write about it.
        <ul>
            <li><a href="https://github.com/Azure/autorest">AutoRest</a>: generate a REST client automatically, based on Swagger specifications.</li>
            <li>
                <a href="https://github.com/paulcbetts/refit">Refit</a>: the automatic type-safe REST library for .NET Core, Xamarin and .NET<br>
                <i>Please note that Refit has nothing to do with `ProducesResponseTypeAttribute`, but it seems like a great way of generating a REST client. So, while talking about it, I decided to include the links anyway.</i>
            </li>
        </ul>
    </p>
</aside>

---

### Creating project specific exception classes
Before testing the controller, we will create some project specific exceptions.

Instead of using the built-in ones or returning `null` we will be able to `throw` and `catch` `NinjaApiException`s.

We will also create `ClanNotFoundException` and `NinjaNotFoundException` that inherits from `NinjaApiException`, as follow:

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi
{
    public class NinjaApiException : Exception
    {
        public NinjaApiException()
        {
        }

        public NinjaApiException(string message) : base(message)
        {
        }

        public NinjaApiException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected NinjaApiException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }

    public class ClanNotFoundException : NinjaApiException
    {
        public ClanNotFoundException(Clan clan)
            : this(clan.Name)
        {
        }

        public ClanNotFoundException(string clanName)
            : base($"Clan {clanName} was not found.")
        {
        }
    }

    public class NinjaNotFoundException : NinjaApiException
    {
        public NinjaNotFoundException(Ninja ninja)
            : base($"Ninja {ninja.Name} ({ninja.Key}) of clan {ninja.Clan.Name} was not found.")
        {
        }

        public NinjaNotFoundException(string clanName, string ninjaKey)
            : base($"Ninja {ninjaKey} of clan {clanName} was not found.")
        {
        }
    }
}
```

---

> **Why create NinjaApiException?**
>
> By having our exceptions inheriting from a project specific base exception, it is easier to differentiate the internal system exceptions from the external ones.
> For example, we could `catch (NinjaApiException)` to catch any of our application specific exceptions.
>
> As for the other two, for example (with no knowledge of the system), reading `catch (ClanNotFoundException)` is easier to understand than reading `catch (ArgumentException)` or `if (someObject == null)`.
>
> `Exception`s are a good way to propagates errors from one component of your system up to the user interface (the controller in our case).

---

### Testing the NinjaController
The `NinjaController` already expect an `INinjaService` interface upon instantiation.
The API contracts are also well defined, including different status code with `ProducesResponseType` attribute.
Based on that, creating our unit tests should be relatively easy. 
We only have to translate our already well-thought use cases to XUnit test code.

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Controllers
{
    public class NinjaControllerTest
    {
        protected NinjaController ControllerUnderTest { get; }
        protected Mock<INinjaService> NinjaServiceMock { get; }

        public NinjaControllerTest()
        {
            NinjaServiceMock = new Mock<INinjaService>();
            ControllerUnderTest = new NinjaController(NinjaServiceMock.Object);
        }

        public class ReadAllAsync : NinjaControllerTest
        {
            [Fact]
            public async void Should_return_OkObjectResult_with_all_Ninja()
            {
                // Arrange
                var expectedNinjas = new Ninja[]
                {
                    new Ninja { Name = "Test Ninja 1" },
                    new Ninja { Name = "Test Ninja 2" },
                    new Ninja { Name = "Test Ninja 3" }
                };
                NinjaServiceMock
                    .Setup(x => x.ReadAllAsync())
                    .ReturnsAsync(expectedNinjas);

                // Act
                var result = await ControllerUnderTest.ReadAllAsync();

                // Assert
                var okResult = Assert.IsType<OkObjectResult>(result);
                Assert.Same(expectedNinjas, okResult.Value);
            }
        }

        public class ReadAllInClanAsync : NinjaControllerTest
        {
            [Fact]
            public async void Should_return_OkObjectResult_with_all_Ninja_in_Clan()
            {
                // Arrange
                var clanName = "Some clan name";
                var expectedNinjas = new Ninja[]
                {
                    new Ninja { Name = "Test Ninja 1" },
                    new Ninja { Name = "Test Ninja 2" },
                    new Ninja { Name = "Test Ninja 3" }
                };
                NinjaServiceMock
                    .Setup(x => x.ReadAllInClanAsync(clanName))
                    .ReturnsAsync(expectedNinjas);

                // Act
                var result = await ControllerUnderTest.ReadAllInClanAsync(clanName);

                // Assert
                var okResult = Assert.IsType<OkObjectResult>(result);
                Assert.Same(expectedNinjas, okResult.Value);
            }

            [Fact]
            public async void Should_return_NotFoundResult_when_ClanNotFoundException_is_thrown()
            {
                // Arrange
                var unexistingClanName = "Some clan name";
                NinjaServiceMock
                    .Setup(x => x.ReadAllInClanAsync(unexistingClanName))
                    .ThrowsAsync(new ClanNotFoundException(unexistingClanName));

                // Act
                var result = await ControllerUnderTest.ReadAllInClanAsync(unexistingClanName);

                // Assert
                Assert.IsType<NotFoundResult>(result);
            }
        }

        public class ReadOneAsync : NinjaControllerTest
        {
            [Fact]
            public async void Should_return_OkObjectResult_with_a_Ninja()
            {
                // Arrange
                var clanName = "Some clan name";
                var ninjaKey = "Some ninja key";
                var expectedNinja = new Ninja { Name = "Test Ninja 1" };
                NinjaServiceMock
                    .Setup(x => x.ReadOneAsync(clanName, ninjaKey))
                    .ReturnsAsync(expectedNinja);

                // Act
                var result = await ControllerUnderTest.ReadOneAsync(clanName, ninjaKey);

                // Assert
                var okResult = Assert.IsType<OkObjectResult>(result);
                Assert.Same(expectedNinja, okResult.Value);
            }

            [Fact]
            public async void Should_return_NotFoundResult_when_NinjaNotFoundException_is_thrown()
            {
                // Arrange
                var unexistingClanName = "Some clan name";
                var unexistingNinjaKey = "Some ninja key";
                NinjaServiceMock
                    .Setup(x => x.ReadOneAsync(unexistingClanName, unexistingNinjaKey))
                    .ThrowsAsync(new NinjaNotFoundException(unexistingClanName, unexistingNinjaKey));

                // Act
                var result = await ControllerUnderTest.ReadOneAsync(unexistingClanName, unexistingNinjaKey);

                // Assert
                Assert.IsType<NotFoundResult>(result);
            }
        }

        public class CreateAsync : NinjaControllerTest
        {
            [Fact]
            public async void Should_return_CreatedAtActionResult_with_the_created_Ninja()
            {
                // Arrange
                var expectedNinjaKey = "SomeNinjaKey";
                var expectedClanName = "My Clan";
                var expectedCreatedAtActionName = nameof(NinjaController.ReadOneAsync);
                var expectedNinja = new Ninja { Name = "Test Ninja 1", Clan = new Clan { Name = expectedClanName } };
                NinjaServiceMock
                    .Setup(x => x.CreateAsync(expectedNinja))
                    .ReturnsAsync(() =>
                    {
                        expectedNinja.Key = expectedNinjaKey;
                        return expectedNinja;
                    });

                // Act
                var result = await ControllerUnderTest.CreateAsync(expectedNinja);

                // Assert
                var createdResult = Assert.IsType<CreatedAtActionResult>(result);
                Assert.Same(expectedNinja, createdResult.Value);
                Assert.Equal(expectedCreatedAtActionName, createdResult.ActionName);
                Assert.Equal(
                    expectedNinjaKey,
                    createdResult.RouteValues.GetValueOrDefault("key")
                );
                Assert.Equal(
                    expectedClanName,
                    createdResult.RouteValues.GetValueOrDefault("clan")
                );
            }

            [Fact]
            public async void Should_return_BadRequestResult()
            {
                // Arrange
                var ninja = new Ninja { Name = "Test Ninja 1" };
                ControllerUnderTest.ModelState.AddModelError("Key", "Some error");

                // Act
                var result = await ControllerUnderTest.CreateAsync(ninja);

                // Assert
                var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
                Assert.IsType<SerializableError>(badRequestResult.Value);
            }
        }

        public class UpdateAsync : NinjaControllerTest
        {
            [Fact]
            public async void Should_return_OkObjectResult_with_the_updated_Ninja()
            {
                // Arrange
                var expectedNinja = new Ninja { Name = "Test Ninja 1" };
                NinjaServiceMock
                    .Setup(x => x.UpdateAsync(expectedNinja))
                    .ReturnsAsync(expectedNinja);

                // Act
                var result = await ControllerUnderTest.UpdateAsync(expectedNinja);

                // Assert
                var createdResult = Assert.IsType<OkObjectResult>(result);
                Assert.Same(expectedNinja, createdResult.Value);
            }

            [Fact]
            public async void Should_return_NotFoundResult_when_NinjaNotFoundException_is_thrown()
            {
                // Arrange
                var unexistingNinja = new Ninja { Name = "Test Ninja 1", Clan = new Clan { Name = "Some clan" } };
                NinjaServiceMock
                    .Setup(x => x.UpdateAsync(unexistingNinja))
                    .ThrowsAsync(new NinjaNotFoundException(unexistingNinja));

                // Act
                var result = await ControllerUnderTest.UpdateAsync(unexistingNinja);

                // Assert
                Assert.IsType<NotFoundResult>(result);
            }

            [Fact]
            public async void Should_return_BadRequestResult()
            {
                // Arrange
                var ninja = new Ninja { Name = "Test Ninja 1" };
                ControllerUnderTest.ModelState.AddModelError("Key", "Some error");

                // Act
                var result = await ControllerUnderTest.UpdateAsync(ninja);

                // Assert
                var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
                Assert.IsType<SerializableError>(badRequestResult.Value);
            }
        }

        public class DeleteAsync : NinjaControllerTest
        {
            [Fact]
            public async void Should_return_OkObjectResult_with_the_deleted_Ninja()
            {
                // Arrange
                var clanName = "My clan";
                var ninjaKey = "Some key";
                var expectedNinja = new Ninja { Name = "Test Ninja 1" };
                NinjaServiceMock
                    .Setup(x => x.DeleteAsync(clanName, ninjaKey))
                    .ReturnsAsync(expectedNinja);

                // Act
                var result = await ControllerUnderTest.DeleteAsync(clanName, ninjaKey);

                // Assert
                var createdResult = Assert.IsType<OkObjectResult>(result);
                Assert.Same(expectedNinja, createdResult.Value);
            }

            [Fact]
            public async void Should_return_NotFoundResult_when_NinjaNotFoundException_is_thrown()
            {
                // Arrange
                var unexistingClanName = "Some clan name";
                var unexistingNinjaKey = "Some ninja key";
                NinjaServiceMock
                    .Setup(x => x.DeleteAsync(unexistingClanName, unexistingNinjaKey))
                    .ThrowsAsync(new NinjaNotFoundException(unexistingClanName, unexistingNinjaKey));

                // Act
                var result = await ControllerUnderTest.DeleteAsync(unexistingClanName, unexistingNinjaKey);

                // Assert
                Assert.IsType<NotFoundResult>(result);
            }
        }
    }
}
```

### Making the NinjaController tests pass
Now that we defined the expected behaviors of the `NinjaController` in our automated tests, it is time to make those tests pass.

In general, it should be pretty strait forward: delegates the business logic responsibility to the service class.
Our controller will need to handle a few more things here for non-OK paths.

Let's implement the `NinjaController`, method by method and test by test.

#### ReadAllAsync
The test says all: `ReadAllAsync.Should_return_OkObjectResult_with_all_Ninja`.

``` csharp
[HttpGet]
[ProducesResponseType(typeof(IEnumerable<Ninja>), StatusCodes.Status200OK)]
public async Task<IActionResult> ReadAllAsync()
{
    var allNinja = await _ninjaService.ReadAllAsync();
    return Ok(allNinja);
}
```

With those two lines of code, we are now down from 12 to 11 failing tests.
This is a start!

#### ReadAllInClanAsync
For this one, we have two tests

- `ReadAllInClanAsync.Should_return_OkObjectResult_with_all_Ninja_in_Clan`
- `ReadAllInClanAsync.Should_return_NotFoundResult_when_ClanNotFoundException_is_thrown`

**Should_return_OkObjectResult_with_all_Ninja_in_Clan**

``` csharp
[HttpGet("{clan}")]
[ProducesResponseType(typeof(IEnumerable<Ninja>), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<IActionResult> ReadAllInClanAsync(string clan)
{
    var clanNinja = await _ninjaService.ReadAllInClanAsync(clan);
    return Ok(clanNinja);
}
```

Again, pretty straight forward. We are now down from 11 to 10 failing tests.

**Should_return_NotFoundResult_when_ClanNotFoundException_is_thrown**

``` csharp
[HttpGet("{clan}")]
[ProducesResponseType(typeof(IEnumerable<Ninja>), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<IActionResult> ReadAllInClanAsync(string clan)
{
    try
    {
        var clanNinja = await _ninjaService.ReadAllInClanAsync(clan);
        return Ok(clanNinja);
    }
    catch (ClanNotFoundException)
    {
        return NotFound();
    }
}
```

After this little update, we are down from 10 to 9 failing tests.

#### ReadOneAsync
For this one, we also have two tests

- `ReadOneAsync.Should_return_OkObjectResult_with_a_Ninja`
- `ReadOneAsync.Should_return_NotFoundResult`

**Should_return_OkObjectResult_with_a_Ninja**

``` csharp
[HttpGet("{clan}/{key}")]
[ProducesResponseType(typeof(Ninja), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<IActionResult> ReadOneAsync(string clan, string key)
{
    var ninja = await _ninjaService.ReadOneAsync(clan, key);
    return Ok(ninja);
}
```

Now down from 9 to 8 failing tests.

**Should_return_NotFoundResult_when_NinjaNotFoundException_is_thrown**

``` csharp
[HttpGet("{clan}/{key}")]
[ProducesResponseType(typeof(Ninja), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<IActionResult> ReadOneAsync(string clan, string key)
{
    try
    {
        var ninja = await _ninjaService.ReadOneAsync(clan, key);
        return Ok(ninja);
    }
    catch (NinjaNotFoundException)
    {
        return NotFound();
    }
}
```

Now down from 8 to 7 failing tests.

#### CreateAsync
`CreateAsync` also have two tests

- `CreateAsync.Should_return_CreatedAtActionResult_with_the_created_Ninja`
- `CreateAsync.Should_return_BadRequestResult`

**Should_return_CreatedAtActionResult_with_the_created_Ninja**

``` csharp
[HttpPost]
[ProducesResponseType(typeof(Ninja), StatusCodes.Status201Created)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
public async Task<IActionResult> CreateAsync([FromBody]Ninja ninja)
{
    var createdNinja = await _ninjaService.CreateAsync(ninja);
    return CreatedAtAction(
        nameof(ReadOneAsync),
        new { clan = createdNinja.Clan.Name, key = createdNinja.Key },
        createdNinja
    );
}
```

This one is a little more complex since the `CreatedAtAction` (HTTP status code 201) must return the "read URL".
Now down from 7 to 6 failing tests.

---

> **Magic strings**
>
> As you may have noticed, I am using the `nameof` operator to avoid hard coding strings.
> In my opinion, **strings should never be hard-coded** anywhere in your code.
>
> That said, out of the utopic world of endless money, time and workforce, it is tolerable to hard code your error messages (ex.: exceptions), test data (ex.: a dev database seeder), etc. 
> Most of the time, you don't have an unlimited budget, and these will rarely change (creating a resource file ain't that costly tho; just saying).
>
> But, **for code references** (ex.: method name, class name, property name), **DO NOT use a string, use the `nameof` operator.**
>
> If you don't know the `nameof` operator or want more info: [nameof (C# Reference)](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/nameof).

---

**Should_return_BadRequestResult**

``` csharp
[HttpPost]
[ProducesResponseType(typeof(Ninja), StatusCodes.Status201Created)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
public async Task<IActionResult> CreateAsync([FromBody]Ninja ninja)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    var createdNinja = await _ninjaService.CreateAsync(ninja);
    return CreatedAtAction(
        nameof(ReadOneAsync),
        new { clan = createdNinja.Clan.Name, key = createdNinja.Key },
        createdNinja
    );
}
```

If there is a validation error, the API will return an HTTP status code 400 with the errors in its body.
We don't have any restriction for the ninja; our API is highly permissive right now.

That said, we are now down from 6 to 5 failing tests.
More than half done!

#### UpdateAsync
`UpdateAsync` has three tests: 

- One if everything is fine
- One if the ninja's validation fails
- And the last one in case the ninja was not found

**Should_return_OkObjectResult_with_the_updated_Ninja**

``` csharp
[HttpPut]
[ProducesResponseType(typeof(Ninja), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<IActionResult> UpdateAsync([FromBody]Ninja ninja)
{
    var updatedNinja = await _ninjaService.UpdateAsync(ninja);
    return Ok(updatedNinja);
}
```

Down from 5 to 4 failing tests.


**Should_return_NotFoundResult**

``` csharp
[HttpPut]
[ProducesResponseType(typeof(Ninja), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<IActionResult> UpdateAsync([FromBody]Ninja ninja)
{
    try
    {
        var updatedNinja = await _ninjaService.UpdateAsync(ninja);
        return Ok(updatedNinja);
    }
    catch (NinjaNotFoundException)
    {
        return NotFound();
    }
}

```

Here we catch `NinjaNotFoundException` thrown by `INinjaService` in case the ninja to update does not exist.
We will need to ensure this is implemented in `NinjaService` later.

Meanwhile, we are down from 4 to 3 failing tests.

**Should_return_BadRequestResult**

``` csharp
[HttpPost]
[ProducesResponseType(typeof(Ninja), StatusCodes.Status201Created)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
public async Task<IActionResult> CreateAsync([FromBody]Ninja ninja)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    var createdNinja = await _ninjaService.CreateAsync(ninja);
    return CreatedAtAction(
        nameof(ReadOneAsync),
        new { clan = createdNinja.Clan.Name, key = createdNinja.Key },
        createdNinja
    );
}
```

Down from 3 to 2 failing tests.

#### DeleteAsync
`DeleteAsync` has the last two tests needed to complete the `NinjaController` implementation.

**Should_return_OkObjectResult_with_the_deleted_Ninja**

``` csharp
[HttpDelete("{clan}/{key}")]
[ProducesResponseType(typeof(Ninja), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<IActionResult> DeleteAsync(string clan, string key)
{
    var deletedNinja = await _ninjaService.DeleteAsync(clan, key);
    return Ok(deletedNinja);
}
```

Down from 2 to 1 failing tests.
Almost done!

**Should_return_NotFoundResult**

``` csharp
[HttpDelete("{clan}/{key}")]
[ProducesResponseType(typeof(Ninja), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<IActionResult> DeleteAsync(string clan, string key)
{
    try
    {
        var deletedNinja = await _ninjaService.DeleteAsync(clan, key);
        return Ok(deletedNinja);
    }
    catch (NinjaNotFoundException)
    {
        return NotFound();
    }
}
```

Bam! 29 passing tests! 0 failing test!

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
In this article, besides reimplementing the whole `Controller+Service+Repository` logic (without the `Repository` implementation), we used our unit tests to ensure that our refactoring hadn't broken anything.
We also added some domain logic to the `NinjaService`.

### What's next?
In the next article, we will implement the missing piece of the ninja subsystem: the `NinjaRepository`.
We will use Azure Table Storage to store our ninja's data.

I will also introduce my in-development ForEvolve Framework to access our data easily.

{% include design-patterns-web-api-service-and-repository/footer.md %}
