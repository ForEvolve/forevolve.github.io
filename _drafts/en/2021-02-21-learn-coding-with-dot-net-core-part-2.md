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

In this article, we explore variables.
What they are, how to create them, and how to use them.
Variables are one of the most important elements of a program, making it dynamic.
Of course, there is more to variables than what we can cover in a single article; this is only the beginning.

This article is the second of a **learn programming** series where you need **no prior knowledge of programming**.
If you want to **learn how to program** and want to learn it **using .NET/C#**, this is the right place.
I suggest reading the whole series in order, but that's not mandatory.<!--more-->

## Definition of a variable

Before beginning, it is essential to know what we are aiming at.

**A variable is an identifier that we can use programmatically to access a value stored in memory.**

Let's break that down, an **identifier** is a name, a way to identify your variable.
We then can use that identifier to read or write data into memory.
That memory is the **random-access memory (RAM)** of the computer executing the code.
But you don't even have to worry about that because .NET manages most of it for you.
First, all you need to know is how to declare a variable and how to use it.

There are many different types of variables and ways to optimize memory usage. Still, the concept always remains similar to what we are covering now.

## Creating a variable using the `var` keyword

C# offers many ways of creating variables.
The most straightforward one is to use the `var` keyword.
The syntax is as follow:

```csharp
var identifier = initial_value;
```

Next, let's dissect this line of code.

### The `var` keyword

`var` is a keyword to create a variable.
It implicitly represents the **type** of that variable.
That type is inferred from the value of `initial_value`, the right-end part of the declaration statement.

C# is a **strongly-typed** language, so it requires each variable to be of a specific type.
The **type of a variable cannot change after being declared**, but its value can.
We will explore types more in-depth in future articles, but for now, think of the type as the _type of data_ that we want to use, for example, a string (text) or a number.

An alternative way to declare a variable is to use C# 1.0 syntax and use the type of the variable directly instead of `var`.
For example, we could declare a variable of type `string` like this:

```csharp
string identifier = "Hello C# Ninja!";
string identifier; // We can do this because C# don't have to infer the type; it is specified.
var identifier; // We cannot do this because C# don't know what type to use.
```

I prefer the `var` keyword as I find it simplifies the declaration of variables.
It also makes all identifiers horizontally aligned on the screen.
For example:

```csharp
// C# 1.0
string variable1 = ...;
int variable2 = ...;
List<MyCustomType> variable3 = ...;

// Using the `var` keyword
var variable1 = ...;
var variable2 = ...;
var variable3 = ...;
```

> **More info:** some languages are weakly-typed.
> That means you can change the type of data referenced by a variable implicitly, at any time.
> These types of changes can lead to unintended or unforeseen consequences.
> I recommend learning a strongly-typed language like C# to understand these concepts first.
> Afterward, moving to a weakly-typed language is easier.
> The learning curve of moving from weakly- to strongly-typed language is way more challenging.
> Furthermore, typing errors are caught at compile-time when using a strongly-typed language instead of at runtime, which should lead to less-buggy products.

Next, let's explore the identifier part of our initial statement.

### Identifier

The `identifier` represents the name of the variable and must be as specific as possible.
A variable's name must describe what that variable is holding, so anyone reading your code knows without the need to investigate.

An identifier must start with either a letter or an `_`.
It can then be composed of different Unicode characters.
I strongly suggest using only letters and numbers to keep names simple and universal.
Not everyone can easily make unusual characters like `è` or `ï` using their keyboard's layout.

I will explain casing styles and code convention in one or more other articles.
For now, your goal is to write working code.
Not knowing every detail of every subject is ok. If you wait for that, you will never start.

Next, we explore another operator.
As a refresher, we learned about the _member access operators_ in the first article of the series.

### Assignment operator

Now that we named our variable, it is time to assign it a value (also inferred as its type).
The `=` character represents the assignment operator.

The assignment operator **assigns the value of the right-hand operand to the left** side.
For example, to assign the string value `"How are you?"` to a variable named `howAreYou` we could write the following code:

```csharp
var howAreYou = "How are you?";
```

The `=` takes the right-hand value (`"How are you?"`) and assigns it to the variable named `howAreYou`.
We can now use and work with that variable using its identifier (`howAreYou`).
We could, for example, write its value to the console.

