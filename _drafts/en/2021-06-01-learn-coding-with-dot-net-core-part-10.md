---
title: 'Writing conditional code blocks with if-else selection statements'
subtitle: 'A beginner guide to programming with .NET 5 and C#'
date: 2021-06-13 00:00:00 -0500
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
Don't worry, as part of the beginner journey, we will keep the focus on the _if-else selection statements_ LEGO&#174; block, laying down the foundation for more advanced use-cases.

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

> You can read this as **left_operand is equal to right_operand**.

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

> You can read this as **left_operand is not equal to right_operand**.

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

Have you noticed the indentation added inside the statements block?
By convention, we add that indentation for readability.
That makes the different contexts (or nested-levels) line up vertically, like this:

TODO: INSERT IMAGE

In C#, we usually use 4 spaces to indent the code.
People may also use 2 spaces (not frequent in the .NET/C# world).
Some people also prefers to use tabs instead of spaces.
By default, Visual Studio and Visual Studio Code will translate a tab to _N_ spaces automatically (default: 4), so you don't have to type 4 spaces every time; one tab will do.
That default can also be configured.

> **"Fun" fact":** A tabs versus spaces war also exists where people prefer tabs over spaces or vice versa and argue that their way is the best over the other.
> I personally use spaces, tried tabs, tried many technique during the years, and realized that it does not matter much in the end.
> If you are working in a team or an enterprise, there will most likely be some predefined guidelines around that.

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
Console.WriteLine("End of the program.");
```

When running the program, if the user enters `GO` (uppercase), the program will print `The user entered GO!`, otherwise, it will skip that code block.
Here is a running example:

![if statement program execution](//cdn.forevolve.com/blog/images/2021/2021-06-05-if-statement-program-execution.gif)

As we can see from that recording, if we enter something else than `GO`, the program skips the statements block.

But what happens if we want something different to happen if the input is not `GO` while keeping this logic?
This is what we are exploring next, with the `else` statement.

### The `else` statement

The `else` statement must follow an `if` statement block (or an `else if` block; see bellow).
We can't write an `else` block alone.

The `else` statements block is the fallback of an `if` block.
In the next example, we will put that to good use and display `Console.WriteLine("The user did not enter GO!");` if the input is different.
We could write this with two `if` statements or with an `if` followed by an `else` statement.
Let's start with the first:

```csharp
using System;

Console.WriteLine("Enter something: ");
var input = Console.ReadLine();
if (input == "GO")
{
    Console.WriteLine("The user entered GO!");
}
if (input != "GO")
{
    Console.WriteLine("The user did not enter GO!");
}
Console.WriteLine("End of the program.");
```

In this case, the preceding code would do the trick.
We can remove that second comparison `input != "GO"` by leveraging the `else` statement instead.
This will a) remove that comparison (improve performance) and b) make our program more maintainable by removing the duplicated logic.

```csharp
using System;

Console.WriteLine("Enter something: ");
var input = Console.ReadLine();
if (input == "GO")
{
    Console.WriteLine("The user entered GO!");
}
else // Only this line changed
{
    Console.WriteLine("The user did not enter GO!");
}
Console.WriteLine("End of the program.");
```

Running any of those two programs results in the following execution flow:

![if statement program execution](//cdn.forevolve.com/blog/images/2021/2021-06-05-if-else-statement-program-execution.gif)

And there we go; we can now use the `if` and the `if-else` statements to control the execution flow of the program.
We can execute only certain code blocks based on runtime values.

Ok, but what happens when we want to write a different message if the user enters `SHOW ME`?
That's what we are exploring next using the `else if` statement.

### The `else if` statement

The `else if` statement is a follow up `if` statement if you wish.
As we saw in the preceding section, we can have two `if` statement back to back and they are independent of each other.
However, the `else if` statement allows to add another conditional block after the `if`, but the condition will only be evaluated if the previous block was `false`.
We can chain as many `else if` statements as we need.
The `else` statement must alway be last.

Here are a few examples of the syntax:

```csharp
// if + else if
if (condition1)
{
    // ...
}
else if (condition2)
{
    // ...
}
```

```csharp
// if + else if + else if
if (condition1)
{
    // ...
}
else if (condition2)
{
    // ...
}
else if (condition3)
{
    // ...
}
```

```csharp
// if + else if + else
if (condition1)
{
    // ...
}
else if (condition2)
{
    // ...
}
else
{
    // ...
}
```

```csharp
// if + else if + else if + else
if (condition1)
{
    // ...
}
else if (condition2)
{
    // ...
}
else if (condition3)
{
    // ...
}
else
{
    // ...
}
```

As mentioned, we can add as many `else if` block as needed.
Let's now apply that to our problem: we want to write a different message if the user enters `SHOW ME`.

We can do this only with `if` statements, but it can get complicated:

```csharp
using System;

Console.WriteLine("Enter something: ");
var input = Console.ReadLine();
if (input == "GO")
{
    Console.WriteLine("The user entered GO!");
}
if (input == "SHOW ME")
{
    Console.WriteLine("The user entered SHOW ME!");
}
if (input != "GO" && input != "SHOW ME")
{
    Console.WriteLine("The user did not enter GO nor SHOW ME!");
}
Console.WriteLine("End of the program.");
```

By looking at the preceding code, we can see that the more logic we add, the more complex the `else` block equivalent becomes.
Here we have to conditions (`input == "GO"` and `input == "SHOW ME"`) so we must make sure that both are `false` before executing the default block (`input != "GO" && input != "SHOW ME"`).

> **Tips:** I strongly advice against writing that type of code as it can get out of hand very quickly.

Let's simplify that code using `if—else if—else` blocks instead:

```csharp
using System;

Console.WriteLine("Enter something: ");
var input = Console.ReadLine();
if (input == "GO")
{
    Console.WriteLine("The user entered GO!");
}
else if (input == "SHOW ME")
{
    Console.WriteLine("The user entered SHOW ME!");
}
else
{
    Console.WriteLine("The user did not enter GO nor SHOW ME!");
}
Console.WriteLine("End of the program.");
```

We can notice two sets of changes, replacing the second `if` by an `else if`, and replacing the last `if` by an `else`.
Here is a _diff_ of those two listing, where the red lines are replaced by the green lines:

{:.diff-highlight}

```diff-csharp
using System;

Console.WriteLine("Enter something: ");
var input = Console.ReadLine();
if (input == "GO")
{
    Console.WriteLine("The user entered GO!");
}
- if (input == "SHOW ME")
+ else if (input == "SHOW ME")
{
    Console.WriteLine("The user entered SHOW ME!");
}
- if (input != "GO" && input != "SHOW ME")
+ else
{
    Console.WriteLine("The user did not enter GO nor SHOW ME!");
}
Console.WriteLine("End of the program.");
```

Running any of those two programs results in the following execution flow:

![else if statement program execution](//cdn.forevolve.com/blog/images/2021/2021-06-05-else-if-statement-program-execution.gif)

Now, let's explore how the code is evaluated.
Those two small sets of differences changes many things in the execution flow.

![else if diff order execution flow](//cdn.forevolve.com/blog/images/2021/2021-else-if-diff-order-all-annotations.png)

In the preceding image, we can noticed that each condition is evaluated (on the left) while the conditions are evaluated only when the previous one was false (on the right).
This is the big difference between using `if—else if—else` or not.

Here is an example depicting the best scenario: when `input = "GO"`.

![else if diff order execution flow when input equals GO](//cdn.forevolve.com/blog/images/2021/2021-else-if-diff-order-input-equals-go.png)

Let's start with the left side:

1. The first few lines are executed.
2. The first `if` is evaluated to `true`.
3. The program writes a line to the console.
4. The second `if` is evaluated to `false`.
5. The third `if` is evaluated to `false`.
6. The program writes a line to the console.

On the other hand, with the right side:

1. The first few lines are executed.
2. The first `if` is evaluated to `true`.
3. The program writes a line to the console.
4. The program writes a line to the console.

In that second execution flow, only the first `if` is evaluated.
The program skip the evaluation of the `else if` statement and _jump over_ the `else` as well.

Now that we explored all of that, it is time for you to practice.

## Exercise

You must write a program that:

-   Ask the user to input the letter A, B, or C
-   ...

## Conclusion

In this article, we ...

{%- include learn-coding-with-dot-net-core/next.md nextIndex=11 -%}

### Table of content

{%- include learn-coding-with-dot-net-core/toc.md currentIndex=10 -%}
