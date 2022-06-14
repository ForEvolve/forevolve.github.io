---
title: 'Escaping characters in C# strings'
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

In this article, we look at escaping characters in C# strings.
But what is escaping, you may wonder?
That's how we write special characters or characters that would otherwise be impossible to include in a string, like `"`.

{% include learn-coding-with-dot-net-core-6/intro-series.md %}

{% include learn-coding-with-dot-net-core-6/sub-series.md firstPart=6 %}<!--more-->

## Escaping characters

As mentioned in the introduction, the action of escaping characters means you write an "escape sequence" to represent specific characters.
An escape sequence starts with a `\`. It is followed by a character or a series of numbers representing the Unicode character code.

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
-   We can use the special `\t` to insert a horizontal tab (see below for more special characters).
-   We can use the Unicode representation of a character, prefixed by `\u`, to insert that character into a string (UTF-16 or UTF-32).

In my opinion, the most helpful special characters are:

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

> See [String Escape Sequences](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/strings/#string-escape-sequences) for some more characters.

Next, we explore line break.

## Platforms-specific line break

In case you did not know, Windows line breaks are different from Unix-based platforms.
Windows uses a sequence of both _carriage return_ and _new line_ (`\r\n`) while Unix uses only a _new line_ (`\n`).
Windows is pretty forgiving and will most likely understand `\n`.
Nevertheless, in a cross-platform app targeting both Windows and Unix (e.g., Linux and Mac), do you really want to leave line breaks to chance?
To save the day, we can use the `Environment.NewLine` property instead, which adapts to the current OS.

Here is an example (same output as the `newLine` variable of the preceding example):

```csharp
using System;
Console.WriteLine($"Add a{Environment.NewLine}new line."); // We leveraged interpolation here
```

If we have many line breaks, this can become tedious.
Hopefully, we can simplify this by leveraging the `string.Format` method we cover next.

## string.Format

We can use the `string.Format` method to format a string.
It is similar to interpolation, but instead of inserting the variables directly, we need to define numerical tokens, like `{0}`, `{1}`, `{2}`, and so forth.
Then, we pass arguments that match those tokens in the correct order to get the final result.

Many other .NET methods allow such a construct, including `Console.WriteLine`.
Here is an example of both `string.Format` and `Console.WriteLine`:

```csharp
using System;
var newLine = string.Format("Add a{0}new line.", Environment.NewLine);
Console.WriteLine(newLine);
Console.WriteLine("Add a{0}new line.", Environment.NewLine);
```

When running the code, both `Console.WriteLine` output the same result.
The advantage here is writing `{0}` every time we need a line break.
Of course, we could use interpolation with `{Environment.NewLine}` directly, but it makes the string longer.
Even worst, we could use concatenation like `"Add a" + Environment.NewLine + "new line."`; I find this to be the hardest code to read, making the string even longer.

**But how does that work?**
In the background, the framework replaces the numerical tokens with the specified arguments.

There are more to `string.Format`, including the possibility to format your values, but that's getting more and more out of the scope of our main subject.
Next, we look at escaping characters in interpolated strings.

## Interpolation-specific escaping

{% raw %}
In an interpolated string, we use the characters `{` and `}` to wrap the element to insert, like a variable.
What if we want to write those characters?
It is as easy as doubling them.
For `{`, we write `{{`.
For `}`, we write `}}`.
{% endraw %}

Here is an example:

{% raw %}

```csharp
var name = "Darth Vader";
var greetings = $"{{Hello {name}}}";
Console.WriteLine(greetings);
```

{% endraw %}

As simple as that, the preceding code will output `{Hello Darth Vader}`.
Next, let's have a look at the verbatim identifier (a.k.a. multiline strings).

## The verbatim identifier

The verbatim identifier (`@`) allows us to write multiline strings, but it's not all.
It also disables the escaping of characters, which can be very handy when writing file paths (amongst other things).
In other words, a backslash is just a backslash, not a special character that starts an escape sequence.
For example, it is more convenient to write `var path = @"c:\folder\some-file.ext";` than `var path = "c:\\folder\\some-file.ext";` (simple vs double backslash).

**Since `\[character]` does not work, how can we escape `"`?**
Like with interpolation, we only have to double it, like `var v = @"Some ""quoted words"" here.";`

The verbatim identifier can also be used to escape reserved keywords, like `if`, `for`, `public`, etc.
For example, if you'd like to create a variable named `public`, you can't write `var public = "some value";` because this won't compile.
However, you could prefix your variable name with `@` to make it work, like this: `var @public = "some value";`.
Using this makes your code a little harder to read, but that's a trick that can come in very handy sometimes.

> **More info:** one place where it was handy was to create `class` attributes in an old ASP.NET MVC version because `class` is a reserved keyword: we had to escape it using the verbatim identifier.

