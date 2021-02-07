---
title: 'Creating your first .NET/C# program'
subtitle: 'A beginner guide to programming with .NET 5 and C#'
xexcerpt: |
    In this article, we are creating a small console application using the .NET CLI to get started with .NET 5+ and C#.
    The article is the first of a <em>learning to code</em> series that does not expect any prior knowledge of programming.
    If you don't know how to program and want to learn .NET, this is the right place.
date: 2021-02-07 00:00:00 -0500
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

This article is the first of a **learn programming** series where you need **no prior knowledge of programming**.
If you want to **learn how to program** and want to learn it **using .NET/C#**, this is the right place.

The first step of coding is to **create a program**.
The program could be a simple console or a more complex application (web, mobile, game, etc.).
To get started, we will create a console application, which is the simplest type of program that we can make.
The good news is that most of the topics covered in this series are reusable across all types of programs.

Furthermore, .NET and C# allow you to create a wide variety of programs and target most markets, from web to mobile to smart TVs.
I believe this is a good choice of technology to start with.

Beforehand, let's look at the prerequisites.<!--more-->

## Prerequisites

If you have not already installed the .NET **Software Development Kit (SDK)**, you can download it from [https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download).
Make sure you install the **.NET 5 (or later)** SDK.

> **Hint:** Make sure you install the .NET SDK, not the runtime.
> The runtime is used and optimized to run .NET apps.
> The SDK contains the runtime and all the necessary tools to develop new programs.

Another good idea would be to install an **Integrated Development Environment (IDE)** or a **code editor**.
To get started, I suggest a simple, free, yet powerful code editor named [Visual Studio Code (VS Code)](https://code.visualstudio.com/).

> **Hint:** For more complex programs, especially if you are developing on Windows, I suggest Visual Studio (VS).
> VS is a full-fledged IDE, more complex than VS Code, but extremely powerful to create and maintain large .NET applications.
> VS also offers a free Community Edition, so you can learn and get started with it.

Next, let's get started with our console.

# Getting started with the .NET CLI

With .NET, the easiest way of creating a new cross-platform project is through the .NET **Command-line interface (CLI)**.
The CLI is part of the .NET SDK.
It is a program that we can use to execute and automate tasks, like creating new projects.

> Hint: cross-platform means targeting multiple platforms like Windows, Linux, and Android.

But first things first, we need to create a directory that will hold our program files.
It is important to be organized.
Let's name the directory `IntroToDotNet`.
From a terminal (bash, PowerShell, or cmd), let's start by typing `dotnet new console`, which generates a new console application.

> **Hint:** make sure you are in the right directory.
> I suggest a structure similar to `[drive]:\Repos\[name of your project]`.
> For example: `D:\Repos\IntroToDotNet`.
> **More info:** **repos** is a shorthand for **repositories** which is a reference to **git**.
> **git** is something very important to learn in the future, but for now, let's get back to coding.

The following terminal commands allow you to create a directory and an empty console application inside of it.
If you already created the directory, you can skip that part and only execute the `dotnet new console` command.

```bash
# Create a directory
mkdir IntroToDotNet
cd IntroToDotNet

# Create the .NET project
dotnet new console
```

> **Hint:** You can type `ls` in the terminal to list the files contained in the current directory.

The result of the console template is the following two files.

**IntroToDotNet.csproj**

`[name of the directory].csproj` (`IntroToDotNet.csproj`) is an XML file defining project properties.
We can use this file to configure more advanced scenarios.
We won't get into more details but know that you need one `csproj` file per project.

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net5.0</TargetFramework>
  </PropertyGroup>

</Project>
```

**It is important to note that the `IntroToDotNet.csproj` file's content will remain the same for the whole article.**

> **More info:** the name of this file does not have to match the name of the directory it is in; that's just the default behavior of `dotnet new`.

**Program.cs**

`Program.cs` is the entry point of our program.
This is where we write code.

```csharp
using System;

namespace IntroToDotNet
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
        }
    }
}
```

# Writing our first line of code

As mentioned before, the file that interests us the most is the `Program.cs` file.
However, it is already filled with boilerplate code that we don't really need (for now).
To keep our focus on the task at hand&mdash;learning C#&mdash;we will leverage **top-level statements** to discard that code.

Let's replace all of that boilerplate code with the following line:

**Program.cs**

```csharp
System.Console.WriteLine("Hello .NET Ninja!");
```

> **More info:** the **top-level statements** feature was introduced in C# 9 (.NET 5).

Now that we wrote some code, it is time to tell your computer to execute it.
To do so, from the directory that contains the `IntroToDotNet.csproj` file, type the following:

```bash
dotnet run
```

Afterward, you should see `Hello .NET Ninja!` written in the console.
While reading this article, you can `dotnet run` the program and see the output.
Next, let's explore that code.

# Exploring the building blocks

There are several building blocks in that one line of code.
Don't worry if you don't remember or grasp every detail or term just yet.
Coding is like playing with LEGO<sup>&reg;</sup>.
You just need to understand how to connect the blocks, and you are good to go.
Of course, there is a lot of learning to do, but that's part of the fun.

The first thing that I'd like to point out is the last character, the `;`.
That character represents the end of a **statement** (the end of a line of code if you wish).
A statement is an instruction that tells the program to do something, an action, a command.
That's the type of code that we write the most.
In C#, it is mandatory to add the `;` after a statement, or the code will not compile.

> **More info:** in C#, we write text (code) that gets compiled into an intermediate language (IL).
> That IL code is then executed by the .NET runtime.
> The compilation is transforming the text (our code) to that IL language, getting closer to what computers understand.
> This is a mandatory step, but it will be done almost seamlessly by the SDK as we just explored with `dotnet run`.

Let's now dissect more of that line of code, starting with the identifiers.

## Identifiers

`System` is a **namespace**. A namespace allows us to organize elements of our programs hierarchically.
You can see a namespace as a sort of directory.

`Console` is a **static class** that exposes a few **methods**.
A **class** is a sort of plan defining how to create an **object**.
An **object** can be pretty much anything that we need and is a mandatory concept in an **object-oriented programming (OOP)** language like C#.
We will revisit objects in subsequent articles.
A **static class** exposes its content globally without creating an instance of it (an object).

A **method** is a **function** that we can use to do something (reusable code).
In this case, we used the `WriteLine` method, which writes a line into the console.
For example, every time we need to write a line to the console, we can leverage the `WriteLine` method; we can reuse it.

The line that is written to the console is a **string**.
A string is _simply_ a bunch of characters put together to form some text.
In C#, A string is contained between two quotes, like this: `"Hello .NET Ninja!"`.
Ok, there are more to strings, but not for now.

The next building blocks are the **member access operators**.

## Member access operators

The first one that we encountered is the `.` character.
The dot allows us to access the exposed members of a class, namespace, etc.
In our case, we used the `.` operator to access the `Console` class from the `System` namespace, like this: `System.Console`.
Then we used the `.` operator again to access the `WriteLine`method of the `Console` class, like this: `Console.WriteLine`.
As we already saw, we can chain `.` operators, leading to code like this: `System.Console.WriteLine`.

The last bit is the parenthesis.
In C#, we use the `(` and `)` characters to **invoke a method**.
Invoking a method means executing its code.
Between the parenthesis, we can pass **arguments**.
An **argument** is an input value that will most likely change the result of the execution.
In our case, we passed the string `"Hello .NET Ninja!"` to the `WriteLine` method, writing that text to the console.
If we wanted to write something else, we could have passed that instead, like this:

```csharp
System.Console.WriteLine("Something else!");
```

Most of these subjects deserve to be explored more in-depth but are out of this article's scope.
Next, we explore how to access namespaces with fewer keystrokes.

# Accessing namespaces

The last subject that I want us to explore in this article is how to **simplify access to members**.
Let's say that we need to write many lines to the console. We could want to get rid of the `System` namespace to write less code.
Fortunately for us, C# offers the `using` **directive**.
A directive tells the compiler how to interpret our code.
The `using` directive exposes all members of a namespace and removes the need to prefix them with it.
We can write as many `using` directives as we need.
Those directives usually appear at the top of the file.

> **More info:** in the case of top-level statements, we have no choice but to write `using` directives on top of the file so I won't get into the other possibilities just yet.

To get rid of the `System` prefix, we can write `using System;` at the top of the file.
Then we can simplify the WriteLine, as follow:

```csharp
using System;
Console.WriteLine("Hello World!");
```

The `using` directives are useful for longer namespaces or for repeating usage of a namespace's members.
For example, if writing many `Console.WriteLine(...)` statements, like this:

```csharp
using System;

