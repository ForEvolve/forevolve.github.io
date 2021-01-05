---
title: 'Book: An Atypical ASP.NET Core 5 Design Patterns Guide'
subtitle: "What's inside?"
date: 2021-01-05 00:00:00 -0500
post-img: '//cdn.forevolve.com/blog/images/articles-header/2021-01-00-Book-content.png'
lang: en
categories: en/articles
tags:
    - C#
    - Design Patterns
    - ASP.NET Core 5
    - .NET 5
    - Book
proficiency-level: Intermediate
---

Are you wondering what's **An Atypical ASP.NET Core 5 Design Patterns Guide** is all about?
Here I'll list as much information as possible, from the highlights to the journey, passing by the list of patterns, architectural styles, and other stuff covered in the book.

<!--more-->

## Highlights

Things you will learn (from the back cover):

-   Apply the SOLID principles for building flexible and maintainable software
-   Get to grips with .NET 5 dependency injection
-   Work with GoF design patterns such as strategy, decorator, and composite
-   Explore the MVC patterns for designing web APIs and web applications using Razor
-   Discover layering techniques and tenets of clean architecture
-   Become familiar with CQRS and vertical slice architecture as an alternative to layering
-   Understand microservices, what they are, and what they are not
-   Build an ASP.NET UI from server-side to client-side Blazor

## What's the journey?

An Atypical ASP.NET Core 5 Design Patterns Guide is like a journey where we explore architectural techniques together.
In the book, we cover many subjects to learn to think pattern and design, step by step while exploring code.
We deep dive into many subjects while exploring others at a higher level.
You will also learn many possibilities, side techniques, and tricks along the way.
While a few chapters are standalone, you learn many skills early on that converge into something else in a further chapter.
Some topics like dependency injection are used throughout the book.

Using and mixing patterns as fluidly as possible is essential.
As a developer who aspires to become better at software architecture, your goal is to use the right tool for the right job.
And to know your tools, you have to use them, not read _magic recipes_ about them.
Those _magic recipes_ rarely apply when you face a real problem.
This is why we explore many samples throughout the book, using different styles.
Some use unit tests as consumers, other use console applications, and others use web APIs.
Some projects are one-shot, while some are reused and improved upon many times.
Sometimes in a single chapter, we improve a project a few times, but some projects are improved over several chapters (and not necessarily continuous ones).

All of that content is written in a straight forward way, one person to another; while using the right terms to describe notions, I use everyday English to break them down.
I'm trying to demystify as many esoteric definitions as possible, in plain and simple English.

All in all, there is a lot of content in there, so let's have a deeper look.
The following describes the book, section by section, and chapter by chapter.
Afterward is a list of the patterns and features.

### Section 1, Principles and Methodologies

This section introduces you to a few foundational topics.

In _Chapter 1, Introduction to .NET_, we start with introductory topics, like what is a design pattern, an anti-pattern, and a code smell.

In _Chapter 2, Testing Your ASP.NET Core Application_, we briefly explore unit testing and xUnit.
We use tests as the consumer of many code samples throughout the book.

In _Chapter 3, Architectural Principles_, we explore the SOLID principles, with many examples to help you understand.
We are using those principles throughout the book.

### Section 2, Designing for ASP.NET Core

This section focuses more on ASP.NET Core itself while laying the ground for some fundamental design patterns, and dependency injection.

In _Chapter 4, The MVC Pattern using Razor_, we look into MVC and peak at some framework features.
We then cover the View Model pattern.

In _Chapter 5, The MVC Pattern for Web APIs_, we explore the web API counterpart of MVC, Data Transfer Objects (DTOs), and API contracts.

In _Chapter 6, Understanding the Strategy, Abstract Factory, and Singleton Design Patterns_, we explore our first GoF design patterns, which are foundational.

In _Chapter 7, Deep Dive into Dependency Injection_, we learn about dependency injection (DI), how it works, and how to leverage that tool.
We also revisit the patterns from _Chapter 6_, but using dependency injection this time.
This chapter lays the ground for a whole new world of possibilities and is essential since DI is at the core of both ASP.NET Core and the book itself.