Next, let's briefly recap on the `initial_value` of the initial statement.

### Initial value

We already talked about this while explaining the other parts of the statement, but I'll make a quick recap.

The initial value could be pretty much anything: a string, an integer, or an instance of an object.
The initial value is what defines the type of a variable declared using the `var` keyword.
Here are a few examples:

```csharp
var greetings = "Hello, John Doe!"; // type: string
var age = 25; // type: int
var length = 12.87;  // type: float
var now = DateTime.Now;  // type: DateTime
```

If you don't know what `string`, `int`, `float`, and `DateTime` means, it's ok.
They are types available in C# or .NET. As mentioned before, we are going to cover types in subsequent installments of this series.
For now, the important part is to understand the syntax.

TODO: IMAGE

Enough syntax and theory, let's try this out next.

## Adding a variable to our program

Let's reuse the program we built in the first article of the series, which looked like this:

```csharp
using System;
Console.WriteLine("Hello .NET Ninja!");
```

> **Practice:** You can also create a new program, which will make you practice the use of the .NET CLI, introduced in the
> {% include learn-coding-with-dot-net-core/ref.md index=0 %} article.

To prepare the program for more advanced use-cases, we want to extract the text `Hello .NET Ninja!` in a variable.
To do so, based on what we just explored, we can write the following:

```csharp
using System;

var greetings = "Hello .NET Ninja!";
Console.WriteLine(greetings);
```

> **Hint:** One crucial detail in the preceding code is that we don't wrap the `greetings` identifier with `"` when passing it as an argument of the `WriteLine` method.
> We write it directly, like this: `Console.WriteLine(greetings);`, since we don't want to pass the string `"greetings"` to the method, but the value referenced by the `greetings` variable.
> In C#, `"` is the **string delimiter** character.
> We will cover strings in more detail in a subsequent article.

After executing the code above, we can see that we get the same result as before but using a variable instead of inputting text directly into the `Console.WriteLine` method.

What happened is the following:

1. We assigned the value `"Hello .NET Ninja!"` to the `greetings` variable.
    - The type of the `greetings` implicitly became `string`.
1. We wrote the value of the `greetings` variable to the console.
    - The value was substituted, which dynamically became `Console.WriteLine("Hello .NET Ninja!");`.
    - If we change the value of the `greetings` variable, the message written in the console would change.

TODO: IMAGE

That may seem useless for now, but keep in mind that a variable's value can be modified, assigned from user inputs, computed, and more.
We are only beginning and will explore variables in more detail in future articles, most likely in everyone.
Variables are foundational to programming.

Next, it is your turn to try it out.

## Exercise

Before moving on, to practice the use of C#, I'd like you to create a program that writes the following output to the console.

```text
------------------
What is your name?
------------------
```

{%- capture hintContent -%}<p>Use a variable to handle the duplicate text.</p>{%- capture innerHintContent -%}```csharp
var spacer = "------------------";
```{%- endcapture -%}
{%- assign innerHintContent = innerHintContent | markdownify -%}
{%- include spoiler.html title="Code Hint" content=innerHintContent -%}
{%- endcapture -%}
{%- include spoiler.html title="Hint" content=hintContent -%}

Once you are done, you can compare with the following solution.

{%- capture solutionContent -%}**Program.cs**

```csharp
using System;

var spacer = "------------------";
Console.WriteLine(spacer);
Console.WriteLine("What is your name?");
Console.WriteLine(spacer);
````

Don't worry if your solution is different than mine.
As long as you completed it, it means you understood the lesson or at least practiced.
Practicing is the key to success!
{%- endcapture -%}
{%- assign solutionContent = solutionContent | markdownify -%}
{%- include spoiler.html title="My Solution" content=solutionContent -%}

## Conclusion

In this article, we learned how to declare a variable.
We also learned about variables' syntax.
The variable that we created did not vary yet, but the concept is essential.
A variable allows us to store reusable data, accessible through its identifier (name).

{%- include learn-coding-with-dot-net-core/next.md nextIndex=3 -%}

### Table of content

{%- include learn-coding-with-dot-net-core/toc.md currentIndex=2 -%}

