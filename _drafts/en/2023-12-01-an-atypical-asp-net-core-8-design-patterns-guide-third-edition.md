---
title: 'Book: An Atypical ASP.NET Core 8 Design Patterns Guide'
subtitle: "What's new in the third edition?"
date: 2023-12-01 00:00:00 -0500
post-img: '/img/2023-12-Book3-release-960.png'
# og-img: '//cdn.forevolve.com/blog/images/articles-header/2022-05-Book2-release-LinkedIn.png'
# twitter-img: '//cdn.forevolve.com/blog/images/articles-header/2022-05-Book2-release-LinkedIn.png'
lang: en
categories: en/articles
tags:
    - UML
    - Book
proficiency-level: Intermediate
---

...

# What's new and what's changed?

## Sections/general

-   Renamed and reworked the sections
-   Removed Section 5 and all (or most?) UI code and moved the focus of the book purely on REST APIs instead.
-   Consolidated on using the term `REST APIs` instead of `web APIs`, since `web APIs` can be confused with Browsers web APIs (like local storage).
-   Refactored pararaphs into lists into tables to improve clarity.
-   Refactored many section heading to improve navigation to a specific subject.
-   Reviewed the questions and answers of many chapters.
-   Reviewed the introduction, section conclusions, and chapter summary of multiple chapters.

## Chapter 2

-   Major reorg of subjects.
-   Improve the readability of the code samples.
-   Add a section about black-, white-, and grey-box testing.
-   Add a section about _Test case creation_, _Boundary Value Analysis_, _Decision Table Testing_, _State Transition Testing_, and _Use Case Testing_.

## Chapter 3

-   Reorder subjects, starting with separation of concerns, DRY, and KISS instead of SOLID. Moved SOLID after.
-   Rewrite SOLID code samples. They are now simpler and more enterprise focused than game focused.
-   Rewrite the covariant and contravariant explanation and sample using generics.

## Chapter 4-6

-   Chapter 4: extracted REST, HTTP, DTO, and API contracts (part of section 1) + rewrite/improvements
-   Chapter 5: new introduction to the minimal hosting model and minimal APIs (part of section 2), including deep dive into minimal APIs.
-   Chapter 6: Merged the two MVC chapters into one (2nd ed. Chapter 4 and 5) with a focus on REST APIs.
-   The same new, real-world oriented code example is used with both Minimal APIs (Chapter 5) and MVC (Chapter 6), allowing readers to compare the two implementations.

# Chapter 7

-   ...

# New Outline

```
Section 1: Principles and Methodologies
1. Introduction
2. Automated Testing
3. Architectural Principles
4. REST APIs

Section 2: Designing with ASP.NET Core
5. Minimal APIs
6. MVC
7. Strategy, Abstract Factory, and Singleton
8. Dependency Injection
9. Options, Settings, and Configuration
10. Logging

Section 3: Components patterns
11. Structural Patterns
12. Behavioral Patterns
13. Operation Result

Section 4: Applications patterns
14. Layering and Clean Architecture
15. Object Mappers, Aggregate Services, and Façade
16. Mediator and CQRS
17. Vertical Slice Architecture
18. Request-EndPoint-Response (REPR)
19. Introduction to Microservices Architecture
20. Modular Monolith
===
**Notes about the content**
#4: REST, HTTP, API Contracts, and the DTO pattern (were part of the MVC chapters before)
#5: Includes an introduction to the Minimal Hosting model (consolidate the content about this and make it clearer for the readers)
#6: MVC pattern & MVC + DTO (a stripped down version of the MVC chapters, focusing on MVC for REST APIs)
===
**TODO:**
#2: add an info box about minimal hosting and the new Chapter 4 to explain readers that don't know about that, that we will talk about it there.
```
