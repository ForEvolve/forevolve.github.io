---
title:  "Design Patterns: Asp.Net Core Web API, services, and repositories"
subtitle: "Part 1: Introduction"
date:   2017-08-11 00:00:00 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2017-07-00-asp-net-core-design-patterns.png"
lang: en
categories: en/articles
tags: 
- Design Patterns
- Asp.Net Core
- Web API
- C#
- NoSQL
- Azure
- Azure Table Storage
- ForEvolve Framework
- Dependency Injection
- Unit Test
- XUnit
- Service Layer Pattern
proficiency-level: Intermediate
---

In this article series, I'd like to go back a little (from my previous [Microservices Aggregation](/en/articles/2017/06/29/microservices-aggregation/) article which was more advanced) and introduce some more basic design patterns. Those patterns help decouple the application flow and extract its responsibilities into separate classes. 

The goal is to give each class a single unique responsibility, which will help us follow the [Single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle).
See the [SOLID principles](https://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29) for more information.<!--more-->

{% include design-patterns-web-api-service-and-repository/series.md %}

## The patterns
We will follow the same concept that are behind the [N-tier architecture](https://en.wikipedia.org/wiki/Multitier_architecture) but, without creating multiple assemblies. 
In our case, we don't need that level of separation and depending on how the code is organized; it is not mandatory.

**If you don't know anything about N-tier architecture, don't worry I will explain what you need to know during the series.**

*More on that, with the way Asp.Net Core handles references by default, we would have access to our data access code from the presentation layer anyway which would void the idea behind layering.*

That said, there are always multiple ways of having things done in software engineering, suffice to know enough and to choose wisely. So keep learning!

---

> Instead of dividing a software into layers, we can split the software into small independent projects
> where each project (assembly) owns all of the code required for its sub-domain (or [Bounded Context](https://martinfowler.com/bliki/BoundedContext.html)).
> This way we encapsulate the code in "domain bubbles" instead of layers.
> We could see this as cutting our software vertically instead of horizontally.
> 
> More on this another time, let's go back to our business!

---

The basic idea is the following:

1. A user sends an HTTP request to the server.
1. Asp.Net MVC route the request to a `Controller` action.
1. The action's responsibility is to handle the request and the response, nothing more.
1. Since the *domain logic* is not of the controller responsibility, it must be delegated to another object. That object is the `Service`.
1. While the `Service` owns the *domain logic* responsibility, it cannot take another one so it cannot handle the *data access* logic. It must delegate that to the `Repository`.
1. The `Repository`, as already stated, is responsible for the data-access. Basically, it read/write data from/to a *data-source*.
    * In our case, the data-source will be an Azure Storage's Table.

This may sound complicated, but don't worry it is not, it is pretty simple once you get used to it. 
**This is a modular (reusable) and testable (reliable) approach.**

<figure>
    <img src="//cdn.forevolve.com/blog/images/2017/controller-service-repo.png">
    <figcaption>
        An HTTP request from the <code>Controller</code> to the data-source passing by the 
        <code>Service</code> and the <code>Repository</code>.
    </figcaption>
</figure>

---

> This is a good default way of doing things as long as there is no special cases or restrictions.

---

## The Domain
Now that we settled on the parts we want to talk about, we need a subject for our Web API. 
The subject is the domain.
Since coding is fun, let's use "Ninjas" as our domain. 
Ninjas are always fun to talk about, so, why not, right?

To redraw the previous schema using Ninjas, we would need the following classes:

1. The `NinjaController` class (presentation layer).
1. The `NinjaService` class (domain logic layer).
1. The `NinjaRepository` class (data access layer).

<figure>
    <img src="//cdn.forevolve.com/blog/images/2017/controller-service-repo-ninja-coupled.png">
    <figcaption>An HTTP request from the <code>Controller</code> to the data source, including some implementation details (hard coupling).</figcaption>
</figure>

### Dependency injection
As you may have noticed, a class that calls a second class that calls a third class means coupling. 

- `NinjaController` and `NinjaService` are directly coupled.
- `NinjaService` and `NinjaRepository` are directly coupled.
- `NinjaController` and `NinjaRepository` are indirectly coupled.

In our final application, we will break that coupling using `Interface`s and we will bind everything together with [Dependency Injection](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection).

Conceptually, we will add the two following interfaces:
1. The `INinjaService` interface (domain logic abstraction).
1. The `INinjaRepository` interface (data access abstraction).

And we will implement them in these classes:
1. The `NinjaService` class implements `INinjaService`.
1. The `NinjaRepository` class implements `INinjaRepository`.

The conceptual representation of the process, at this point, could look like this:
<figure>
    <img src="//cdn.forevolve.com/blog/images/2017/controller-service-repo-ninja.png">
    <figcaption>An HTTP request from the <code>Controller</code> to the data source. This is a conceptual break of the hard coupling of the previous schema.</figcaption>
</figure>

Since an interface is only an empty contract containing no code, a class that depends on an interface, only depends on its contract, not on any of its implementation.
Applying this principle will allow us to decouple our classes.

From now on, **our classes will only use other interfaces**; never another concrete implementation. This could be represented as follow:
<figure>
    <img src="//cdn.forevolve.com/blog/images/2017/controller-service-repo-ninja-with-DI.png">
    <figcaption>An HTTP request from the <code>Controller</code> to the data source, fully decoupled.</figcaption>
</figure>

As we can see in the previous schema, the `NinjaController` class only know about the `INinjaService` interface and know nothing else.
The same goes with the `NinjaService` class, its awareness of the system is limited to `INinjaRepository` interface.
Even better, the `NinjaRepository` class is the only one that knows about Azure Storage.

By using interfaces instead of concrete classes, we broke the direct dependencies between our implementations.

As stated before, we will use Dependency Injection to link all of these back together.
We will cover the basics of Dependency Injection in the next article of the series.

---

> **Interesting fact**
>
> Dependency Injection is now built-in Asp.Net Core; which is a really good thing.

---

## The benefits
Once you get used to these patterns, it adds flexibility at near zero cost. 
The time to code a `Service` or a `Repository` is minimal, especially when using a tools like `ForEvolve.Azure` or a full-fledged ORM like [Entity Framework](https://docs.microsoft.com/en-us/ef/core/). 

### Examples of what you could do
It gives you the opportunity to swap a data source with minimal to no impact on the domain logic. 
The swap can even be done at runtime. 

Same thing goes for the `Controller` and the `Service`, helping you to keep your public API healthy. 

For example, we could code two classes that implements `INinjaRepository`. We could then swap our data access logic from Azure Table Storage to MS SQL Server as easily as changing the dependency injection binding. 
Both implementation could be use at the same time for different purpose in our program, sharing the Domain Logic while persisting the data in different places. 

**Concrete idea:** a configurable data source for each user, at runtime.

<figure>
    <img src="//cdn.forevolve.com/blog/images/2017/controller-service-repo-ninja-multi-data-sources.png">
    <figcaption>Multiple implementation of <code>INinjaRepository</code> allowing to easily swap data-sources without impacting the domain logic.</figcaption>
</figure>

#### Swappable implementations example
To simplify things up, I implemented a small example using simplified classes.
If you are interested in this topic, I invite you to take a look at my little demo project, available at [GitHub](https://github.com/ForEvolve/ForEvolve.Blog.Samples/tree/master/SwappableImplementation/README.md).

In that project, I use the patterns explained in this series, so you might want to consider going through the series first.

## The end of this article
### What have we covered in this article?
We now understand or have learned a few concepts that we will apply in the articles of the series and the reasons behind these architectural choices.
In each subsequent articles, we will focus a little more on each of those parts individually.

Here are the design patterns we talked about:

- Controller (presentation layer) - MVC - Web API
- Service (domain logic)
- Repository (data access)
- Dependency Injection (binding everything together using Inversion of Control)

### What's next?
Next, we will start writing code and see all that theory in practice, beginning by the `Controller` and the API Contracts.
But before that, we will talk a little about Dependency Injection to help beginners understand a little more about this unavoidable subject. 

*If you are familiar with Dependency Injection in Asp.Net Core, feel free to skip that article.*

{% include design-patterns-web-api-service-and-repository/footer.md %}
