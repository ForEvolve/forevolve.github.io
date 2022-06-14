---
title: 'Using the switch selection statement to simplify conditional statements blocks'
subtitle: 'A beginner guide to programming with .NET 6 and C#'
date: 2022-06-30 00:00:00 -0500
post-img: '//cdn.forevolve.com/blog/images/articles-header/2021-learn-coding-with-dot-net-core.png'
unsplash-credit: Photo by Jefferson Santos on Unsplash
lang: en
categories: en/articles
tags:
    - .NET 6
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

This article explores how to simplify certain complex conditional blocks by introducing the `switch` statement.
The `switch` keyword is very standard in programming languages.
We use it to compare a variable with many values.

_Please note that we are not covering switch expressions in this article._

{% include learn-coding-with-dot-net-core-6/intro-series.md %}
{% include learn-coding-with-dot-net-core-6/sub-series.md firstPart=9 %}<!--more-->

## The Switch

In the previous article, {% include learn-coding-with-dot-net-core-6/ref.md index=9 %}, we covered the basics behind contextual code.
This article explores the `switch` statement by converting a complex `if` block to a `switch`.
We go through the syntax afterward.

**Initial code (if):**

```csharp
using System;

Console.WriteLine("Enter something: ");
var input = Console.ReadLine();
if (input == "hello" || input == "world" || input == "hello world")
{
    Console.WriteLine("Hello World!");
}
else if (input == "goodbye")
{
    Console.WriteLine("Au revoir!"); // Goodbye in French
}
else if (input == "name?")
{
    Console.WriteLine("What is your name?");
    var name = Console.ReadLine();
    Console.WriteLine($"Your name is {name}");
}
else
{
    Console.WriteLine("Invalid input");
}
Console.WriteLine("End of the program.");
```

**Converted code (switch):**

```csharp
using System;

Console.WriteLine("Enter something: ");
var input = Console.ReadLine();
switch (input)
{
    case "hello":
    case "world":
    case "hello world":
        Console.WriteLine("Hello World!");
        break;
    case "goodbye":
        Console.WriteLine("Au revoir!"); // Goodbye in French
        break;
    case "name?":
        Console.WriteLine("What is your name?");
        var name = Console.ReadLine();
        Console.WriteLine($"Your name is {name}");
        break;
    default:
        Console.WriteLine("Invalid input");
        break;
}
Console.WriteLine("End of the program.");
```

Let's now analyze the previous code, starting with the new keywords:

-   `switch`
-   `case`
-   `break`
-   `default`

The `switch` keyword starts a code block that must be followed by a variable in parenthesis, like this:

```csharp
switch (variable)
{
    // Code block
}
```

The `case` keyword, followed by a _value_ and `:`, is an equality comparison against the original `variable` passed to the `switch`.
You can see `case "goodbye":` as the equivalent of `if (variable == "goodbye")`.
A `case` block can be empty or end with a `break` or `return`.
We will not cover the `return` keyword in this article because it is related to other concepts that we have not explored yet.
When the `case` is empty, it continues to the next `case`.
For example, `case "hello":` falls back to `case "world":` that falls back to `case "hello world":` that gets executed.

> **Interesting fact:** C# does not support falling from one non-empty `case` to another as some other languages do.

The `break` keyword is a _jump statement_ that allows controlling the flow of the program by exiting the current block, a.k.a. jumping out of the `switch` block.

Finally, in a `switch` block, the `default` keyword is the equivalent of the `else`; it is hit when no other `case` was hit.

Before the exercise, let's peek at the program flow created by a switch statement.

## Flow of the program

In a nutshell, a `switch` statement allows comparing if a variable is equal to a value from a list of cases.
Here is a visual representation of the program flow created by a `switch` block:

![switch program's flow](//cdn.forevolve.com/blog/images/2021/switch-flow.png)

Next, it's your turn to try it out.

## Exercise

Convert the following code to use a `switch` statement.

```csharp
var input = Console.ReadLine();
if(input == "A")
{
    Console.WriteLine("1");
}
else if (input == "B")
{
    Console.WriteLine("2");
}
else if (input == "C")
{
    Console.WriteLine("3");
}
else if (input == "D")
{
    Console.WriteLine("4");
}
else if (input == "E")
{
    Console.WriteLine("5");
}
else
{
    Console.WriteLine("Invalid input");
}
```

Once you are done, you can compare with **My Solution** below.

{%- capture solutionContent -%}**Program.cs**

```csharp
var input = Console.ReadLine();
switch (input)
{
    case "A":
        Console.WriteLine("1");
        break;
    case "B":
        Console.WriteLine("2");
        break;
    case "C":
        Console.WriteLine("3");
        break;
    case "D":
        Console.WriteLine("4");
        break;
    case "E":
        Console.WriteLine("5");
        break;
    default:
        Console.WriteLine("Invalid input");
        break;
}
```

{%- endcapture -%}
{%- assign solutionContent = solutionContent | markdownify -%}
{%- include spoiler.html title="My Solution" content=solutionContent -%}

Good job! You completed another small chapter of your programming journey.

## Conclusion

This article explored the `switch` statement, which allows comparing if a variable is equal to a value from a list of cases.
The `switch` statement is another way to create conditional code and control our programs' flow.

The `switch` statement is handy for variables with a finite number of values like `enum`s.
More recent versions of C# also introduce switch expressions and pattern matching that open many other possibilities. However, many of those possibilities require knowledge of object-oriented programming that we are not exploring in this article series.

Please leave your questions or comments below or drop me a Tweet.

{%- include learn-coding-with-dot-net-core-6/next.md nextIndex=12 -%}

### Table of content

{%- include learn-coding-with-dot-net-core-6/toc.md currentIndex=11 -%}
