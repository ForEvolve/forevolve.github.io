---
title:  "Design Patterns: Asp.Net Core Web API, services, and repositories"
subtitle: "Part 3: Models, Controllers and the ClansController"
date:   2017-08-17 00:00:00 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2017-07-00-asp-net-core-design-patterns.png"
lang: en
categories: en/articles
tags: 
- Design Patterns
- Asp.Net Core
- Web API
- C#
- MVC
- Unit Test
- XUnit
proficiency-level: Intermediate
---

In the first article, we visited a few concepts that we will apply, starting in the current article.

The second article was an overview of Dependency Injection.

In this 3rd article, we will:
- Model the ninja
- Create the `ClansController` (ninja's don't fight alone!)
- Write some tests

All of this will get us ready for the next article's `ClanService`.

<!--more-->

[Skip the shared part](#aspnet-core-mvc)

{% include design-patterns-web-api-service-and-repository/series.md %}

## Asp.Net Core MVC
In the past, MVC and WebApi were two separate things.
Now with Asp.Net Core, they are unified, woot!
Even more, [Razor Pages](https://docs.microsoft.com/en-us/aspnet/core/mvc/razor-pages/) are also unified (comming with ASP.NET Core 2.0.0).

---

> **MVC pattern summary**
>
> MVC stands for Model-View-Controller. 
> The pattern could be shortened to: 
> 
> 1. A controller handles an (HTTP) request
> 1. Use a model
> 1. Then render a view.
> 
> The use of MVC help split responsibilities.

---

Since we are building a Web API, we will not render views but serialize objects instead.
I like to name those objects the "Web API Contracts."

## Web API Contracts
In the MVC acronym, the API Contracts could be seen as the "MV" part: the model and the view.
Since there is no View in a Web API, these objects can be seen as playing the View role.

More on that, the Web API Contracts are the public objects that are transferred over HTTP.
We could also call them Data Transfer Object (DTO), but I prefer "Contracts" since they are not to be messed with once deployed.
They are more than simple "object to be transferred" they are what our clients rely on in production.

The "data contracts" play a big role in the Web API interface so: they cannot change, they can only evolve. 

---

> **Side note**
>
> It is possible to have multiple model layers in an application: presentation model, view model, domain model, data model, etc.
> Most of the time, I would recommend the use of multiple models, its helps separate and isolate responsibilities.
>
> Even in our little Ninja App, we will have 2 model layers: the "presentation & domain model" and the "data model."
>
> A great tool to manage object copy from one layer to another is [AutoMapper](http://automapper.org/).

---

### The Ninja Model
The Ninja App model is super simple:

1. We have ninjas
1. And clans
1. A ninja can be a member of a clan.
1. A clan can be composed of many ninjas.

Here are the C# classes:

``` csharp
namespace ForEvolve.Blog.NinjaApi.Models
{
    public class Ninja
    {
        public string Key { get; set; }
        public Clan Clan { get; set; }
        public string Name { get; set; }
        public int Level { get; set; }
    }

    public class Clan
    {
        public string Name { get; set; }
    }
}
```

As you may have noticed by looking at the `Clan` class, there is no "a clan can be composed of many ninjas" represented in code.
The reason behind this is simple: I want to keep the model super lean.

*Conceptually speaking, we could recreate that condition manually by requesting all ninja of a specific clan.*

> That said, if I want to transfer more than those simple objects, I could create a Gateway (see below) exposing different endpoints.
> 
> For example:
> 
> - A `ClanSummary` class that could be composed of the clan's `Name` and the ninja's `Count`.
> - A `ClanDetails` class that could be composed of the clan's `Name` and a collection of ninja. We could also include the `Count`.

In the little Ninja App that we are building, the goal is to create **raw data endpoints** that read/write simple entities, that's it.

## The Controllers
Now that we have our model, let's focus on the controllers.

The `Controller` responsibility is to handle the HTTP requests and responses.

Our ultra simple Ninja Web API will simply read or write Clans and Ninja's information.
To do so, we will create two controllers, the `ClansController` and the `NinjaController`.
Each controller will be responsible for its own model class.

> **Side note**
>
> A good way to design a system is to start here, at the "user interface" level, which in the case of a Web API, is the `Controller`.
> We first need to define the Web API interface and the data contracts that a client would need to efficiently (or easily) use our system.
> 
> If we are building one or more GUI, we should start there (that's the user interface level, right?).
> Begining by the analysis of what data would be needed.
> Then maybe create one or more [API Gateway](http://microservices.io/patterns/apigateway.html) or simply create some raw data endpoints.
>
> Raw data endpoints is pretty much what we will do for our **Ninja App** (for now at least).

### ClansController
The `ClansController` only expose a read all clans endpoint. The clan's data will be static and hard coded but could be persisted in a database at a later time.
*You could do this refactoring at the end of the series to practice your new skills.*

``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Controllers
{
    [Route("v1/[controller]")]
    public class ClansController : Controller
    {
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Clan>), 200)]
        public Task<IActionResult> ReadAllAsync()
        {
            throw new NotImplementedException();
        }
    }
}
```

## Unit Tests
During the article series, instead of just throwing some code out, I will write code, write tests, update the code and maintain the test suite.

As for the code conventions, I like to follow the [ASP.NET Engineering guidelines - Unit tests and functional tests](https://github.com/aspnet/Home/wiki/Engineering-guidelines#unit-tests-and-functional-tests).
I also like to create a class for the subject under test and then a sub-class for each method. 
I like how easy it becomes to regroup all the tests for one method under its own sub-class as well as to create mocks only once per class. 
This might be clearer and more obvious later, in the `NinjaControllerTest` class.

---

> **Unit testing**
>
> It is a good practice to create automated tests for your code.
> This help reach a higher level of quality, and a greater degree of confidence when comes the time to deploy your application.
>
> I also have to announce to the TDD purists that I hate to see all red-wavy-underlined-code with errors saying 
> that my interfaces or classes does not exist. So I will start by defining my interfaces then I will write tests.
>
> Let's say that I am more an "interface-first"/"interface-driven-testing" kinda guy... :wink:

---

> For more information about unit and integration testing see:
>
> - [Testing controllers](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/testing)
> - [Integration testing](https://docs.microsoft.com/en-us/aspnet/core/testing/integration-testing)
> - [Unit testing in .NET Core using dotnet test and xUnit](https://docs.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-dotnet-test)

---

We will write our tests using [XUnit](https://xunit.github.io/).

<figure>
    <header>
        I created a snippet that help code empty failing AAA tests faster (Arrange, Act, Assert).
        To use it, once installed, it is as easy as <code>positioning your cursor in the body of a method</code>, then typing <code>a</code> + <code>tab</code> + <code>tab</code>.
    </header>
<pre><code class="language-csharp">[Fact]
public void SomeTestMethod()
{
    // Arrange


    // Act


    // Assert
    throw new NotImplementedException();
}
</code></pre>
    <figcaption>
        The result of the <code>aaa</code> snippet available at <a href="https://github.com/ForEvolve/vs-snippets">GitHub</a>
    </figcaption>
</figure>

---

Ok, now it is time to write some failing tests for our clan controller.

### ClansControllerTest
The only test of the clan is the `ReadAllAsync.Should_return_OkObjectResult_with_clans()` test.

In this test we are:

1. Expecting the `ClansController.ReadAllAsync();` method to return an `OkObjectResult`.
1. Expecting the result value to be the `expectedClans` array (this obviously cannot happen yet but you will see why it is there later).


``` csharp
namespace ForEvolve.Blog.Samples.NinjaApi.Controllers
{
    public class ClansControllerTest
    {
        protected ClansController ControllerUnderTest { get; }

        public ClansControllerTest()
        {
            ControllerUnderTest = new ClansController();
        }

        public class ReadAllAsync : ClansControllerTest
        {
            [Fact]
            public async void Should_return_OkObjectResult_with_clans()
            {
                // Arrange
                var expectedClans = new Clan[]
                {
                    new Clan { Name = "Test clan 1" },
                    new Clan { Name = "Test clan 2" },
                    new Clan { Name = "Test clan 3" }
                };

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

## The end of this article
At this point, if we hit the "Run All" button of the Visual Studio "Test Explorer" window, we should see 1 failing test.

This may not sound that good, but this is our refactoring starting point.
Now we only need to write enough code to make that test pass.

### What have we covered in this article?
We talked about the controller's role, about models and data contracts.
We also coded unit tests to improve the quality of our Ninja App.

### What's next?
In the next article, we will create the `IClanService` interface and its default implementation, the `ClanService` class.
A new class means writing more unit tests; as well as updating the `ClansController` to use that new interface.

Our focus will gravitate around the "service" role (the business logic; a.k.a. the domain) and how to connect those two units (the service and the controller).

Until then, happy coding!

{% include design-patterns-web-api-service-and-repository/footer.md %}
