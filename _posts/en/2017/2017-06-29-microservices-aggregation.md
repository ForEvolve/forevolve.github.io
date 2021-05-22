---
title:  "Microservices Aggregation"
date:   2017-06-29 00:00:00 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2017-06-29-microservices-aggregation.jpg"
lang: en
categories: en/articles
tags: 
- Design Patterns
- Microservices
- Asp.Net Core
- Web API
- C#
proficiency-level: Advanced
---

A few weeks ago I had to put together a one hour talk about something IT related. To make the introduction quick: I ended up talking about Microservices.

In that talk, to demonstrate a few things, I created some code samples using .NET Core, 
<a href="https://github.com/Carl-Hugo/Microservices-Demo-DigiHub-2017" target="_blank">available at GitHub</a>.
I implemented different services, coded using multiple coding styles. Some services are easier to understand for beginners while others are more "complex" and more testable.

I also briefly talked about an alternate way to start building a product using Microservices for small teams. 
I will introduce and discuss this pattern more in depth here.

This technique could also be applied to any MVC project where you want to divide domain boundaries into multiple assemblies.

## Microservices
I will not cover the basics of the Microservices design pattern here; I will leave that to others, such as
  <a href="https://martinfowler.com/microservices/" target="_blank">Martin Fowler</a>,
  <a href="http://microservices.io/" target="_blank">microservices.io</a> and 
  <a href="https://www.google.com/search?q=microservices" target="_blank">Google</a>.

So, basically, in a Microservices design, you trade coupling for <a href="https://martinfowler.com/articles/microservice-trade-offs.html#ops" target="_blank">operational complexity</a>.

While enjoying the fact that every service is decoupled from one another, it can rapidly become hard to manage. Particularly for a small software, a small team, a small business or a startup (noticed the keyword "small" here?)

Nevertheless, aligning your software with the Microservices mindset could bring some advantages over a more Monolithic approach, even for a tiny company.<!--more-->
Disclaimer: Microservices are no more magical than any other design pattern, so begin with a good analysis, then make an educated choice (as you should already do).

In the past year, I ended up thinking a lot about Microservices for some projects, but I needed an easier solution to deploy. Deploying one application per service was overkill, without thinking about all the data sources, the serverless functions to sync those data sources, all the deployment scripts, the networking, etc. With limited manpower, it could become a nightmare. Containers could help here, but they add their share of pros and cons.

All that said, I had an idea. I thought of some hybrid architecture between a Monolith and Microservices. There is no new concept here; I only used techniques that were possible and that I used for years. The biggest difference is the goal: a hybrid design that is lowering the operational complexity cost while keeping services as decoupled as possible.

Let's call this **Microservices Aggregation**.

The goal is to:

1. Keep Microservices separated and independent (decoupled).
1. Keep the number of services to deploy as low as possible. 
    * To begin with, we could define "low" to 1.

If we recap, the goal is **as many as possible in as less a possible**. That is a bit of a paradox, isn't it?

## Paradoxical or not that paradoxical?
As a C# guy, I compile assemblies, right? So why not create an assembly per service then "aggregate" them all back together in a "super-assembly"? 

The results: all Microservices, aggregated in a single assembly, whose role is to bootstrap the whole system. 
That assembly references the other services, then bootstrap them using the ASP.NET Core `Program.cs` and (or) `Startup.cs` files.

By doing this, we reduced the number of applications to deploy to one. We also created the possibility to extract those services back easily as the software, the userbase, the business or the team(s) grow! Moreover, since all services are independent, it is ultra easy to do.

## The paths to success
We will do the following to achieve our goal:

1. Define a good URI convention. 
1. Configure the DI object graph per Microservice.
1. Define a Settings convention.

### Define a good URI convention
Defining a good URI convention will help lower the endpoints management cost. 
This will also help keeps Microservices endpoints linear and help navigate a growing codebase.

**Exemple:**
The following convention `[version]/[microservice]/[controller]/[params]` could become a `GET` request like `v1/catalog/product/114` where `catalog` is the name used to identify the catalog microservice assembly.

