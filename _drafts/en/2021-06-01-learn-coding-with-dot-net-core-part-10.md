---
title: 'Writing conditional code blocks with if-else selection statements'
subtitle: 'A beginner guide to programming with .NET 5 and C#'
date: 2021-06-01 00:00:00 -0500
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

In this article, we are exploring conditional execution flows. What is a code path? How will we do that? These are the subject that we cover here.
Don't worry, as part of the beginner journey, we will keep the focus on the _if-else selection statements_ LOGO&#174; block, laying down the foundation for more advanced use-cases.

{% include learn-coding-with-dot-net-core/intro-series.md %}
{% include learn-coding-with-dot-net-core/sub-series.md firstPart=9 %}<!--more-->

## Conditional execution flow

In the article _How to read user inputs from a console_, we talked about the flow of a program, moving from the first instruction to the next.
Here, we are exploring how to run only part of the code, based on different values.

Visually, this could resemble this:

TODO: add image

By writing conditional code blocks, we can create a program that actually have more complex logic than a linear flow, as we programmed so far.
Here is another visual example of this:

TODO: add image

Next, we explore how to program that, in C#.

## Equality operators

Before we dig into the conditional block we will visit two new operators to help us compare if two values are equal or not.
Those works with all primitive types like `string` and `int` for example.

### Equality operator ==

The equality operator `==` allows to compare if two values are equal.
The syntax is `left_operands == right_operand` and returns a Boolean value.

> You can read this as **left_operands equals right_operand**.

Here is an example:

```csharp
var left = "A";
var right = "B";
var result = left == right; // false
// ...
```

In the preceding code, since A is not equal to B, the result of the `left == right` comparison is `false`.
In the case of `"A" == "A"`, the result would have been `true`.

We have one last operator to look into before exploring the if-else selection statements, the inequality operator.

### Inequality operator !=

The inequality operator `!=` is the opposite of the equality operator and allows to compare if two values are not equal.
The syntax is `left_operands != right_operand` and returns a Boolean value.

> You can read this as **left_operands does not equal right_operand**.

Here is an example:

```csharp
var left = "A";
var right = "B";
var result = left != right; // true
// ...
```

In the preceding code, since A is not equal to B, the result of the `left != right` comparison is `true`.

> **More info:** the inequality operator is syntactic sugar, equivalent to `!(left == right)`.
> This simplifies writing C# code a lot.

There are other operators used to compare numbers for example, but we will not visit those in this article.
Instead, since we are done with prerequisites, let's jump into the main subject: the _if-else selection statements_.

## if-else selection statements

The _if-else selection statements_ are blocks of C# code that are executed conditionally based on an Boolean expression; a condition that evaluates to `true` or `false`.
In this section, we are exploring the following concepts:

-   What is a statement block
-   The `if` statement
-   The `else` statement
-   The `else if` statement

### Statement block

In C#, a statement block is delimited by `{` and `}`, like this:

```csharp
// Code before the statement block
{ // Statement block start delimiter
    //
    // Code inside the block
    //
} // Statement block end delimiter
// Code after the statement block
```

A block creates a sub-context that can access its parent context.
However, the parent context can't access that sub-context.
Here is an example that illustrates this concept:

```csharp
using System;

var a = 1;
{
    var b = 2;
    Console.WriteLine($"Inside block; a = {a}");
    Console.WriteLine($"Inside block; b = {b}");
}
Console.WriteLine($"Outside block; a = {a}");
Console.WriteLine($"Outside block; b = {b}"); // Error: The name 'b' does not exist in the current context
```

In the preceding code, the program can access the `a` variable from inside the statements block, but cannot access the `b` variable from outside of it.
Moreover, if we execute the code, .NET will report an error telling us `The name 'b' does not exist in the current context`.
We can run the program by commenting the last line.

Let's explore why I indented the code inside the block before writing our first conditional code block using the `if` statement.

#### Indentation

**More info:** have you noticed the indentation added inside blocks?
By convention, we add that indentation for readability.
That makes the different contexts (or nested-levels) line up vertically, like this:

TODO: INSERT IMAGE

In C#, we usually use 4 spaces to indent the code.
In other languages, people also use 2 spaces.
A tabs versus spaces war also exists where people prefer tabs over spaces.
By default, Visual Studio and Visual Studio Code will translate a tab to _N_ spaces automatically (default: 4), so you don't have to type 4 spaces every time; one tab will do.
That default can also be configured.

Next, we explore the `if` statement.

### The `if` statement

The `if` statement does literally what its English definition is: **if the _condition_ is true, then enter the statements block; otherwise, don't**.
This is where we begin to put that Boolean algebra to good use.
Here is an example:

```csharp
using System;

Console.WriteLine("Enter something: ");
var input = Console.ReadLine();
if (input == "GO")
{
    Console.WriteLine("The user entered GO!");
}
```

CONTINUE HERE: RECORD CONSOLE/GIF

## Conclusion

In this article, we ...

{%- include learn-coding-with-dot-net-core/next.md nextIndex=11 -%}

### Table of content

{%- include learn-coding-with-dot-net-core/toc.md currentIndex=10 -%}
