---
title: 'Implementing Microservices Architectures'
subtitle: 'An Atypical ASP.NET Core 6 Design Patterns Guide'
date: 2022-05-29 00:00:00 -0500
post-img: '//cdn.forevolve.com/blog/images/articles-header/2022-05-Microservices-Orange.png'
og-img: '//cdn.forevolve.com/blog/images/articles-header/2022-05-Microservices-Orange-LinkedIn.png'
twitter-img: '//cdn.forevolve.com/blog/images/articles-header/2022-05-Microservices-Orange-LinkedIn.png'
unsplash-credit: 'Photo by Denys Nevozhai on Unsplash'
lang: en
categories: en/articles
tags:
    - Book
    - .NET
    - .NET 6
    - C#
    - Microservices
    - Design Patterns
proficiency-level: Intermediate
---

This article aims to give you an overview of the concepts surrounding microservices, which should help you make informed decisions about whether you should go for a microservices architecture or not.

The following topics will be covered:

-   What are microservices?
-   An introduction to event-driven architecture

_This article is excerpted from [An Atypical ASP.NET Core 6 Design Patterns Guide {% include AmazonAssociateLogoSpan.html %}](https://adpg.link/buycom6), by Carl-Hugo Marcotte._<!--more-->

## What are microservices?

Besides being a buzzword, microservices represent an application that is divided into multiple smaller applications. Each application, or microservice, interacts with the others to create a scalable system. Usually, microservices are deployed to the cloud as containerized or serverless applications.

Before getting into too many details, here are a few principles to keep in mind when building microservices:

-   Each microservice should be a cohesive unit of business.
-   Each microservice should own its data.
-   Each microservice should be independent of the others.

Furthermore, everything we have studied so far—that is, the other principles of designing software—applies to microservices but on another scale. For example, you don't want tight coupling between microservices (solved by microservices independence), but the coupling is inevitable (as with any code). There are numerous ways to solve this problem, such as the Publish-Subscribe pattern.

There are no hard rules about how to design microservices, how to divide them, how big they should be, and what to put where. That being said, I'll lay down a few foundations to help you get started and orient your journey into microservices.

### Cohesive unit of business

A microservice should have a single business responsibility. Always design the system with the domain in mind, which should help you divide the application into multiple pieces. If you know **Domain-Driven Design** (**DDD**), a microservice will most likely represent a **Bounded Context**, which in turn is what I call a _cohesive unit of business_. Basically, a cohesive unit of business (or bounded context) is a self-contained part of the domain that has limited interactions with other parts of the domain.

Even if a **microservice** has _micro_ in its name, it is more important to group logical operations under it than to aim at a micro-size. Don't get me wrong here; if your unit is tiny, that's even better. However, suppose you split a unit of business into multiple smaller parts instead of keeping it together (breaking cohesion).

In that case, you are likely to introduce useless chattiness within your system (coupling between microservices). This could lead to performance degradation and to a system that is harder to debug, test, maintain, monitor, and deploy.

Moreover, it is easier to split a big microservice into smaller pieces than assemble multiple microservices back together.

Try to apply the Single Responsibility Principle (SRP) to your microservices: a microservice should have only one reason to change unless you have a good reason to do otherwise.

### Ownership of data

Each microservice is the source of truth of its cohesive unit of business. A microservice should share its data through an API (a web API/HTTP, for example) or another mechanism (integration events, for example). It should own that data and not share it with other microservices directly at the database level.

For instance, two different microservices should never access the same relational database table. If a second microservice needs some of the same data, it can create its own cache, duplicate the data, or query the owner of that data but not access the database directly; **never**.

This data-ownership concept is probably the most critical part of the microservices architecture and leads to microservices independence. Failing at this will most likely lead to a tremendous number of problems. For example, if multiple microservices can read or write data in the same database table, each time something changes in that table, all of them must be updated to reflect the changes. If different teams manage the microservices, that means cross-team coordination. If that happens, each microservice is not independent anymore, which opens the floor to our next topic.

### Microservice independence

At this point, we have microservices that are cohesive units of business and own their data. That defines **independence**.

This independence offers the systems the ability to scale while having minimal to no impact on the other microservices. Each microservice can also scale independently, without the need for the whole system to be scaled. Additionally, when the business requirements grow, each part of that domain can evolve independently.

Furthermore, you could update one microservice without impacting the others or even have a microservice go offline without the whole system stopping.

Of course, microservices have to interact with one another, but the way they do should define how well your system runs. A little like Vertical Slice architecture, you are not limited to using one set of architectural patterns; you can independently make specific decisions for each microservice. For example, you could choose a different way for how two microservices communicate with each other versus two others. You could even use different programming languages for each microservice.

<aside>
    <header>Tip</header>
    <section>
        <p>I recommend sticking to one or a few programming languages for smaller businesses and organizations as you most likely have fewer developers, and each has more to do. Based on my experience, you want to ensure business continuity when people leave and make sure you can replace them and not sink the ship due to some obscure technologies used here and there (or too many technologies).</p>
    </section>
</aside>

Now that we've defined the basics, let's jump into the different ways microservices can communicate using event-driven architecture.

## An introduction to event-driven architecture

**Event-driven architecture** (**EDA**) is a paradigm that revolves around consuming streams of events, or data in motion, instead of consuming static states.

What I define by a static state is the data stored in a relational database table or other types of data stores, like a NoSQL documents store. That data is dormant in a central location and waiting for actors to consume and mutate it. It is stale between every mutation and the data (a record, for example) represents a finite state.

On the other hand, data in motion is the opposite: you consume the ordered events and determine the change in state that each event brings.

What is an event? People often interchange the words event, message, and command. Let’s try to clarify this:

-   A message is a piece of data that represents something.
-   A message can be an object, a JSON string, bytes, or anything else your system can interpret.
-   An event is a message that represents something that happened in the past.
-   A command is a message sent to tell one or more recipients to do something.
-   A command is sent (past tense), so we can also consider it an event.

A message usually has a payload (or body), headers (metadata), and a way to identify it (this can be through the body or headers).

We can use events to divide a complex system into smaller pieces or have multiple systems talk to each other without creating tight couplings. Those systems could be subsystems or external applications, such as microservices.

Like **Data Transfer Objects** (**DTO**) of web APIs, events become the data contracts that tie the multiple systems together (coupling). It is essential to think about that carefully when designing events. Of course, we cannot foresee the future, so we can only do so much to get it perfect the first time. There are ways to version events, but this is out of the scope of this article.

EDA is a fantastic way of breaking tight coupling between microservices but requires rewiring your brain to learn this newer paradigm. Tooling is less mature, and expertise is scarcer than more linear ways of thinking (like using point-to-point communication and relational databases), but this is slowly changing and well worth learning (in my opinion).

We can categorize events into the following overlapping buckets:

-   Domain events
-   Integration events
-   Application events
-   Enterprise events

As we’ll explore next, all types of events play a similar role with different intents and scopes.

### Domain events

A domain event is a term based on DDD representing an event in the domain. This event could then trigger other pieces of logic to be executed subsequently. It allows a complex process to be divided into multiple smaller processes. Domain events work well with domain-centric designs, like Clean Architecture, as we can use them to split complex domain objects into multiple smaller pieces. Domain events are usually application events. We can use MediatR to publish domain events inside an application.

To summarize, **domain events integrate pieces of domain logic together while keeping the domain logic segregated**, leading to loosely coupled components that hold one domain responsibility each (single responsibility principle).

### Integration events

Integration events are like domain events but are used to propagate messages to external systems, to integrate multiple systems together while keeping them independent. For example, a microservice could send the `new user registered` event message that other microservices react to, like saving the `user id` to enable additional capabilities or sending a greeting email to that new user.

We use a message broker or message queue to publish such events. We’ll cover those next, after covering application and enterprise events.

To summarize, **integration events integrate multiple systems together while keeping them independent**.

### Application events

An application event is an event that is internal to an application; it is just a matter of scope. If the event is internal to a single process, that event is also a domain event (most likely). If the event crosses microservices boundaries that your team owns (the same application), it is also an integration event. The event itself won't be different; it is the reason why it exists and its scope that describes it as an application event or not.

To summarize, **application events are internal to an application**.

### Enterprise events

An enterprise event describes an event that crosses internal enterprise boundaries. These are tightly coupled with your organizational structure. For example, a microservice sends an event that other teams, part of other divisions or departments, consume.

The governance model around those events should be different from application events that only your team consumes. Someone must think about who can consume that data, under what circumstances, the impact of changing the event schema (data contract), schema ownership, naming conventions, data-structure conventions, and more, or risk building an unstable data highway.

<aside>
    <header>Note</header>
    <section>
        <p markdown="1">I like to see EDA as a central **data highway** in the middle of applications, systems, integrations, and organizational boundaries, where the events (data) flow between systems in a loosely coupled manner.</p>
        <p>It’s like a highway where cars flow between cities (without traffic jams). The cities are not controlling what car goes where but are open to visitors.</p>
    </section>
</aside>

To summarize, **enterprise events are integration events that cross organizational boundaries**.

### Conclusion

We defined events, messages, and commands in this quick overview of event-driven architecture. An event is a snapshot of the past, a message is data, and a command is an event that suggests other systems to take action. Since all messages are from the past, calling them events is accurate. We then organized events into a few overlapping buckets to help identify the intents. We can send events for different objectives, but whether it is about designing independent components or reaching out to different parts of the business, an event remains a payload that respects a certain format (schema). That schema is the data contract (coupling) between the consumers of those events. That data contract is probably the most important piece of it all; break the contract, break the system.

Now, let's see how event-driven architecture can help us follow the **SOLID** principles at cloud-scale:

-   **S**: Systems are independent of each other by raising and responding to events. The events themselves are the glue that ties those systems together. Each piece has a single responsibility.
-   **O**: We can modify the system’s behaviors by adding new consumers to a particular event without impacting the other applications. We can also raise new events to start building a new process without affecting existing applications.
-   **L**: N/A.
-   **I**: Instead of building a single process, EDA allows us to create multiple smaller systems that integrate through data contracts (events) where those contracts become the messaging interfaces of the system.
-   **D**: EDA enables systems to break tight coupling by depending on the events (interfaces/abstractions) instead of communicating directly with one another, inverting the dependency flow.

EDA does not only come with advantages; it also has a few drawbacks:

-   Microservices come at a cost and building a monolith is still a good idea for many projects.
-   It is easier to add new features to a monolith than it can be to add them to a microservice application.
-   Most of the time, mistakes cost less in a monolith than in a microservices application.

You will explore any intricacies of microservices in more detail in [An Atypical ASP.NET Core 6 Design Patterns Guide {% include AmazonAssociateLogoSpan.html %}](https://adpg.link/buycom6), along with analysis of each of the following patterns:

-   Mediating communication between microservices using message queues and the Publish-Subscribe pattern.
-   Shielding and hiding the complexity of the microservices cluster using Gateway patterns.
-   Using one model to read the data and one model to mutate the data with CQRS pattern.
-   Adding missing features, adapting one system to another, or migrating an existing application to an event-driven architecture model, to name a few possibilities, with the Microservices Adapter pattern.

## Summary

The microservices architecture is different to building monoliths. Instead of one big application, we split it into multiple smaller ones that we call microservices. Microservices must be independent of one another; otherwise, we will face the same problems associated with tightly coupled classes, but at the cloud scale.

Microservices are great when you need scaling, want to go serverless, or split responsibilities between multiple teams, but keep the operational costs in mind. Starting with a monolith and migrating it to microservices when scaling is another solution. You can also plan your future migration toward microservices, which leads to the best of both worlds while keeping operational complexity low.

I don't want you to discard the microservices architecture, but I just want to make sure that you weigh up the pros and cons of such a system before blindly jumping in. Your team's skill level and ability to learn new technologies may also impact the cost of jumping into the microservices boat.
