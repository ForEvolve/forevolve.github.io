---
title:  "Design Patterns: Asp.Net Core Web API, services, and repositories"
subtitle: "Part 6: the ninja sub-system and the NinjaController"
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
proficiency-level: Intermediate
---

In the previous articles, we covered all the patterns needed to create a system where each responsibility is isolated.
We implemented a `Controller`, a `Service` and a `Repository`.
We also created unit and integration tests covering our specifications (as basic as they were).
Our Clan sub-system is pretty basic indeed, but it allowed us to learn the patterns without bothering too much about external dependencies.

In this article we will define most of the ninja sub-system and implement the `NinjaController` while in the next articles, we will implement the service, the repository, talk about Azure Table Storage and the ForEvolve Framework.<!--more-->

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

This one is a little more "complex" since the `CreatedAtAction` (HTTP status code 201) must return the "read URL".
Now down from 7 to 6 failing tests.

---

> **Magic strings**
>
> As you may have noticed, I am using the `nameof` operator to avoid hard coding strings.
> In my opinion, **strings should never be hard-coded** anywhere in your code.
>
> That said, out of the utopic world of endless money, time and workforce, it is tolerable to hard code your error messages (ex.: exceptions), test data (ex.: a dev database seeder), etc. 
> Most of the time, you do not have an unlimited budget, and these will rarely change (creating a resource file ain't that costly tho; just saying).
>
> However, **for code references** (ex.: method name, class name, property name), **DO NOT use a string, use the `nameof` operator.**
>
> In our last code block, `nameof(ReadOneAsync)` will simply become the string `"ReadOneAsync"`, but, it is not a string until compiled.
> The `nameof(...)` operator is a constant expression.
> You could see this as a "dynamic constant".
> Like a `const`, all references are replaced by the constant's value at compile time.
> You can also use the `nameof(...)` operator anywhere you can use a constant, like in `*Attribute` or as a default parameter value.
>
> One of the biggest advantages is that Visual Studio's refactoring feature (renaming a method, a class, etc.) will also rename the `nameof(...)` references.
> More on that, if you use CodeLens or the "Find all references" on the `ReadOneAsync` method, Visual Studio will list `nameof(...)` as references.
>
> ![nameof shown as a reference](//cdn.forevolve.com/blog/images/2017/vs-ninja-api-nameof-references.png)
>
> If you do not know the `nameof` operator or want more info: [nameof (C# Reference)](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/nameof).

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
We do not have any restriction for the ninja (yet); our API is highly permissive right now.
However, the controller does not have to know that, which would allow us to add validation later.

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

## The end of this article
Running all tests gives us the green light to continue toward the service implementation, with 29 passing tests and no failing one.

### What have we covered in this article?
In this article, we defined our ninja subsystem and implemented the `NinjaController`.

### What's next?
I originally planned to write a single article for both the `NinjaController` and the `NinjaService`. 
However, due to the quantity of code, it was becomming super long, so I decided to create two distinct part instead.

In the next article, we will implement the `NinjaService` and use our unit tests suite to do some refactoring.

{% include design-patterns-web-api-service-and-repository/footer.md %}
