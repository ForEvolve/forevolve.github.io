---
title: 'Book: An Atypical ASP.NET Core 6 Design Patterns Guide'
subtitle: "What's new in the second edition?"
date: 2022-05-28 00:00:00 -0500
post-img: '//cdn.forevolve.com/blog/images/articles-header/2022-05-Book2-release.png'
og-img: '//cdn.forevolve.com/blog/images/articles-header/2022-05-Book2-release-LinkedIn.png'
twitter-img: '//cdn.forevolve.com/blog/images/articles-header/2022-05-Book2-release-LinkedIn.png'
lang: en
categories: en/articles
tags:
    - UML
    - Book
proficiency-level: Intermediate
---

_An Atypical ASP.NET Core 6 Design Patterns Guide — Second Edition_ was released a few months ago and now includes many changes and improvements, including new C# 10 and .NET 6 features.
The second edition is still a journey where we explore architectural techniques together, covering many subjects to learn to think patterns and design.
We are learning not just about patterns but also architectural principles with a strong focus on the SOLID principles, taming the perceived complexity of such tenets throughout the book.

We also cover automated testing and use tests as consumers of our code in multiple code samples.
Automated testing is key to modern development approaches like continuous integration and DevOps.
The strong focus on dependency injection is also still there, making sure readers learn techniques that will help them build ASP.NET Core 6+ applications.

Last but not least, the book still covers numerous design patterns, from multiple of the famous Gang of Four (GoF) patterns to application-level patterns like layering, microservices, and vertical slice architecture.<!--more-->

You can find the content of the first edition in the [Book: An Atypical ASP.NET Core 5 Design Patterns Guide: What's inside?](/en/articles/2021/01/05/book-an-atypical-asp-net-core-5-design-patterns-guide-content/) article.

## What's new and what's changed?

In the second edition, based on readers' feedback, I addressed the pain points that readers had with the first edition.
I also made many small changes to create a more polished product.
Of course, I added many new C# 10 and .NET 6 features and revamped many code samples.
Next is a list containing some of those changes.

### Polishing

-   I revamped the titles and sub-titles to make a better Table of Contents, so it's easier to follow and find specific sections.
-   I applied many small changes to the wording, updated the order of some content, added and updated diagrams, and more to make your reading journey better!

### Code Style

I updated the code samples to align with the direction .NET is taking, making it easier for you to understand the _minimal hosting model_.
The code style updates are a significant investment I made in the second edition; I hope you like it!

Now, most code samples use _top-level statements_ and the _minimal hosting model_.
They also respect the _nullable reference types_ features introduced in C# 8.0 and enabled by default in .NET 6 project templates, allowing you to learn them at the same time.

### Content

-   All inlined C# features are now part of _Appendix A_, making the book focus on one subject while keeping the C# features in there as a reference.
-   _Appendix A_ is also a great way to learn about C# features in a single place, and it becomes a better reference; no more need to browse the whole book to find the C# feature you were looking for.
-   I added multiple .NET 6 and C# 10 features to _Appendix A_ and leveraged them throughout the book, like _File-scoped namespaces_, _Global using directives_, _Implicit using directives_, and the _Minimal hosting model_.
-   Major update of _Chapter 2: Automated Testing_
-   I improved the explanations of _Chapter 3: Architectural Principles_, especially the Liskov substitution principle (LSP), removed and revamped code samples, and added the _Keep it simple, stupid (KISS)_ principle.
-   Streamlined the content of _Chapter 4: The MVC Pattern Using Razor_ and _Chapter 5: The MVC Pattern for Web APIs_ to make the read faster and more.
-   Based on readers' surveys that pointed to Layering as an aspect you are most interested in, I invested a lot of effort in improving _Chapter 12: Understanding Layering_. I removed some content, reordered sections, improved the writting, and more.
-   The code sample used to demo Layering, Clean Architecture, and that is reused in _Chapter 14: Mediator and CQRS Design Patterns_ were updated to use a rich model, amongst other changes.
-   Microservices Architecture was also a major interest of surveyed people, so I invested a lot of effort in improving _Chapter 16_: Introduction to Microservices Architecture\_, like reordering the subjects, updating and adding content, and adding more details about event-driven architecture.
-   I also added the _Exploring the Microservice Adapter pattern_ section to _Chapter 16: Introduction to Microservices Architecture_, which is a very versatile pattern.

## Conclusion

The list of changes we just covered represents the major highlights of this second edition.
I made so many little improvements that it is impossible to list them all here.

If you did not read the first edition, I'm sure you'll love the second one.
If you read the first edition, I'm sure you'll get something out of the second one too.

Nevertheless, please share any feedback you may have with me so I can continuously improve your reading experience.

You can find the content of the first edition in the [Book: An Atypical ASP.NET Core 5 Design Patterns Guide: What's inside?](/en/articles/2021/01/05/book-an-atypical-asp-net-core-5-design-patterns-guide-content/) article.
