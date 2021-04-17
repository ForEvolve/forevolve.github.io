---
title: 'Escaping characters in C# strings'
subtitle: 'A beginner guide to programming with .NET 5 and C#'
date: 2021-04-11 00:00:00 -0500
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

In this article, we look at escaping characters in C# strings.
But what is escaping you may wonder?
That's how we write special characters or characters that would otherwise be impossible to include in a string, like `"`.

{% include learn-coding-with-dot-net-core/intro-series.md %}<!--more-->

## Escaping characters

As mentioned in the introduction, the action of escaping characters means you write an "escape sequence" to represent certain character.
An escape sequence is a `\` followed by a character or a series of numbers representing the unicode character code.

Here are a few examples:

```csharp
using System;

var quotes = "Wrap \"a few words\" with quotes.";
var newLine = "Add a\nnew line.";
var tab = "\tAdd a tab at the begining of the string.";
var e = "This is the letter e: \u0065";

Console.WriteLine(quotes);
Console.WriteLine(newLine);
Console.WriteLine(tab);
Console.WriteLine(e);
```

When we run the previous code, we obtain the following result:

![Code sample's console output](//cdn.forevolve.com/blog/images/2021/2021-04-output-escaped-characters.png)

If we take a closer look:

-   We can write `\"` to insert a `"` character inside a string, which would be impossible otherwise.
-   We can use the special `\n` to insert a new line (see below for more special characters).
-   We can use the special `\t` to insert an horizontal tab (see below for more special characters).
-   We can use the unicode representation of a character, prefixed by `\u`, to insert that character into a string (UTF-16 or UTF-32).

In my opinion, the most useful special characters are:

| Escape sequence | Character name                                        | Example                                                                            |
| --------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `\'`            | Single quote                                          | Not related to `string` but to `char`, like <br>`var q = '\'';` (not covered yet). |
| `\"`            | Double quote                                          | See preceding example.                                                             |
| `\\`            | Backslash                                             | `var s = "c:\\folder\\some-file.ext";`                                             |
| `\n`            | New line                                              | See preceding example.                                                             |
| `\r`            | Carriage return                                       | Read the OS specific line break section                                            |
| `\t`            | Horizontal tab                                        | See preceding example.                                                             |
| `\u0000`        | Unicode escape sequence (UTF-16)                      | To write the character `e`: `\u0065`                                               |
| `\U00000000`    | Unicode escape sequence (UTF-32)                      | To write the character `e`: `\U00000065`                                           |
| `\x0[0][0][0]`  | Unicode escape sequence (UTF-16) with variable length | To write the character `e`: `\x65`                                                 |

> See [String Escape Sequences](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/strings/#string-escape-sequences) for more.

## OS specific line break

Windows line breaks are different from other OS.
Windows uses a sequence of both _carriage return_ and _new line_ (`\r\n`) while Unix platforms uses only _new line_ (`\n`).
Windows will understand `\n` in most cases.
In a cross-platform app targeting both Windows and Unix, we can use the `Environment.NewLine` variable to be OS-specific and avoid leaving Windows to interpret what we want.

Here is an example (same output as the `newLine` variable of the preceding example):

```csharp
using System;
Console.WriteLine($"Add a{Environment.NewLine}new line."); // We leveraged interpolation here
```

We can simplify this, by leveraging the `string.Format` method

## string.Format

We can use `string.Format` which is also supported directly through `Console.WriteLine`, like this:

```csharp
using System;
var newLine = string.Format("Add a{0}new line.", Environment.NewLine);
Console.WriteLine(newLine);
Console.WriteLine("Add a{0}new line.", Environment.NewLine);
```

When running the code, all `Console.WriteLine` output the same result.
The advantage here is to write `{0}` every time that we need a line break instead of `{Environment.NewLine}` or worst using concatenation like `"Add a" + Environment.NewLine + "new line."`.

But how does that work?

TODO: define string,format, etc.

## Interpolation-specific escaping

Escaping `{` and `}` (interpolation)

...

## The verbatim identifier

-   verbatim identifier (@) see: https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/tokens/verbatim
-   Multiline-specific: Escaping `"`

...

## Exercise

???

## Conclusion

In this article, ...

{%- include learn-coding-with-dot-net-core/next.md nextIndex=8 -%}

### Table of content

{%- include learn-coding-with-dot-net-core/toc.md currentIndex=7 -%}