In _Chapter 8, Options and Logging Patterns_, we explore the options pattern to load settings and the logging abstractions.
Those are two great .NET Core-specific tools that we can leverage.

### Section 3, Designing at Component Scale

In this section, we design components.

In _Chapter 9, Structural Patterns_, we discover the Decorator, Composite, Façade, and Adapter design patterns.
These are fantastic patterns to add flexibility to your programs without much effort.

In _Chapter 10, Behavioral Patterns_, we explore the Template Method and the Chain of Responsibility patterns.
At the end of the chapter, we use both to improve our design.

In _Chapter 11, Understanding the Operation Result Design Pattern_, we cover multiple ways to implement what I call the operation result pattern.
We do it from simple to more complex use cases, so you can understand how to make that pattern evolve around your needs.

### Section 4, Designing at Application Scale

This section shows many ways to structure your application as a whole from a higher level.
We also cover many building blocks used in those architectural styles.

In _Chapter 12, Understanding Layering_, we deep dive into layering.
Layering is probably the most wide-spread way of building anything software-related.
We look into the most common layers and how to share layers.
We are breaking tight-coupling by applying the dependency inversion principle.
We explore rich and anemic domain models.
We finally touch Clean Architecture, which is just the evolution of these other subjects.

In _Chapter 13, Getting Started with Object Mappers_, we explore object mapping.
To improve our initial design, we discover aggregate services.
Then we use the façade pattern to improve that same design again.
Finally, we look into AutoMapper, which we are using in other chapters afterward.

In _Chapter 14, Mediator and CQRS Design Patterns_, we implement another GoF classic: the Mediator pattern.
We also look into Command Query Responsibility Segregation (CQRS) and build a few projects along the way.
We complete this chapter by implementing a CQRS-inspired project that introduces MediatR as a free, open source, generic mediator implementation.

In _Chapter 15, Getting Started with Vertical Slice Architecture_, we piece many preceding notions together and explore Vertical Slice Architecture.
This way of designing an application is very interesting and almost the opposite of layering.
If you never heard of it, I think it is more straightforward than layering, easier to get started, but it may require more skills to master (more choices).
Let's just say that it is a feature-oriented architectural style.

In _Chapter 16, Introduction to Microservices Architecture_, we theoretically explore microservices and touch on many subjects.
We look into message queues, events, publish-subscribe, several gateway patterns, and we revisit CQRS at cloud-scale.
We also take a quick look at containers, which is crucial to deploy microservices.
This chapter is more conceptual and theoretical, as it would require more than a book to cover microservices architecture in its entirety.

### Section 5, Designing the Client Side

In this section, we come back to ASP.NET Core user interfaces and explore many possibilities.

In _Chapter 17, ASP.NET Core User Interfaces_, we look at almost anything we can do with Razor.
We explore Razor Pages, partial views, Tag Helpers, and view components.
We look into C# 9 features, such as top-level statements, target-typed new expressions, init-only properties, and record classes.
Finally, we dive into Display and Editor Templates and explore how to create a type-oriented user interface.
This last project reuses the composite pattern project and renders a complex structure with minimal effort.

In _Chapter 18, A Brief Look into Blazor_, we look into Blazor.
We focus on Blazor WebAssembly (Wasm) and explore Razor components, CSS isolation, component life cycle, and event handling.
We then learn about the Model-View-Update (MVU) pattern and implement a small project to grasp it.
The chapter ends with a medley of Blazor features to help you get started if you are interested in that new piece of technology.

Next, let's look at what's in there, feature/pattern-wise.

## Architectural principles

-   SOLID principles
-   DRY principle
-   Separation of concerns
-   Some others

## What patterns are covered?

-   MVC using Razor and web APIs
-   View models
-   Data Transfer Objects
-   Strategy (classic and revisited with DI)
-   Abstract Factory
-   Singleton (classic and revisited with DI)
-   Factories using DI
-   Decorator
-   Composite
-   Adapter
-   Façade
    -   Opaque façades
    -   Transparent façades
    -   Static façades
    -   Alternative façades
-   Template Method
-   Chain of Responsibility
    -   Mixing the Template Method and the Chain of Responsibility patterns
