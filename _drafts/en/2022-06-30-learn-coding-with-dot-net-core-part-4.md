---
title: 'Introduction to C# comments'
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

In this article, we explore how to write comments.
Comments are simply human-readable pieces of text that are not compiled nor interpreted.
A comment is usually a note that we can leave in the code for the next programmer to get into that code or for us.
I left a few comments in preceding installments; did you noticed them?

{% include learn-coding-with-dot-net-core-6/intro-series.md %}<!--more-->

## Comments

There are three types of comments in C#:

-   Single-line
-   Multiline
-   XML documentation comments, also known as _triple-slash comments_.

In this article, we will only explore the first two.
We can use the third style to document our code, but we don't know how to create such code; yet.

We can use comments to leave notes in the source code.
As a beginner, comments can be handy.
The more you progress, the clearer your code will become and the less needed the comments are gonna be.

> **More info:** I usually recommend to intermediate developers to write as close to zero comments as possible in their code.
> Comments too often become outdated and forgotten.
>
> For example, the code change, but the comment remain the same.
> In that case, the comment describes the first version of the code, but the second version does something else.
> This is the kind of situation that can lead a third developer in the wrong direction.
> Both the code and the comment can contradict themselves.
>
> On the other hand, comments can be useful to lay out ideas and algorithms, especially as a beginner.
> They can also be an excellent tool to reorganize logic into cohesive units.
> We can also use comments to diagnose and debug a feature.
> Enough of that; I'll most likely talk about that in future articles, in a more exciting context.

Next, let's have a look at the first style that we are covering in this article.

### Single-line comments

We can write a single-line comment by writing `//`.
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

As you can see, the comments are not executed or outputted. They are there only to inform the programmer about the code.

Next, let's look at multiline comments.

### Multiline comments

Multiline comments are like their name implies: they can cover multiple lines.
Unlike single-line comments, multiline comments have an opening and a closing sequence of characters.
Everything in between those two tokens is a comment.
We can open a multiline comment with `/*` and close it with `*/` (same characters in the inverted order).

> **Hint:** The numpad of a _standard keyboard_ makes it very easy to open and close a multiline comment in a smooth sequence of keystrokes: `/` -> `*` -> `*` -> `/` -> move your arrow between the two `*`, hit `enter` or write your comment.

Here are a few examples:

```csharp
/* This is a multiline comment, but only on one line; please don't do what I did with the following line in your code, it is just an example. */
const/* This */string/* can */tmp/* be */=/* almost */"SOME TEXT"/* anywhere, */;/* as long as you don't break any token */
//
// We can also use single-line comments; one does not block the usage of the other.
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

Once again, the comments are not executed or outputted. They are there only to inform the programmer about the code.
Moreover, as you may have noticed, multiline comments don't have to cover multiple lines.
Unlike the single-line comments that start from `//`, commenting the text until the end of that line, we can use multiline comments to comment out only a part of a line.

And voilà! You have made another step toward learning to program.

## Conclusion

Comments are a tool to annotate and leave notes inside the code.
We can write single-line comments beginning with `//`, and we can write multiline comments between `/*` and `*/`.

One essential thing to understand about comments is to use them to describe the functionally, not the code itself.
For example, explaining to a C# programmer using a comment that `var text = "whatever";` creates a variable named `text` is not helpful.
But explaining that the following block of code is an implementation of the XYZ algorithm could be.
As I mentioned, at some point, you want to aim at writing clear enough code that you don't need to explain it.
That said, as a beginner, please leverage comments to help you out.
You can describe your code if that helps you remember or understand for example.
Everyone learns differently.
There is no wrong with how to learn, so if using comments helps you, please do!
If you don't know, experiment with techniques and keep what works best for you, only you can find this part out.

{%- include learn-coding-with-dot-net-core-6/next.md nextIndex=5 -%}

### Table of content

{%- include learn-coding-with-dot-net-core-6/toc.md currentIndex=4 -%}