### Configure the DI object graph per Microservice
We will create one or more extension methods that manage the DI graph for each assembly. 
This will help save a lot of time as well as help organize the code. 
It will also allow us to test each service individually, over HTTP (in automated tests or Postman for example), as well as to easily put them all back together in the `Aggregator`.

In short, you can spin up an individual service or the whole system, which is pretty neat.

#### How will we do that?
In each service project, we will create the following extension methods: `services.AddMyServices()` and `app.UseMyServices()`, following the ASP.NET Core conventions. 
If you only need `services.AddMyService()`, only create this one and if you need more, well, create more...

In the `AddMyServices()` extension method we will register the DI graph of our microservice project, example:

``` csharp
namespace Microsoft.Extensions.DependencyInjection
{
    public static class MyServicesStartupExtensions
    {
        public static void AddMyServices(this IServiceCollection services)
        {
            // My services
            services.AddSingleton<ISomeRepository, SomeRepository>()
            services.AddSingleton<ISomeService, SomeService>()
        }
    }
}
```

*The namespace could also be `MySuperProject` or something else. I do not believe that there is a clear naming convention yet.*

### Define a Settings convention
Defining a good settings convention will help us make sure that each service stays independent. 

We need to remember that all services will end up using the same `appsettings.json` file and that each Microservice should be responsible for its own data, which lead to one or more data sources per Microservice. 
We do not want overlaps here since this could be catastrophic. 

*Here is an example of a catastrophic failure: one service overwriting the data of another service due to a shared config key name. What a fun problem to diagnose!*

There are multiple ways of doing this, and the best way is to think about this with your own project in mind and to discuss it with your colleagues.

For today, I will go for: 
*One configuration object per service, where each configuration object will be responsible for the microservice settings, including its data source(s).*

**Some idea about naming that object:**

* `[Microservice name]`
* `[Microservice name]Api`
* `[Microservice name]Service`
* `[Microservice name]Microservice`

To stay in line with my code samples, I would go for `[service]Api`, but if I had to rewrite the code sample, I would simply go for `[Microservice name]` since the `Api` part is unnecessary.

---

For a Microservice named `MyService` I would go for:

```JSON
"MyServiceApi": {
}
```

**OR**

```JSON
"MyService": {
}
```

Adding some Azure storage account info to it could result in:

```JSON
"MyServiceApi": {
    "Storage": {
        "AccountKey": "[AccountKey here]",
        "AccountName": "[AccountName here]",
        "TableName": "MySuperImportantTableName"
    }
}
```

## The code
If you take a look at GitHub, in the <a href="https://github.com/Carl-Hugo/Microservices-Demo-DigiHub-2017/tree/master/src/Services" target="_blank">src/Services</a> directory, 
there is four services. I also coded each service differently. Some have directories; some don't, some use the Repository pattern, some have all the code in the controller, etc. 
I did that on purpose to adapt my talk to my audience, live.

The domain is an ultra-simplistic over-divided "to-do list."

### Todo.[Boards|Cards].Api
The `Boards` service handles the todo boards while the `Cards` service handles to-do cards management.
I could have done a single "to-do" service here, but I split it into two services to create more interaction between microservices. 
The goal was to demo the mechanics behind Microservices.

### Users.[Read|Write].Api
Those two services are managing users. I split them to show the <a href="https://martinfowler.com/bliki/CQRS.html" target="_blank">CQRS (Command Query Responsibility Segregation)</a> design pattern. One service handles the read; the other handles the write. 

Both services use a different Azure Table. The synchronization is backed up by an Azure function. *Unfortunately, as of today, the serverless code is not on GitHub (yet).*

### The Aggregator
If we take a look at the <a href="https://github.com/Carl-Hugo/Microservices-Demo-DigiHub-2017/tree/master/src/Aggregators/Microservices.ServicesAggregator" target="_blank">ServicesAggregator</a>, the code is really simple.

### Program.cs
I have not touched the `Program.cs` file, it is as Visual Studio created it.

### Microservices.ServicesAggregator.csproj
I referenced the other project files and a few other tools like `Swashbuckle.AspNetCore` and `ForEvolve.DynamicInternalServerError.Swagger`. 

