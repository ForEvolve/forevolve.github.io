---
title: 'How to read user inputs from a console'
subtitle: 'A beginner guide to programming with .NET 5 and C#'
date: 2021-04-01 00:00:00 -0500
post-img: '//cdn.forevolve.com/blog/images/articles-header/2021-learn-coding-with-dot-net-core.png'
unsplash-credit: Photo by Jefferson Santos on Unsplash
lang: en
categories: en/articles
tags:
    - .NET 5
    - .NET Core
    - C#
    - Learn Programming
proficiency-level: Novice
technology-relative-level:
    - { name: .NET, level: Beginners }
    - { name: C#, level: Beginners }
    - {
          name: Computers,
          level: Familiar,
          short-description: You are familiar with computers,
          description: 'You know your way around a computer and is able to install a software, configure your OS, open a terminal, and perform other similar simple tasks.',
      }
---

This article is part of the **learn programming** series where you need **no prior knowledge of programming**.
If you want to **learn how to program** and want to learn it **using .NET/C#**, this is the right place.
I suggest to read the whole series in order, but that's not mandatory.

In this article we explore how to read user inputs from the console.
This short article is the fondation of more dynamic notions enabling our programs to change and react based on simple user interactions.<!--more-->

## User input

So far, we used the `Console.WriteLine` method to write to the console and we created a variable to hold some text. But what about writing a message entered by the user?

...

```csharp
using System;

Console.Write("Please enter a greeting message then press ENTER: ");
var hello = Console.ReadLine();
Console.WriteLine(hello);
```

## TODO

Continue/revise/finish article

## Conclusion

...

{%- include learn-coding-with-dot-net-core/next.md nextIndex=6 -%}

### Table of content

{%- include learn-coding-with-dot-net-core/toc.md currentIndex=5 -%}
