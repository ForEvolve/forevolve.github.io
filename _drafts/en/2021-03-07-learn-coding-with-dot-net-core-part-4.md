---
title: 'Introduction to C# comments'
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

In this article we explore how to write comments.
A comment is some human-readable text; it is a note that we can leave in the code.
I left a few in preceding installements.

This article is the fourth of a **learn programming** series where you need **no prior knowledge of programming**.
If you want to **learn how to program** and want to learn it **using .NET/C#**, this is the right place.
I suggest reading the whole series in order, but that's not mandatory.<!--more-->

## Comments

There are three types of comments in C#:

-   Single line
-   Multiline
-   XML documentation comments, also known as _triple-slash comments_.

In this article, we will only explore the first two.
We can use the third style to document our code, but we don't know how to create such code yet.

Comments are used to leave notes in the source code.
As you begin, comments can be very useful.
The more you progress, the clearer your code will become and the less needed the comments will be.

> **More info:** I usually recommend to intermediate developers to write as close to zero comments as possible in their code.
> Comments too often become outdated and forgotten.
>
> For example, the code change but the comment remain the same.
> In that case, the comment describe the first version of the code, but the second version do something else.
> This is the kind of situation that can lead a third developer in the wrong direction.
> Both the code and the comment can contradict themselves.
>
> On the other hand, as a beginner, comments can be good to lay out your ideas and algorithms.
> They can also be a very good tool to reorganize logic into cohesive units.
> Enough of that, I'll most likely talk about that in future articles, in a more exciting context.

### Single line comments

We can write a single line comment by writing `//`.
Everything that is written afterward, on the same line, becomes a comment that does nothing.

Here are some examples:

```csharp
const string tmp = "SOME TEXT"; // This is a comment that could describe this statement

// This is a comment that could describe the following code block
Console.WriteLine("=====================");
Console.Write("===== ");
Console.Write(tmp);
Console.WriteLine(" =====");
Console.WriteLine("=====================");
```

If we run the code, we get the following output:

```plaintext
=====================
===== SOME TEXT =====
=====================
```

As you can see, the comments are not executed or outputted, they are there only to inform the programmer about the code.

### Multiline comments

Multiline comments are like their name implies: they can cover multiple lines.
Unlike the single line comments, multiline comments has an opening and a closing sequence of characters.
We can open a multiline comment with `/*` and close it with `*/` (same characters in the inverted order).

> **Hint:** The numpad of a _standard keyboard_ makes it very easy to open and close a multiline comment.

Here are a few examples:

```csharp
/* This is a multiline comment, but only on one line; please don't do what I did with the following line in your code, it is just an example. */
const/* This */string/* can */tmp/* be */=/* almost */"SOME TEXT"/* anywhere, */;/* as long as you don't break any token */
//
// We can also use single line comments; one does not block the usage of the other.
//
Console.WriteLine("=====================");
/*
We can also
use multiline
comments to
write longer
sequence of
text divided
onto multiple
lines.
*/
Console.Write("===== ");
Console.Write(tmp);
Console.WriteLine(" =====");
Console.WriteLine("=====================");
```

If we run the code, we get the following output:

```plaintext
=====================
===== SOME TEXT =====
=====================
```

Once again, the comments are not executed or outputted, they are there only to inform the programmer about the code.

## Conclusion

Comments are a tool to leave notes inside the code.
We can write single line comments beginning by `//` and we can write multiline comments between `/*` and `*/`.

One very important thing about comments is to describe the functionally, not the code itself.
For example, explaining to a C# programmer using a comment that `var text = "whatever";` creates a variable named `text` is not helpful.
But explaining that the following block of code is an implementation of the XYZ algorithm could be.
As I mentioned, at some point you want to aim at writing clear enough code that you don't need to explain it anymore.
That said, as a beginner, please do leverage comments to help you out.
You can describe your own code if that help you remember.
Everyone learn differently, there is not wrong in how to learn, so if your way is to use comments, please do abuse of them!

{%- include learn-coding-with-dot-net-core/next.md nextIndex=5 -%}

### Table of content

{%- include learn-coding-with-dot-net-core/toc.md currentIndex=4 -%}
