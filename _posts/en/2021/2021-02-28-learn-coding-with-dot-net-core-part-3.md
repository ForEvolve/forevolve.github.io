---
title: 'Introduction to C# constants'
subtitle: 'A beginner guide to programming with .NET 5 and C#'
date: 2021-02-28 00:00:00 -0500
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

{% include learn-coding-with-dot-net-core/intro-series.md %}<!--more-->

## Definition of a constant

Besides knowing that a constant's value cannot change, its **value is replaced at compile-time**.

On the contrary, **variables are evaluated at runtime**. Therefore, the program uses the value they hold at the time of their usage during the execution.

To define a constant, we use the `const` modifier in front of its type, followed by an identifier, an assignment operator, then its value; like this:

```csharp
const string greetings = "Hello .NET Ninja!";
const int age = 102;
```

> **Note:** we can't use the `var` keyword for constants.

Let's look at two use-cases, one using a variable and one using a constant.

### Variable flow

In the following code, the value of the `greetings` variable is transferred to the `WriteLine` method. It is then written to the console at runtime.

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
That's because the evaluation is done at runtime.

Next, we look at constants.

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

When executing the program, the result is the same as if we wrote the preceding code ourselves.
The only difference is that the compiler did the job of replacing the value for us.

Next, we look at what we can do with this.

## What to do with constants?

As a neophyte, this may sound useless, but as your level of knowledge grows, it becomes more relevant.
In general, constants are used to make your program easier to maintain.
Here are a few examples:

**Case 1:** you do not want hard-coded values spread throughout your program.
Doing so makes the program harder to maintain when you need to change one of those hard-coded values.
You can also make a typo when typing the value manually.
For example, you need to find the values, make sure you don't forget any, replace them, etc., leading to more risks of making a mistake in the process.
To fix that issue, you can use constants to centralize all of those values in one place, making the program easier to maintain without impact on runtime performance because the constants are replaced at compile-time.

**Case 2:** you want to reuse a specific value at multiple places in the code as a way to identify something (an identifier, a key, an index, a URL).
Instead of duplicating that literal value, you can use a constant, which removes the duplication by depending only on the constant.
If you need to change the value, you can update the constant, recompile, and voilà; all references to that constant now use the new updated value.

> **More info:** There is a downside to constants, which can happen in a more advanced scenario.
> When creating a project<sup>(1)</sup> that depends on a constant from another project<sup>(2)</sup>, if the author of project<sup>(2)</sup> changes the value of a constant that project<sup>(1)</sup> depends on, project<sup>(1)</sup> needs to be recompiled for the change to be applied.
> This could, on rare occasions, have unintended consequences, where different values are used, leading to inconsistent states.
>
> Feel free to return to this note later as it is for more advanced scenarios.
> Maybe some or all of this makes no sense to you yet, which is normal.
> I decided to leave the note anyway because it is constant-related and important to know.

## Exercise

Let's rewrite our previous program to use a constant instead of a variable.

Our goal is to obtain the following output in the console:

```bash
------------------
What is your name?
------------------
```

The `Starting point` below contains my solution to the preceding exercise, which you can start from.
You can also start from your code if you prefer or start from scratch, leading to more practice.

{%- capture previousSolutionContent -%}**Program.cs**

```csharp
using System;

var spacer = "------------------";
Console.WriteLine(spacer);
Console.WriteLine("What is your name?");
Console.WriteLine(spacer);
```

{%- endcapture -%}
{%- assign previousSolutionContent = previousSolutionContent | markdownify -%}
{%- include spoiler.html title="Starting point" content=previousSolutionContent -%}

Once you are done, you can compare with `My Solution` below.

{%- capture solutionContent -%}**Program.cs**

```csharp
using System;

const string spacer = "------------------";
Console.WriteLine(spacer);
Console.WriteLine("What is your name?");
Console.WriteLine(spacer);
```

Don't worry if your solution is different than mine.
As long as you completed it, it means you understood the lesson or at least practiced.
Practicing is the key to success!
{%- endcapture -%}
{%- assign solutionContent = solutionContent | markdownify -%}
{%- include spoiler.html title="My Solution" content=solutionContent -%}

Good job! You are done with another small chapter of your programming journey.

## Conclusion

In this article, we learned the constants' syntax.
We covered how to create a constant and how to assign it a value.
Like declaring a variable using the `var` keyword, we must assign it a value when declaring it.
We cannot use the `var` keyword for constant and must specify its type instead.
Unlike variables, once the constant is declared, we cannot change its value.

The value of a constant is evaluated and replaced at compile-time, making it a great candidate to improve maintainability while keeping performance the same.
As a reference, variables are evaluated at runtime.

{%- include learn-coding-with-dot-net-core/next.md nextIndex=4 -%}

### Table of content

{%- include learn-coding-with-dot-net-core/toc.md currentIndex=3 -%}
