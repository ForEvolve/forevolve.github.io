---
title: 'Introduction to C# constants'
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

In this article, we explore constants.
A constant is a special kind of variable.
The kind that does not vary; they are **immutable**.

> **Immutable** means that it cannot change.

This article is the third of a **learn programming** series where you need **no prior knowledge of programming**.
If you want to **learn how to program** and want to learn it **using .NET/C#**, this is the right place.
I suggest reading the whole series in order, but that's not mandatory.<!--more-->

## Definition of a constant

Beside knowing that the value of a constant cannot change, its value is replaced at compile-time.
Variables, are evaluated at runtime, so the value they hold at the time of the execution is used.

To define a constant, we use the `const` modifier in front of its type, followed by an identifier, an assignment operator, then its value; like this:

```csharp
const string greetings = "Hello .NET Ninja!";
const int age = 102;
```

> **Note:** we can't use the `var` keyword for constants.

Let's look at two use-cases, one using a variable and one using a constant.

### Variable flow

In the following code, the value of the `greetings` variable is passed to the `WriteLine` method and written to the console at runtime.

```csharp
var greetings = "Hello .NET Ninja!";
Console.WriteLine(greetings);
```

So if we change the value of the variable along the way, the output will be different; like this:

```csharp
var greetings = "Hello .NET Ninja!";
Console.WriteLine(greetings);
greetings = "This is new!"
Console.WriteLine(greetings);
```

When executing the preceding code, the program will write two lines to the console, `Hello .NET Ninja!` and `This is new!`.
That's because the evaluation of the value is done at runtime.

### Constant flow

In the case of a constant, its value is replaced at compile-time.
Let's take the following code as an example:

```csharp
const string greetings = "Hello .NET Ninja!";
Console.WriteLine(greetings);
```

During the compilation phase, the compiler replaces the identifier of the constant by its value.
In our case, we end up with the following code:

```csharp
Console.WriteLine("Hello .NET Ninja!");
```

When executing the program, the result is the same than if we wrote the preceding code ourself.
The compiler does the same process for all constants.

## What to do with constants?

As a neophyte, this may sound useless, but as your level of knowledge grows, it becomes more relevant.
Here are a few examples of usage:

-   You do not want hard-coded values spread throughout your program because it becomes more difficult to maintain such programs when you need to change one of those values.
    To fix that issue, you can use constants to centralize all of those values in one place (making the program easier to maintain) without impact on runtime performance (because the constants are replaced at compile-time).
-   You want to reuse a specific value at multiple places, as a way to identify something, for example.
    To fix that issue, you can use a constant, which removes the duplication of that value by depending only on the constant.
    If we need to change the value, we can update the constant, recompile, and voilà, all references to that constant now use the new updated value.

> **More info:** There is a downside to the preceding use-case, which can happen in a more advanced scenario.
> When creating a project<sup>(1)</sup> that depends on a constant from another project<sup>(2)</sup> or library, if the author of project<sup>(2)</sup> changes the value of that constant, project<sup>(1)</sup> (the consumer) needs to be recompiled for the change to be applied.
> This could, in rare occasions, have unintended consequences, where different values are used, leading to inconsistent states.
> Please feel free to reread this later since it is a more advanced scenario; maybe some or all of this makes no sense to you yet, which is normal.
> I decided to leave the note anyway, because it felt like the right place to put it.

## Exercise

TODO

## Conclusion

In this article, we learned ...

{%- include learn-coding-with-dot-net-core/next.md nextIndex=4 -%}

### Table of content

{%- include learn-coding-with-dot-net-core/toc.md currentIndex=3 -%}