Console.WriteLine(" _   _      _ _         __        __         _     _ _ ");
Console.WriteLine("| | | | ___| | | ___    \ \      / /__  _ __| | __| | |");
Console.WriteLine("| |_| |/ _ \ | |/ _ \    \ \ /\ / / _ \| '__| |/ _` | |");
Console.WriteLine("|  _  |  __/ | | (_) |    \ V  V / (_) | |  | | (_| |_|");
Console.WriteLine("|_| |_|\___|_|_|\___/      \_/\_/ \___/|_|  |_|\__,_(_)");
```

> **Note:** The ASCII text was originally generated by [figgle](https://github.com/drewnoakes/figgle) and has been modified a little.

I also find that `using` directives make the code clearer, removing some noise.

# Conclusion

That's it; we wrote our first C#/.NET 5 program.
We also wrote some text to the console, learned to use top-level statements, and learn to simplify the usage of namespaces' members.

We explored the "hidden" details behind one line of code and got a glimpse of many new names, like directives and statements.
If you are not already familiar with object-oriented programming, don't worry about all of those names just yet.
Classes, namespaces, and methods are tools to organize our code that you will learn along the way.
Many of those things (like directives and statements) are used implicitly, and unless you plan on writing about it, you don't need to remember them just yet.
Learning to program can be done in multiple iterative phases where you add little by little over what you know until you can achieve your goal.
Then, you start this process over and add more layers of knowledge on top of what you know to reach your subsequent goals.

Please play with the code a little to get familiar with what we just covered.
I know it is not much, but one must walk before one can run.
Coding is the best way to learn, so get your hands dirty and experiment.

In the next article of the series, we will explore how to create variables.

## Table of content

{%- include learn-coding-with-dot-net-core/toc.md currentIndex=1 -%}

{%- include learn-coding-with-dot-net-core/next.md nextIndex=2 -%}
