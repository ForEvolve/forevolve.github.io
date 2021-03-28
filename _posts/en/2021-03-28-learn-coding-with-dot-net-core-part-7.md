---
title: 'Introduction to string interpolation'
subtitle: 'A beginner guide to programming with .NET 5 and C#'
date: 2021-03-28 00:00:00 -0500
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

In this article, we continue to explore string manipulations by focusing on interpolation.
Instead of concatenating many pieces together, interpolation allows us to insert special tokens inside a string.
A value then replaces those tokens.
Interpolation and concatenation play the same role, but often one ends up being more elegant than the other and makes the code easier to maintain.

{% include learn-coding-with-dot-net-core/intro-series.md %}

{% include learn-coding-with-dot-net-core/sub-series.md firstPart=6 %}<!--more-->

## Interpolation

The definition of _interpolation_, from Oxford Languages ([Google search](https://www.google.com/search?q=interpolation&oq=interpolation)), is:

> The insertion of something of a different nature into something else.

In C#, we must prefix the string with the `$` character if we want to use interpolation.
Then, we can insert the value of an expression in that string by wrapping it with `{` and `}`, like this:

```csharp
var name = "Joe";
var result = $"Hello {name}!";
Console.WriteLine(result);
```

Executing the preceding code should write `Hello Joe!` in the terminal.
I find `$"Hello {name}!"` to be more elegant than `"Hello " + name + "!"` and way easier to read, especially for a neophyte.

Next, we explore how to use interpolation in a multiline string.

### Multiline string interpolation

If you wondered why I talked about multiline strings in the previous article, I planned this section.
We can use both `$` and `@` to mix interpolation and multiline string, like this:

```csharp
var name = "Joe";
var result = $@"Hello {name}!
What's up?";
Console.WriteLine(result);
```

In the preceding code, we used interpolation in a multiline string by chaining both `$` and `@` (in this order).
As easy as that!

> **Note:** the order is important; `@$"..."` will not compile.

Next, it is your turn to try it out!

## Exercise

To practice interpolation, we will replace concatenation with interpolation in the code from the previous article's exercise.

Here is the previous solution as a reference:

```csharp
using System;

Console.Title = "IntroToDotNet";

Console.Write("What is your first name? ");
var firstName = Console.ReadLine();
Console.Clear();

Console.Write("What is your last name? ");
var lastName = Console.ReadLine();
Console.Clear();

// Only the following code changed
var greetings = "Greetings " + firstName + " " + lastName + "!";
Console.WriteLine(greetings);
```

Here are a few optional hints in case you feel stuck:

{%- capture hintContent -%}You only have one line to update.{%- endcapture -%}
{%- assign hintContent = hintContent | markdownify -%}
{%- include spoiler.html title="Hint 1" content=hintContent -%}

{%- capture hintContent -%}You only need to replace the following part of the code: `"Greetings " + firstName + " " + lastName + "!"`.{%- endcapture -%}
{%- assign hintContent = hintContent | markdownify -%}
{%- include spoiler.html title="Hint 2" content=hintContent -%}

Once you are done, you can compare with `My Solution` below.

{%- capture solutionContent -%}**Program.cs**

```csharp
using System;

Console.Title = "IntroToDotNet";

Console.Write("What is your first name? ");
var firstName = Console.ReadLine();
Console.Clear();

Console.Write("What is your last name? ");
var lastName = Console.ReadLine();
Console.Clear();

// Only the following line changed
var greetings = $"Greetings {firstName} {lastName}!";
Console.WriteLine(greetings);
```

The only change is that I replaced the following line:

```csharp
var greetings = "Greetings " + firstName + " " + lastName + "!";
```

By the following line:

```csharp
var greetings = $"Greetings {firstName} {lastName}!";
```

Don't you feel like interpolation is clearer than concatenation in this case?
Well, if you don't, I do, which is fine either way.

{%- endcapture -%}
{%- assign solutionContent = solutionContent | markdownify -%}
{%- include spoiler.html title="My Solution" content=solutionContent -%}

Good job! You completed another small chapter of your programming journey.

## Conclusion

In this article, we explored interpolation as a way to replace concatenation in certain scenarios.
At this point, using one or the other is only a matter of taste.

To use interpolation, we need to prefix a string with `$`.
Inside that string, we can then wrap an expression, like a variable, with `{` and `}`.
The program will replace that token at runtime with the expression's value.

We also saw that we could use interpolation with multiline strings by prefixing the string with both special characters, like this: `$@"..."`.

{%- include learn-coding-with-dot-net-core/next.md nextIndex=8 -%}

### Table of content

{%- include learn-coding-with-dot-net-core/toc.md currentIndex=7 -%}
