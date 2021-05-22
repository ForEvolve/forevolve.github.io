---
title: 'Design Patterns: Asp.Net Core Web API, services, and repositories'
subtitle: 'Part 2: Dependency Injection'
date: 2017-08-14 00:00:00 -0500
post-img: '//cdn.forevolve.com/blog/images/articles-header/2017-07-00-asp-net-core-design-patterns.png'
lang: en
categories: en/articles
tags:
    - Design Patterns
    - Asp.Net Core
    - Web API
    - C#
    - Dependency Injection
proficiency-level: Intermediate
updates:
    - { date: 2017-08-14, description: 'Initial article.' }
    - { date: 2017-09-28, description: 'Add the Dependency Injection in .NET book link.' }
    - { date: 2018-10-03, description: 'Migrate the history section to the updates feature.' }
---

In the first part, we visited a few concepts that we will start applying in the next article.
But before that, we will do a little interlude about `Dependency Injection`.

_If you are already familiar with Dependency Injection in Asp.Net Core, feel free to jump right to the next article of the series._

In this article, we will cover:

-   Dependency Injection Basics
-   Constructor Injection
-   Scopes (dependencies' lifetime)
-   Asp.Net Core default DI container

<!--more-->

[Skip the shared part](#dependency-injection)

{% include design-patterns-web-api-service-and-repository/series.md %}

## Dependency Injection

If you are not familiar with dependency injection, don't worry, we will cover the basics here.
Once understood, you will see that Dependency Injection is a major game changer about how you design softwares.

<figure>
    Classes should not depend directly on other classes but instead <q cite="https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)"><a href="https://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29">one should depend upon abstractions</a></q>.
</figure>

That last sentence leads to Inversion of Control (IoC) which means that dependencies are managed elsewhere.
Instead of creating concrete types that use other types, classes only depends on abstractions (interfaces), and dependencies (implementations) are injected.

**Example of an implementation and its interface:**

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi
{
    public class ChildService : IChildService
    {
        public void DoSomething()
        {
            throw new NotImplementedException();
        }
    }

    public interface IChildService
    {
        void DoSomething();
    }
}
```

In that system, no other classes should be aware of `ChildService`; but many could use `IChildService`. **Only depend on abstractions (interfaces).**

### Composition Root

The dependencies must be managed somewhere, and implementations must be associated to abstractions.
Where the dependencies are managed is called the "composition root" and should be as close as possible to the program entry point.

In an Asp.Net Core point of view, that would be in `Program.cs`.
But, since most Asp.Net Core applications `.UseStartup<Startup>()` (see `Program.cs`), the composition root will be the `ConfigureServices(IServiceCollection services)` method of the `Startup` class.

Ok less confusion, here is the VS generated `Startup.cs` file content:

<figure>
    <pre><code class="language-csharp">namespace ForEvolve.Blog.Samples.NinjaApi
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //
            // Composition Root
            //
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseMvc();
        }
    }

}
</code></pre>

<figcaption>
Asp.Net Core Composition Root, see <code>Startup.cs</code>.
</figcaption>

</figure>

### Container

While Dependency Injection and Inversion of Control are concepts, an Inversion of Control Container (or IoC Container) is the piece of software that does the magic for you. We could also refer to it as a Dependency Injection Container (or DI Container).

The container manages dependencies and their lifecycle.

---

> We could resume the use of a Container as follow: <br> **You register your dependencies in it, and it gives you back what you configured; when needed.**

---

In our case, we will use the default built-in Asp.Net Core Dependency Injection framework (also known as IoC container).

### Constructor injection

There are multiple ways to inject dependencies, and the best known and most recommended way is by constructor injection.

This means that instead of creating an object manually (ex.: `var service = new NinjaService();`) we let our DI Container inject our dependencies for us, as a constructor argument.
Then, inside the class, we keep a reference on that dependency for future use (most of the time as a `private readonly` field).

**Example:**

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi
{
    [Route("v1/[controller]")]
    public class SuperCoolController : Controller
    {
        private readonly IChildService _childService;

        public SuperCoolController(IChildService childService)
        {
            _childService = childService ?? throw new ArgumentNullException(nameof(childService));
        }

        [HttpGet]
        public void MySuperCoolMethod()
        {
            // some code here...
            _childService.DoSomething();
            // some more code here...
        }
    }
}
```

In the sample above, we inject an implementation of `IChildService` in the `SuperCoolController` constructor.
We also added a "guard clause" to make sure that `childService` is not null.
Then we saved a reference in `private readonly IChildService _childService;` that is used in `MySuperCoolMethod`.

---

> **Defining a good URI convention**
>
> Defining a good URI convention is important when designing Web APIs, it is a big part of the contract between the consumers and the API.
>
> That said, in the example below, the `[Route("v1/[controller]")]` attribute defines the route that will be used to reach the controller.
> I prefixed the route with `v1` because having a version defined is a good thing.
> Some will say that versions don't go into URLs, some will say they do, etc., etc.
> I will leave the philosophy debate out of the article and simply go for: this is the way I chose for this article series; pick the one you prefer in your APIs.
>
> I could also have prefixed my route with `api` like this `[Route("api/v1/[controller]")]`, but in this case, we know it is an API, the whole application is an API.
>
> More on that, we could see the full URL convention as follow: `[version]/[domain]/[subdomain]/[params]` where `subdomain` and `params` are optional.
> This is a good default, in my opinion.

---

### Guard Clause

A guard clause is nothing more than a way to ensure that our class received an implementation upon its construction: no `null` allowed!

Usually, if a `null` is passed as an argument, an `ArgumentNullException` is thrown to notify the system about the error.

The following line uses the new VS 2017 patterns and will be mostly the same for each one of your dependencies: `_childService = childService ?? throw new ArgumentNullException(nameof(childService));`.

---

> **Tools**
>
> I have created some Visual Studio snippets to help write guard clause faster.
> See [GitHub](https://github.com/ForEvolve/vs-snippets) if you are interested.

---

### Service lifetimes

Before mapping dependencies in the Composition Root (creating the object graphs), we need some theory about "service lifetimes."

To be quick, we can see service lifetimes in two ways (they mean the same thing):

1. The DI Container must know for how long an instance of an object should live.
2. The DI Container must know how often an instance of a class must be created.

**Asp.Net Core lifetimes**

Here are the three available Asp.Net Core lifetimes:

<figure>
    <table>
        <thead>
            <tr>
                <th>Service lifetimes</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Transient</td>
                <td>Transient lifetime services are created each time they are requested. This lifetime works best for lightweight,
                    stateless services.</td>
            </tr>
            <tr>
                <td>Scoped</td>
                <td>Scoped lifetime services are created once per request.</td>
            </tr>
            <tr>
                <td>Singleton</td>
                <td>Singleton lifetime services are created the first time they are requested (or when ConfigureServices
                    is run if you specify an instance there) and then every subsequent request will use the same instance.
                    If your application requires singleton behavior, allowing the services container to manage the service’s
                    lifetime is recommended instead of implementing the singleton design pattern and managing your object’s
                    lifetime in the class yourself.</td>
            </tr>
        </tbody>
    </table>
    <figcaption>
        Asp.Net Core service lifetimes, shamelessly copied from <a href="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection#service-lifetimes-and-registration-options"
            target="_blank">the official documentation</a>.
    </figcaption>
</figure>

**Registration methods**

There are multiple methods and extensions to register services with the Asp.Net Core DI Container.
I outlined a few in the following table.

---

> In the following table, most of the time, the `TService` will be the interface while the `TImplementation` will be the class.
>
> Example: `services.AddSingleton<ISomeService, SomeService>();`

---

<table>
    <thead>
        <tr>
            <th>Service lifetimes</th>
            <th>Registration methods</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Transient</td>
            <td><code>services.AddTransient<TService, TImplementation>();</code></td>
        </tr>
        <tr>
            <td>Scoped</td>
            <td><code>services.AddScoped<TService, TImplementation>();</code></td>
        </tr>
        <tr>
            <td>Singleton</td>
            <td><code>services.AddSingleton<TService, TImplementation>();</code></td>
        </tr>
    </tbody>
</table>

---

> **Tips**
>
> Use the `Singleton` lifetime as much as possible, it lowers the number of objects that need to be created, so its speed things up.
> If `Singleton` is not possible, see if you can go for `Scoped` (one instance per HTTP request).
> If using `Singleton` or `Scoped` is impossible, go for `Transient`.

---

### Linking everything together

Now that we covered all of that, we need to map our dependencies.
By using our previous examples, the registration code will look like this:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<IChildService, ChildService>();
    services.AddMvc();
}
```

That's it, if we visit the `/v1/SuperCool` URI, our browser should "display" an internal server error!
That's right, a status code 500!

It's rare that a Web developer is happy to see a status code 500, but well, in our case, that's because of our `ChildService.DoSomething()`method; it `throw new NotImplementedException();` which leads to an "InternalServerError".

## The end of this article

### What have we covered in this article?

We made a quick overview of Dependency injection and now, you know the basics behind it.
Obviously, to master a technique you need to practice, practice, and practice even more.

So (surprise!) I recommend you to practice!
Maybe update this quick example to something better. For starter replace that `NotImplementedException` by some useful code.
Having your controller action return something could also be more exciting.

Here are the topics we covered:

-   Dependency Injection - the basics
-   The Composition Root - where we compose our object graph
-   DI Containers - the piece of software that manage dependencies for us
-   Constructor injection - the pattern to compose objects and break dependencies
-   Guard Clause - the pattern to make sure we don't receive `null` services
-   Service lifetimes - the amount of time a service instance should live
-   Mapping our dependencies (creating object graphs) - us controlling how our software should work

**Code recap**

Before going to the "What's next?" section, lets review the whole code:

```csharp
namespace ForEvolve.Blog.Samples.NinjaApi
{
    public class ChildService : IChildService
    {
        public void DoSomething()
        {
            throw new NotImplementedException();
        }
    }

    public interface IChildService
    {
        void DoSomething();
    }

    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IChildService, ChildService>();
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseMvc();
        }
    }

    [Route("v1/[controller]")]
    public class SuperCoolController : Controller
    {
        private readonly IChildService _childService;

        public SuperCoolController(IChildService childService)
        {
            _childService = childService ?? throw new ArgumentNullException(nameof(childService));
        }

        [HttpGet]
        public void MySuperCoolMethod()
        {
            // some code here...
            _childService.DoSomething();
            // some more code here...
        }
    }
}
```

### What's next?

Next, we will start writing some Ninja App code and see all that theory in practice, beginning by the `ClansController`.

**A Ninja need a clan to fight for!**
<small>(And because it is a very simple controller)</small>

<aside>
    <section class="with-amazon-content">
        <aside class="amazon-content">
            <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=forevolve0b-20&marketplace=amazon&amp;region=US&placement=1935182501&asins=1935182501&linkId=95fde63ce69ec153c64356914551ba09&show_border=false&link_opens_in_new_window=true&price_color=404040&title_color=007f00&bg_color=ffffff"></iframe>
        </aside>
        <section class="blog-content">
            <header>Dependency Injection</header>
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

{% include design-patterns-web-api-service-and-repository/footer.md %}
