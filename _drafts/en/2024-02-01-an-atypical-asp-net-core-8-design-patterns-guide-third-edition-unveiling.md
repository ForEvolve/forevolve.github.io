---
title: 'Architecting ASP.NET Core Applications: Unveiling the Third Edition'
subtitle: "What's new in the third edition?"
date: 2024-02-02 00:00:00 -0500
post-img: '/img/2024-02-Book3-release'
# og-img: '//cdn.forevolve.com/blog/images/articles-header/2022-05-Book2-release-LinkedIn.png'
# twitter-img: '//cdn.forevolve.com/blog/images/articles-header/2022-05-Book2-release-LinkedIn.png'
lang: en
categories: en/articles
tags:
    - Book
    - .NET 8
    - C#
    - ASP.NET Core
proficiency-level: Intermediate
---

After hundreds of hours of work, a new team and two new tech reviewers, I'm delighted to announce the release of the third edition of **Architecting ASP.NET Core Applications**, a unique guide for constructing resilient, SOLID ASP.NET Core web applications. With the tech landscape constantly shifting, this edition is a testament to our commitment to relevancy and depth, catering to developers yearning for a robust backend design experience.

But that was not the title of the first two editions? That's right, after thoughful consideration, the book arbor a new title this time: **Architecting ASP.NET Core Applications**!
Of course, we did not want to loose the essence of the first two editions, so here's the subtitle that brings the continuity: **An Atypical Design Patterns Guide for .NET 8, C# 12, and Beyond**.
If you have noticed the _and Beyond_ suffix, well, that's because the book is not only good for .NET 8 and C# 12, you'll be able to leverage its content for future versions as well, and we wanted to make this clear.

Let's start with the updated Table of Content:<!--more-->

```
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

Section 4: Applications Patterns
14. Layering and Clean Architecture
15. Object Mappers, Aggregate Services, and Façade
16. Mediator and CQS Patterns
17. Vertical Slice Architecture
18. Request-EndPoint-Response (REPR)
19. Introduction to Microservices Architecture
20. Modular Monolith
```

Have you noticed? We got rid of the UI chapters and replaced them with more REST APIs, and more backend content!

## Backend Design Like You've Never Seen Before

"Architecting ASP.NET Core Applications" is your gateway to mastering REST API and backend designs. It arms you with the know-how for building robust and maintainable apps grounded in Gang of Four (GoF) design patterns and well-known architectural principles like SOLID, DRY, and YAGNI. The book focuses on the technical architecture mindset and is written as a journey where we improve code overtime, rework and refactor examples, and more to ensure you understand the logic behind the techniques we are covering. At the end of the book, I want you to understand the choices that we made so you can apply a similar way of thinking to you real-world problems, which are not covered in any books, because each challenge is unique in the real-world!

This book is a deep dive into the architectural essence of building enduring ASP.NET Core applications. The third edition is updated for .NET 8, focusing on backend development. It is here to quench your thirst for knowledge with an expanded section on Minimal APIs, more automated testing content, more architectural building blocks, more ways to organize your applications, and a closing chapter about building a modular monolith. We explore a number of application building techniques, from layering to microservices.

## What's Changed? Let's Explore.

The sections are reimagined for a smoother learning journey, and the content has been revised to improve the clarity of each chapter. Chapters now prioritize REST API design and patterns, shedding extraneous UI code to concentrate on what truly matters in backend development.

Chapter 2 has been overhauled to cover testing approaches like black-box, white-box, and grey-box testing. The foundational principles in Chapter 3 are rearranged and improved to better establish groundwork for modern application design. Chapters 4 to 6 witness evolutionary changes with novel content on REST APIs and Minimal APIs.

I improved and increased the number of real-world-like examples, where numerous code projects have been updated or rewritten completely. The Dependency Injection benefited from major updates, as well as the options and logging chapter that I split in two. These now offer insight into the latest .NET 8 features and practices.

Lots of chapters got their heading improved for easier navigation. All chapters benefitted from content tweaks, images updates, code sample revamp, and more. On top of that, I added more tools to use like Mapperly, an MassTransit.

## Revel in Fresh Content

I proudly introduce Chapter 18, dedicated to the Request-EndPoint-Response (REPR) pattern using Minimal APIs. Chapter 19, Microservices, extends the code sample to the realms of microservices and API layering with a Backend For Frontend (BFF) example, while Chapter 20 discusses Modular Monolith architecture, and also build on top of chapter 18 and 19 new e-commerce example. That last project, rebuilt in three flavors, is a larger implementation that brings more building blocks together, like a real app would.

## Your ASP.NET Core Development Companion

Once again, this release is crafted for intermediate ASP.NET Core developers who are eager to refine their knowledge of design pattern and application development. Software architects keen on revitalizing their theoritical and hands-on expertise will find this edition an invaluable ally. With comprehensive coverage of updated architectural patterns, RESTful design, SOLID principles, and a touch on microservices and CQRS, it stands as a pillar of modern backend application design.

For the best experience, I recommend reading the book cover to cover first, to ensure you understand the decisions behind the refactoring and improvements we do throughout. Of course, afterward, you can use it as a reference and browse it however you please.

## Embrace The Journey of Backend Mastery

Join us on an exceptional learning path that will revolutionize your perspective on ASP.NET Core application architecture. The third edition awaits you, promising a transformative encounter with REST API and backend design, unlike anything you’ve experienced before.
