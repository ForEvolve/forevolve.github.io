---
title: 'Introduction to C# variables'
subtitle: 'A beginner guide to programming with .NET 5 and C#'
date: 2021-02-21 00:00:00 -0500
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

This article is the second of a **learn programming** series where you need **no prior knowledge of programming**.
If you want to **learn how to program** and want to learn it **using .NET/C#**, this is the right place.
I suggest to read the whole series in order, but that's not mandatory.

In this article we explore variables.
What they are, how to create them, and how to use them.
Variables are one of the most important elements of a program, making it dynamic.<!--more-->

## Definition of a variable

Before beginning, it is important to know what we are aiming at.

**A variable is an identifier that we can use programmatically, to access a value stored in memory.**

Let's break that down, an **identifier** is a name, a way to identify your variable. We then can use that identifier to read or write data into memory. The memory that I'm referring to is the RAM of the computer executing the code. But you don't even have to worry about that because .NET manages that for you. All you need to know is how to declare a variable and how to use them.

There are many different types of variables that we are going to cover in other courses, but the concept always remains the same.

## Creating a variable using the `var` keyword

C# offers many ways of creating variables. The easiest one is using the `var` keyword. The syntax is as follow:

```csharp
var identifier = initial_value;
```

### The `var` keyword

`var` is a keyword to create a variable. C# is a strongly-typed language and so requires each variable to be of a certain type. We explore types more in-depth in another lesson, but for now, a type is just a type of data, like a string (text) or an integer.

### Identifier

The `identifier` represents the name of the variable and must be as specific as possible. A variable's name must describe what that variable is holding, so anyone reading your code knows without the need to investigate.

An identifier must start with either a letter or an `_`. It can then be composed of different Unicode characters, but I'd suggest keeping it simple and universal by only using letters and numbers.

I will explain casing styles and code convention in another course. For now, all that you want to achieve is write working code.

### Assignment operator

Now that we named our variable, it is time to assign it a value. The `=` character represents the assignment operator.

The assignment operator assigns the value of the right-hand operand to the left side. For example, to assign the string value `"How are you?"` to a variable named `howAreYou` we could write the following code:

```csharp
var howAreYou = "How are you?";
```

The `=` takes the right-hand value (`"How are you?"`) and assigns it to the variable named `howAreYou`. We can now use and work with that variable, like output it to the console.

### Initial value

The initial value could be pretty much anything: a string, an integer, or an instance of an object.

Enough theory, let's try this out.

### Adding a variable to our program

So let's get back to the program that we built in the previous lesson. If we want the text to be extracted in a variable, we could write the following:

```csharp
using System;

var hello = "Hello .NET Ninja!";
Console.WriteLine(hello);
```

> **Hint:** One crucial detail in the preceding code is that we don't write `"` when passing the variable as an argument to the `WriteLine` method. We write it directly, like this: `Console.WriteLine(hello);`.
>
> In C#, the `"` character is the **string delimiter** character. We do not want to pass the string `"hello"` to the method, but the value of the `hello` variable.

After executing the code above, we can see that we get the same result as before but using a variable instead of inputting text directly into the `Console.WriteLine` method.

That may seem useless for now, but keep in mind that a variable can be changed, set by the user, computed, and more.

Before getting further, let's try to code something.

Create a program that recreates the following output:

```text
------------------
What is your name?
------------------
```

## TODO

Continue/revise/finish article

## Conclusion

...

In the next article of the series, we will explore how to write comments.

### Table of content

{%- include learn-coding-with-dot-net-core/toc.md currentIndex=2 -%}

{%- include learn-coding-with-dot-net-core/next.md nextIndex=3 -%}
