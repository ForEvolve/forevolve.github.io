---
title: 'Book: An Atypical ASP.NET Core 6 Design Patterns Guide'
subtitle: 'What's new in the second edition?'
date: 2022-05-28 00:00:00 -0500
post-img: 'img/2021-01-00-Book-UML.png' # //cdn.forevolve.com/blog/images/articles-header
lang: en
categories: en/articles
tags:
    - UML
    - Book
proficiency-level: Intermediate
---

_An Atypical ASP.NET Core 6 Design Patterns Guide_ second edition was release a few months ago now and includes many changes and improvements, including new C# 10 and .NET 6 features.
The second edition is still a journey where we explore architectural techniques together where we cover many subjects to learn to think pattern and design.
We are not just learning about patterns, but also about architectural principle with a strong focus on the SOLID principles, taming the perceived complexity of such principles thouhout the book.
We are also covering automated testing and use tests as consumer of our code in multiple code samples.
Automated testing is one key to modern development approaches like continuous integration and DevOps.
The strong focus on dependency injection is also still there, making sure readers learn techniques that will help them building ASP.NET Core 6+ applications.
Last but not least, the book still covers numerous design patterns from multiple of the famous Gand of Four (GoF) patterns, to application-level patterns like layering, microservices, and vertical slice architecture.<!--more-->

## What's new and what's changed?

In the second edition, based on readers feedback, I addressed the pain points that readers had with the first edition.
I also made a lots of small changes to create a more polished product.
Of course, I added a lot of new C# 10 and .NET 6 features and revamped many code samples.
Next is a list containing some of those changes.

### Polishing

-   Revamp of the titles and sub-titles to make a better Table of Contents so it's easy to follow for reader and to find a specific sections.
-   Applied many small changes to the wording, updated the order of the some content, added and updated diagrams, and more to make your reading journey better!

### Code Style

I updated the code sample style to make it easier for readers to understand the newer models and the direction the .NET team seems to be taking.
For example, we can already see that more efforts are put into the _minimal hosting model_ which should bring us more features in .NET 7.

This was a major investment that was made in the second edition to update most code sample to use _top-level statements_ and the new .NET 6 _minimal hosting model_ as well as to respect the _nullable reference types_ features introduced in C# 8.0 and enabled by default in .NET 6 project templates.
I hope you like it!

### Content

-   All the C# features that were inlined throughout the book were moved to _Appendix A_, making the book focus on one subject while keeping the C# features in there as a reference.
-   I added multiple .NET 6 and C# 10 features to _Appendix A_ and leverage them throughtout the book, like _File-scoped namespaces_, _Global using directives_, _Implicit using directives_, and the _Minimal hosting model_ to name some.
-   Major update of _Chapter 2: Automated Testing_
-   I made many changes to _Chapter 3: Architectural Principles_ to make the explaination better, especially the Liskov substitution principle (LSP), removed and revamped code samples, and added the Keep it simple, stupid (KISS) principle.
-   Streamlined the content of _Chapter 4: The MVC Pattern Using Razor_ and _Chapter 5: The MVC Pattern for Web APIs_ to make the read faster and more.
-   Based on readers surveys that pointed to Layering as an aspect you are most interested in, I invested a lot of efforts in improving _Chapter 12: Understanding Layering_. I removed some content, reordered sections, improved the writting, and more.
-   The code sample that is used to demo layering, clean architecture, and that is reused in _Chapter 14: Mediator and CQRS Design Patterns_ was updated to use a rich model, amongst other changes.
-   Microservices Architecture was also an major interest of surveyed people, so I invested a lot of effort improving _Chapter 16: Introduction to Microservices Architecture_, like reordering the subjects, updating and adding content, and adding more details about event-driven architecture.
-   I also added the _Exploring the Microservice Adapter pattern_ section to _Chapter 16: Introduction to Microservices Architecture_, which is a very versatile pattern.

## Conclusion

The list of changes we just covered are the major highlights of this second edition.
If you did not read the first edition, I'm sure you'll love the second one.
If you did read the first edition, I'm sure you'll get something out of the second one too.

Please share any feedback you may have with me so I can continuously improve the content and your reading experience.

You can find the content of the first edition in the [Book: An Atypical ASP.NET Core 5 Design Patterns Guide: What's inside?](/en/articles/2021/01/05/book-an-atypical-asp-net-core-5-design-patterns-guide-content/) article.