> **Reference:** if you want to know more about reserved keywords, please visit the [C# Keywords](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/) page in the official documentation.

Next, it's your turn to try it out.

## Exercise

In this exercise, you will write a program that writes code.
The code to write is the content of the `Program.cs` file generated by the `dotnet new console` template. We include all the more or less useful plumbing that we removed in the first article of the series.
**Why?** Well, you will have to write different tokens, escape characters, and be creative to generate that.
Writing code in code can be more challenging than it looks.

To make it a little more complicated, you must ask the user to enter its first and last name, which you will have to embed in the generated code.
Here is the expected result (animated sequence):

![Expected program output](//cdn.forevolve.com/blog/images/2021/2021-04-18-exercise.gif)

The textual output was:

```csharp
using System;

class Exercise
{
    public static void Main()
    {
        var firstName = "Carl-Hugo";
        var lastName = "Marcotte";
        Console.WriteLine();
        Console.WriteLine("Hello {0} {1}", firstName, lastName);
    }
}
```

The spacing at the beginning of the lines (indentation) must be tabs, not spaces, like this:

![Expected program output](//cdn.forevolve.com/blog/images/2021/2021-04-18-exercise-tabs.png)

> As a side note, I usually indent my code using spaces because that's what Visual Studio and VS Code do by default.
> I hit tab, and it gets converted to the configured number of spaces; very convenient.
> For the sake of this exercise, I wanted to add a little complexity, so I piked the tab character.
> Since you are most likely very new to programming, you may not know that for some people, indenting using spaces or tabs is vital; war-like important :wink:.

Now, to your keyboard!

Here are a few optional hints in case you feel stuck:

{%- capture hintContent -%}You can use `$@"..."` to combine both interpolation and multiline string but beware the tab characters will be harder to fit in. You can use other techniques too and even combine them.{%- endcapture -%}
{%- assign hintContent = hintContent | markdownify -%}
{%- include spoiler.html title="Hint 1" content=hintContent -%}

{%- capture hintContent -%}In a multiline string, doubling the character escapes them. Otherwise, the `\` character can escape special characters or create tabs and line breaks.{%- endcapture -%}
{%- assign hintContent = hintContent | markdownify -%}
{%- include spoiler.html title="Hint 2" content=hintContent -%}

Once you are done, you can compare with `My Solution` below.

{%- capture solutionContent -%}**Program.cs**
{% raw %}

```csharp
using System;

Console.Title = "IntroToDotNet";

Console.Write("What is your first name? ");
var firstName = Console.ReadLine();
Console.Clear();

Console.Write("What is your last name? ");
var lastName = Console.ReadLine();
Console.Clear();

var tab = "\t";
var solution = $@"using System;

class Exercise
{{
{tab}public static void Main()
{tab}{{
{tab}{tab}var firstName = ""{firstName}"";
{tab}{tab}var lastName = ""{lastName}"";
{tab}{tab}Console.WriteLine(""Hello {{0}} {{1}}"", firstName, lastName);
{tab}}}
}}";
Console.WriteLine(solution);
```

Another alternative would have been to only use interpolation, which results in this very long line:

```csharp
var solution = $"using System;\n\nclass Exercise\n{{\n\tpublic static void Main()\n\t{{\n\t\tvar firstName = \"{firstName}\";\n\t\tvar lastName = \"{lastName}\";\n\t\tConsole.WriteLine(\"Hello {{0}} {{1}}\", firstName, lastName);\n\t}}\n}}";
```

{% endraw %}
You could have used so many combinations that I can't list them all here.
If you succeeded, that's what is important; no matter how you did it.

{%- endcapture -%}
{%- assign solutionContent = solutionContent | markdownify -%}
{%- include spoiler.html title="My Solution" content=solutionContent -%}

Good job! You completed another small chapter of your programming journey.

## Conclusion

In this article, we explored the string type a little more.
We discovered that the backslash character (`\`) is used to escape characters or to create special characters like tabs (`\t`) and line breaks (`\r` and `\n`).
We then learned about the `Environment.NewLine` property that gives us the correct platforms-specific line break.
We also peaked at `string.Format` to format strings using numerical tokens instead of interpolation.

Afterward, we explored some edge cases to escape `{` and `}` in interpolated strings and `"` in multiline strings.
The solution was to double the characters; a.k.a. write `""` to obtain `"`.
We saw that in `@"..."` strings, the escape character (`\`) does not work, which is an advantage that can become a disadvantage.
We finally learned to use the verbatim identifier (`@`) to bypass the reserved keywords limitation and use it as an escape character for identifiers.

All in all, that's a lot of new content that concludes our introduction to strings mini-sub-series.

{%- include learn-coding-with-dot-net-core-6/next.md nextIndex=9 -%}

### Table of content

{%- include learn-coding-with-dot-net-core-6/toc.md currentIndex=8 -%}