> `ForEvolve.DynamicInternalServerError.Swagger` use `ForEvolve.DynamicInternalServerError` which convert `Exception`s to JSON automatically plus some more stuff. 
> The `.Swagger` library connect that information into `Swashbuckle.AspNetCore` for all actions (unless 500 is explicitly specified).
> 
> The `ForEvolve.*` libraries are my take at open source. All my open source libraries are or will be available at <a href="https://github.com/ForEvolve/Toc" target="_blank">GitHub</a>.

The projects reference:

```XML
  <ItemGroup>
    <ProjectReference Include="..\..\Services\Microservices.Todo.Boards.Api\Microservices.Todo.Boards.Api.csproj" />
    <ProjectReference Include="..\..\Services\Microservices.Todo.Cards.Api\Microservices.Todo.Cards.Api.csproj" />
    <ProjectReference Include="..\..\Services\Microservices.Users.Write.Api\Microservices.Users.Write.Api.csproj" />
  </ItemGroup>
```

*Note that the `Users.Read` microservice is not referenced here because it is using a beta version of NET Core. When NET Core 2.0 is released (technically soon), I could (and probably would at some point) include it. I used that version to demo the `Router`. For the current article, it does not change anything.*

### appsettings.json
All the settings for all the microservices are there, as simple as that.

### Startup.cs
Here is where the fun begins. Most of the code is bootstrapping the application, but the following:

``` csharp
// AutoMapper
services.AddSingleton(serviceProvider =>
{
    return new MapperConfiguration(cfg =>
    {
        cfg.AddProfile(new CardsMapperProfile());
        cfg.AddProfile(new UsersMapperProfile());
    }).CreateMapper();
});

// Add todo api services
services.AddTodoBoardsServices(Configuration);
services.AddTodoCardsServices(Configuration);
services.AddUsersWriteServices(Configuration);
```

The great part about this: the "aggregator" is loading two AutoMapper profiles and is calling three extension methods, and that is it!

#### Profile(s) registration extension method
We could even create an extension method per service that handles the profile(s) registration. 
This could be reused for standalone start up of an individual service.

**Example:**

``` csharp
services.AddSingleton(serviceProvider =>
{
    return new MapperConfiguration(cfg =>
    {
        cfg.AddCardsMapperProfiles();
        cfg.AddUsersMapperProfiles();
    }).CreateMapper();
});
```

## Advantages and disadvantages
Now that we took a look at all of this; let's recap by listing advantages and disadvantages.

### A little interlude
This is a part of software engineering that I love: 

> Assess the pros, and the cons then make the best possible decision based on what is known. 

*And let be honest, most of the time, "what is known" is defined by "incomplete data" (or "really incomplete data").*
 
That being understood, it may help to choose a more evolutive design since you will probably aim at least a little off no matter what!

This is what driven me toward "Microservices Aggregation": **evolutivity**. *We could even say "low-cost evolutivity."*

### Advantages

- Smaller operational complexity than a full-blown Microservices system
- Low coupling between microservices
- Good separation of concerns (or domain boundaries), allowing to have different developers in charge of different services.
- Easier than adding, even more, new technologies like containers and what not.

### Disadvantages

- If the "aggregator" crash, as a monolith, the whole system instance crash.
- We are losing the "multi-language" advantage since we are compiling a single assembly (is this a big deal?).
- Since all microservices are part of the same solution, it is easier to create coupling between assemblies. 
    - For this one, developers and managers need to be aware of this. Like any other systems, once you start hacking your way through it to release faster you are entering the doomed path of the <a href="http://www.laputan.org/mud/" target="_blank">ball of mud</a>! So don't!



## Conclusion
There is probably a lot more advantages and disadvantages to this and even more to say about "Microservices Aggregation." Since I started to write this up more than a month ago, I will throw this out in the wild internet now. I may write more about this later or update the current article if I find more information to add to it. I may even write a second part, who knows.

That said, "Microservices Aggregation" is a good way, in my opinion, to start small; and to easily grow bigger, up to a full-blown Microservices system (eventually).