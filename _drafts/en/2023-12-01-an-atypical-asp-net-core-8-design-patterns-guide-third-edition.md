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
-   Refactored pararaphs into lists into **tables** to improve clarity.
-   Refactored many section heading to improve navigation to a specific subject.
-   Reviewed the questions and answers of many chapters; lot's of improvements.
-   Reviewed the introduction, section conclusions, and chapter summary of multiple chapters.
-   Lots of code formatting improvements.

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

## Chapter 7

-   Minor changes improving the explanations, descriptions, and the flow.

**Strategy:**

-   Replaced the Strategy console app by a minimal API app.

**AbstractFactory:**

-   Rename HighGrade and LowGrade by HighEnd and LowEnd for more proper English. Also renamed MiddleGrade & MiddleEnd to MidRange.
-   Simplify tests to make them easier to read. Converted the `Theory` to `Fact`.
-   Simplified the projects and solutions structure (kept only one solution).
-   Grouped the classes by familly instread of by "layers". The folders went from (root, models) to (root{abstractions}, HighEnd, LowEnd, MidRange).

**Singleton:**

-   Use the null-coalescing assignment operator `??=` instead of a `if` block.

## Chapter 8

-   Reordered and reworked the Dependency Injection theory section.
-   Rewrote and improved the code sample and most of the Strategy section, including Constructor/Property/Method injection, and Guard clauses.
-   Extracted Guard clauses into its own top-level section
-   Updated the project Application state.
-   Talk quickly about the new .NET 8 `TimeProvider` (wishlist project).
-   Rewrote the factory section and updated the code to reflect the new Strategy code. (the old code could be a good blog post).
-   Rewrote the summary to reflect the new content and added a list of Key takeaways.

## Chapter 9

-   Split the chapter in two.
-   Rewrote most of the options chapter, including code samples. Made them clearer, shorter, more consise, and more "building-block-oriented".
-   Add a code sample about the IOptionsMonitor.OnChange method.
-   Add a code sample about centralizing the configuration and validation into the options class.
-   Add a section about .NET 8 configuration-binding source generator
-   Add a section about .NET 8 options validation source generator
-   Add a section about ValidateOptionsResultBuilder

## Chapter 10

-   No significant changes

## Chapter 11

-   Rewrote the Book Store UI into an API (Composite Pattern)
-   Removed the ultra-large bookstore diagram and simplified it
-   Updated the bookstore data structure to reflect the API focus
-   Renamed the corporation and bookstores, added managers, and improved locations

## Chapter 12

**Template method**

-   Added two test cases in a new test project
-   Corrected a bug in the code
-   Refactor the LinearSearchMachine algo

**Chain of Responsibilities**

-   Improved the text by adding a few more steps to the example.
-   Extracted "Mixing the Template Method and Chain of Responsibility patterns" to its own section.

**Mixing the Template Method and Chain of Responsibility patterns**

-   New section
-   Improved flow and reworked some explanations.

## Chapter 13

-   Minor tweaks
-   Added a few questions

## Chapter 14

-   Minor text tweaks

## Chapter 15

-   Improved the headings
-   Add an example using Mapperly

# Chapter 16

-   Few code tweaks, including the use of record classes instead of regular classes in the Mediator examples.
-   Renamed the pattern CQS from CQRS; even if it was true before, it's more precise now since CQS is a subset of CQRS.
-   Promoted the Code Smell – Marker Interfaces section to Heading 1.
-   Updated MediatR to version 12 (from v9).

# Chapter 17

-   Update dependencies of the project to the latest versions (including a few breaking changes).
-   Refactor the headings, promoting `Anti-pattern – Big Ball of Mud` and `Continuing your journey` as level 1 sections.
-   Updated all diagrams (improved contrasts to some of them, making them more accessible).
-   Removed the custom FluentValidation & MediatR code to make validation work as it now works out of the box. Deleted the `FluentValidationExceptionFilter` (`IExceptionFilter`) class and the `ThrowFluentValidationExceptionBehavior<TRequest, TResponse>` (`IPipelineBehavior<TRequest, TResponse>`) class. Removed the need to register the validators as `ServiceLifetime.Singleton`.

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
