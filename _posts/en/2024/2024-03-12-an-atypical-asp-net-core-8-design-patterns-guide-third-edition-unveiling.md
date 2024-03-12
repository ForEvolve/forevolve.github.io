---
title: 'Architecting ASP.NET Core Applications'
subtitle: 'Unveiling the Third Edition'
date: 2024-03-12 00:00:00 -0500
post-img: '//cdn.forevolve.com/blog/images/articles-header/2024-02-Book3-release.png'
og-img: '//cdn.forevolve.com/blog/images/articles-header/2024-02-Book3-release-LinkedIn.png'
twitter-img: '//cdn.forevolve.com/blog/images/articles-header/2024-02-Book3-release-LinkedIn.png'
lang: en
categories: en/articles
tags:
    - Book
    - .NET 8
    - C#
    - ASP.NET Core
proficiency-level: Intermediate
ai-assisted: true
---

After hundreds of hours of work, a new team, and two new tech reviewers, I'm delighted to announce the release of the third edition of **Architecting ASP.NET Core Applications**, a unique guide for constructing resilient ASP.NET Core web applications.

But that was not the title of the first two editions?!? That's correct. After thoughtful consideration, the book has a new title!
Why? All editions were never only about design patterns, which is even more true for the 3rd edition, which expands even more than before into architectural styles and application organization, offering diverse strategies for structuring ASP.NET Core applications.
Of course, I wanted to keep the essence of the first two editions, so here's the subtitle that brings that continuity: **An Atypical Design Patterns Guide for .NET 8, C# 12, and Beyond**.

Have you noticed the _and Beyond_ suffix? Well, that's because the book is good not only for .NET 8 and C# 12, but you'll also be able to leverage its content for future versions, and we wanted to clarify this.

Let's start with the updated Table of Content:<!--more-->

```text
Section 1: Principles and Methodologies
1. Introduction
2. Automated Testing
3. Architectural Principles
4. REST APIs

Section 2: Designing with ASP.NET Core
5. Minimal API
6. Model-View-Controller
7. Strategy, Abstract Factory, and Singleton Design Patterns
8. Dependency Injection
9. Application Configuration and the Options Pattern
10. Logging patterns

Section 3: Components Patterns
11. Structural Patterns
12. Behavioral Patterns
13. Operation Result Pattern

Section 4: Application Patterns
14. Layering and Clean Architecture
15. Object Mappers
16. Mediator and CQS Patterns
17. Vertical Slice Architecture
18. Request-EndPoint-Response (REPR)
19. Introduction to Microservices Architecture
20. Modular Monolith
```

Have you noticed? We removed the UI chapters and replaced them with more REST APIs and backend content!
Yes! This third edition is a testament to our commitment to relevancy and depth, which is now exclusively focused on developers striving for robust REST API and backend design knowledge.