-   Operation Result (from basic to more advanced scenarios)
-   Repository (overview)
-   Unit of Work (overview)
-   Object Mappers
    -   A few alternatives
    -   Aggregate Services (pattern)
    -   Mapping Façade (pattern)
    -   Mapping Service (pattern)
-   Mediator
-   CQRS
    -   Inside a single application
    -   Concepts behind a distributed, serverless implementation
-   Messaging (theoretical)
    -   Message queues
    -   Publish-Subscribe pattern
-   Event sourcing (theoretical)
-   Materialized views (theoretical)
-   Gateway (theoretical)
    -   Routing
    -   Aggregation
    -   Backends for Frontends
    -   Mixing and matching gateways
-   Model-View-Update (MVU)

## What architectural style are we exploring?

-   Layering
    -   Common layers (presentation, domain, persistence)
    -   Splitting layers
    -   Domain model (Anemic and Rich)
    -   Sharing the model between layers
    -   Abstract layers
    -   Clean Architecture
-   Vertical Slice Architecture
-   Microservices

## What about Code Smells and Anti-patterns?

-   Anti-pattern: Big Ball of Mud
-   Anti-pattern: God class
-   Code smell: Ambient Context
-   Code smell: Control Freak
-   Code smell: Long methods
-   Code smell: Marker interfaces
-   Code smell: Service Locator
-   Code smell: Too many dependencies

## .NET-specific features

-   Deep Dive into Dependency Injection (DI)
    -   The composition root
    -   Extending `IServiceCollection`
    -   Object lifetime
    -   Constructor injection
    -   Property injection
    -   Method injection
-   .NET Core Options pattern
    -   Abstractions (`IOptionsMonitor<TOptions>`, `IOptions<TOptions>`, `IOptionsSnapshot<TOptions>`, and `IOptionsFactory<TOptions>`)
    -   Named options
    -   Configuring options
    -   Validating options
    -   Injecting options without the framework interfaces
-   .NET logging abstractions
    -   Writing logs
    -   Log levels
    -   Optimization
    -   Logging providers
    -   Configuring logging
-   MVC
-   Razor Pages
-   Partial views
-   Tag Helpers
-   View components
-   Display Templates
-   Editor Templates
-   Blazor Server (quick overview)
-   Blazor WebAssembly (Wasm)
-   Razor components
    -   CSS isolation
    -   Component life cycle

## What about C#?

-   Top-level statements (C# 9)
-   Target-typed `new` expressions (C# 9)
-   Init-only properties (C# 9)
-   Record classes (C# 9)
-   Switch expressions (C# 8)
-   Static local function (C# 8)
-   Async main (C# 7.1)
-   Default literal expressions (C# 7.1)
-   Tuples (C# 7+)
-   Local functions (C# 7)
-   Discards (C# 7)
-   Throw expressions (C# 7)
-   Expression-bodied function members (C# 6)
-   Class conversion operators

## Others

-   xUnit
-   Unit testing
-   Integration testing
-   REST
-   API contracts
-   Guard clause
-   Using Scrutor to register decorators
-   Using MediatR as a generic mediator
-   Using AutoMapper as a universal object mapper
-   Using FluentValidation to validate use cases
-   Domain and integration events
-   Eventual consistency
-   Operational complexity
-   Containers (overview)
    -   Docker
    -   Docker Compose
    -   Orchestration
-   [StateR](https://github.com/ForEvolve/StateR), an MVU/Redux-style library

## Conclusion

And voilà! We dived into the content of **An Atypical ASP.NET Core 5 Design Patterns Guide**.
Now that I'm done writing the book, I'll have more time for blogging and continue sharing free content with the world.

That said, if what I just described sounds appealing to you, or if you wish to support me, you can buy my book on Amazon (see below).
After reading it, please take a few minutes of your time to leave a review on Amazon (especially if you liked it because let's face it, that's when we tend not to leave reviews and that's what I need to sell more books).

If you are interested in the story behind the book, have a look at the following article:
[The story behind the book](/en/articles/2020/12/30/book-an-atypical-asp-net-core-5-design-patterns-guide/)

{% include buy-net5-book.html %}
