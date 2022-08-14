---
title: 'Mediator pattern and Vertical Slice architecture: How to break tight coupling and write cohesive ASP.NET Core 6 code'
subtitle: 'An Atypical ASP.NET Core 6 Design Patterns Guide'
date: 2022-08-14 00:00:00 -0500
post-img: 'img/2022-08-Vertical-Slice-Header.png' # //cdn.forevolve.com/blog/images/articles-header/
og-img: 'img/2022-08-Vertical-Slice-Social.png'
twitter-img: 'img/2022-08-Vertical-Slice-Social.png'
unsplash-credit: 'Photo by Erik Eastman on Unsplash'
lang: en
categories: en/articles
tags:
    - Book
    - .NET
    - .NET 6
    - C#
    - Vertical Slice Architecture
    - Design Patterns
proficiency-level: Intermediate
---

This article gives an overview of vertical slice architecture and explore the **Mediator** design pattern, which plays the role of the middleman between the components of our application.

_This article is an excerpt from my book, [An Atypical ASP.NET Core 6 Design Patterns Guide {% include AmazonAssociateLogoSpan.html %}](https://adpg.link/buycom6)._<!--more-->

## A high-level overview of vertical slice architecture

Before starting, let's look at the end goal by exploring Vertical Slice architecture. This way, it should be easier to follow the progress toward that goal.

A layer groups classes together based on shared responsibilities. So, classes containing data access code are part of the data access layer (or infrastructure). In diagrams, layers are usually represented using horizontal slices, like this:

{%- include figure-img.html src="/img/adpg6-figure-14.1-dark.png" caption="Figure 14.1: Diagram representing layers as horizontal slices" -%}

The "vertical slice" in “vertical slice architecture” comes from that; a vertical slice represents the part of each layer that creates a specific feature. So, instead of dividing the application into layers, we divide it by feature. A feature manages its data access code, its domain logic, and possibly even its presentation code. We are decoupling the features from one another by doing this but keeping each feature's components close together. When we add, update, or remove a feature using layering, we change one or more layers. Unfortunately, "one or more layers" too often translates to "all layers."

On the other hand, with vertical slices, keeping features in isolation allows us to design them independently instead. From a layering perspective, it's like flipping your way of thinking about software to a 90° angle:

{%- include figure-img.html src="/img/adpg6-figure-14.2-dark.png" caption="Figure 14.2: Diagram representing a vertical slice crossing all layers" -%}

Vertical slice architecture does not dictate the use of **CQRS**, the **Mediator** pattern, or **MediatR**, but these tools and patterns flow very well together. Nonetheless, these are just tools and patterns that you can use or change in your implementation using different techniques; it does not matter and does not change the concept.

The goal is to encapsulate features together; after going through the contents of this article, we can use CQRS to divide the application into requests (commands and queries), and use MediatR as the mediator of that CQRS pipeline, decoupling the pieces from one another.

## Implementing the Mediator pattern

The Mediator pattern is another Gang of Four design pattern that controls how objects interact with one another (making it a behavioral pattern).

...