<aside>
    <header>Definition of some terms and acronyms</header>
    <p markdown="1">
        If there are terms, acronyms, or concepts you are unsure about, I left a list at the end of the article under [Definition of some terms and acronyms](#definition-of-some-terms-and-acronyms).
    </p>
</aside>

## Backend Design Like You've Never Seen Before

**Architecting ASP.NET Core Applications** is your gateway to mastering REST API and backend designs. It gives you the know-how for building robust and maintainable apps grounded in Gang of Four (GoF) design patterns and well-known architectural principles like SOLID, DRY, and YAGNI. The book focuses on the technical architecture mindset. It is written as a journey where we improve code over time, rework and refactor examples, and more to ensure you understand the logic behind the techniques we are covering. At the end of the book, I want you to understand the choices that we made so you can apply a similar way of thinking to your real-world problems, which are not covered in any books because each challenge is unique in the real world!

This book is a deep dive into the architectural essence of building enduring ASP.NET Core applications. The third edition is here to quench your thirst for knowledge with an expanded section on Minimal APIs, more automated testing content, more architectural building blocks, more ways to organize your applications, and a closing chapter about building a modular monolith. We explore many application-building techniques, from layering to microservices.

<aside>
    <header>What is a Modular Monolith?</header>
    <p markdown="1">
        **Modular Monolith**: A modular monolith organizes code into modules within a single application, combining the simplicity of a monolith with modular flexibility, easing maintenance and deployment.
    </p>
    <figure>
        <img src="//cdn.forevolve.com/blog/images/2024/2024-02-Book3-release-modular-monolith-diagram.png" />
        <figcaption>
            Figure 20.2: A Modular Monolith, an aggregator, and three modules, each owning its own database schema
        </figcaption>
    </figure>
    <p>
        You can also read the following articles to learn more about <a href="https://www.forevolve.com/en/articles/2017/06/29/microservices-aggregation/">Microservices Aggregation</a> (Modular Monolith).
    </p>
</aside>

## What's new in the third edition?

The sections are reimagined for a smoother learning journey, and the content has been revised to improve the clarity of each chapter. Chapters now prioritize REST API design and patterns, shedding extraneous UI code to concentrate on what truly matters in backend development.

Chapter 2 has been overhauled to cover testing approaches like black-box, white-box, and grey-box testing. The foundational architectural principles are rearranged, and the chapter is improved to establish the groundwork for modern application design even better than before. Two new chapters now focus on REST APIs and Minimal APIs, while a third chapter about building Web APIs using MVC was updated.

I improved and increased the number of real-world-like examples where numerous code projects have been updated or rewritten completely. The Dependency Injection chapter benefited from significant updates as well. I split the _options and logging_ chapter in two, and improved the content.

Many other changes were applied, like improving the heading of chapters for easier navigation, and all chapters benefitted from content tweaks, diagram updates, code sample revamps, and more. On top of that, I added new content around open-source tools like Mapperly, MassTransit, and Refit.

Additionally, Chapter 18 is a new chapter dedicated to the Request-EndPoint-Response (REPR) pattern using Minimal APIs. I also listened to your feedback and added some code to the Microservices chapter. The new microservices project extends the REPR code sample to microservices architecture and introduces API layering with a Backend For Frontend (BFF) example. Finally, Chapter 20 is also new, discusses modular monolith architecture, and builds on top of Chapters 18 and 19's new e-commerce examples. That last project, rebuilt in three flavors, is a larger implementation that combines more building blocks like a real app would while keeping it small enough to fit in a book.

<aside>
    <header>What is Microservices Architecture?</header>
    <p markdown="1">
        **Microservices Architecture** breaks down a large application into smaller, independent pieces, each performing a specific function. These microservices communicate with each other to form a scalable system, often deployed in the cloud as containerized or serverless applications, enhancing flexibility and scalability.
    </p>
    <figure>
        <img src="//cdn.forevolve.com/blog/images/2024/2024-02-Book3-release-microservices-diagram.png" />
        <figcaption>
            Figure 19.25: A diagram that represents the deployment topology and relationship between the different services
        </figcaption>
    </figure>
    <p>
        You can also read the following articles to learn more about <a href="https://www.forevolve.com/en/articles/2022/05/29/microservices-architecture-exerpt/">Implementing Microservices Architectures</a>.
    </p>
</aside>

## Your ASP.NET Core Development Companion

Once again, this release is crafted for intermediate ASP.NET Core developers eager to refine their knowledge of design patterns and application development. Software architects keen on revitalizing their theoretical and hands-on expertise will also find this third edition an invaluable ally. With comprehensive coverage of updated architectural patterns, RESTful design, SOLID principles, and a touch of microservices, this edition stands as a pillar of modern backend application design.

For the best experience, I recommend you read the book cover to cover first to ensure you understand the decisions behind the refactoring and improvements we make throughout. Of course, afterward, you can use it as a reference and browse it however you please.

## Embrace The Journey of Backend Mastery

Join me on an exceptional learning path that will revolutionize your ASP.NET Core application architecture perspective. The third edition awaits you, promising a transformative encounter with REST API and backend design unlike anything you’ve experienced before.

## Definition of some terms and acronyms

Here is a reference to certain terms and acronyms from the article.
Hopefully, these definitions will help you out.

**REST API**: REST (Representational State Transfer) API is a design style that uses HTTP requests to access and use data, allowing applications to communicate and exchange data in a standardized format, enhancing interoperability and simplicity in web services.

**RESTful**: RESTful refers to web services that adhere to REST principles, enabling seamless and efficient interaction between clients and servers through standardized HTTP operations.

**Gang of Four (GoF) design patterns**: These foundational patterns, identified by four authors, offer solutions to common design challenges, improving code reusability and maintainability.

**GoF Design Patterns (Strategy, Abstract Factory, Singleton)**: Strategy enables selecting algorithms at runtime; Abstract Factory offers an interface for creating families of related objects; Singleton ensures a class has only one instance and provides a global point of access to it.

**SOLID, DRY, and YAGNI principles**: SOLID represents five principles of object-oriented design that increase software maintainability; DRY ("Don't Repeat Yourself") emphasizes avoiding code duplication; YAGNI ("You Aren't Gonna Need It") advises against adding unnecessary functionality.

**Minimal API**: ASP.NET Core Minimal APIs enable fast and efficient REST endpoint creation with minimal code, dependencies, and configuration, focusing on simplicity and performance while streamlining route and action declaration without needing traditional scaffolding or controllers.

**Model-View-Controller (MVC)**: MVC is a design pattern that separates an application into three main components—Model, View, and Controller—to isolate business logic, user interface, and user input.

**Dependency Injection**: This technique allows the creation of dependent objects outside of a class and provides those objects to the class, improving modularity and testability and breaking tight coupling.

**REPR (Request-EndPoint-Response) Pattern**: This pattern promotes the simple routing and handling of HTTP requests by directly associating requests with their handling functions and responses, promoting clean and readable code.

**Microservices Architecture**: This architecture style structures an application as a collection of small, autonomous services, improving modularity and scalability.

**Modular Monolith**: A modular monolith organizes code into modules within a single application, combining the simplicity of a monolith with modular flexibility, easing maintenance and deployment.
