---
title: 'Introduction to string concatenation'
subtitle: 'A beginner guide to programming with .NET 5 and C#'
date: 2021-03-21 00:00:00 -0500
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

In this article, we dig a little more into the `string` type.
We also explore how to concatenate (combine) strings.
As a programmer, you will often need to manipulate strings; concatenation and interpolation being two recurring themes.
We will cover interpolation in the next installment.

{% include learn-coding-with-dot-net-core/intro-series.md %}<!--more-->

## Strings

In C#, a string is a sequence of characters that is delimited by the `"` character.
We used strings in previous articles to write text to the console.

Here is an example of a string:

```csharp
var name = "Superman";
```

Next, we explore multiline strings.

### Multiline strings

We can also create multiline strings by prefixing the string with the `@` character.

Here is an example of a multiline string:

```csharp
var name = @"This
is
a
multiline
string!";
// More code here...
```

But keep an eye open for details.
For example, in the following code the first and last characters are a _new line_, which may not be what you were expecting to write.

```csharp
var name = @"
This
is
a
multiline
string!
";
// More code here...
```

This can be very handy in different scenarios where you don't want to use concatenation, for example.
As an introduction to strings, I will not get into too many more details.
However, there is many methods to manipulate strings, compare it contains, or how to optimize its usage.

Next, we look into concatenation.

## Concatenation

Concatenation is the action of pieces multiple strings together to make a new one; combine strings if you wish.
The concatenation operator is the `+` symbol.
The `+` operator combine both string operands (the values on the left and right side of it) into a new string.
Let's look into an example to make learning easier:

```csharp
var concatenatedString = "Greetings " + "from .NET!";
Console.WriteLine(concatenatedString);
```

The preceding code combines the strings `"Greetings "` and `"from .NET!"` into `"Greetings from .NET!"`.

> **Note** the space after the word `Greetings`. Without it, the combined string would have been `"Greetingsfrom .NET!"`.

Another way to do it, which is most likely to happen than what we just did, is to assign a value to a variable, then update that value.
Here is an example of that:

```csharp
var concatenatedString = "Greetings ";
concatenatedString = concatenatedString + "from .NET!";
Console.WriteLine(concatenatedString);
```

The preceding code do the same, but in two steps (bullets 1 and 2):

1. The value `"Greetings "` is assigned to the `concatenatedString` variable.
1. The value `"from .NET!"` is add at the end of the `concatenatedString` variable.
1. The program writes `"Greetings from .NET!"` to the console.

Let's look more into the line `concatenatedString = concatenatedString + "from .NET!";` as it may be harder to understand.

> **Reminder:** the assignation operator (`=`) has the lowest priority, so the code on the right (the right-hand operand) is processed first.

Here is an image to help analyse the code:

![Code execution order](https://cdn.forevolve.com/blog/images/2021/2021-learn-to-code-part-6.1.png)

1. The program ready the literal string `"Greetings "` for step 2.
1. The program assigns the value of the right-hand operand (`"Greetings "`) to the `concatenatedString` variable.
1. The program ready the current value of the `concatenatedString` variable for step 5.
1. The program ready the literal string `"from .NET!"` for step 5.
1. The program concatenate (combine) the two strings into a new one.
1. The program assigns the value of the right-hand operand (`"Greetings from .NET!"`) to the `concatenatedString` variable, replacing its value.

> **Note:** You can see the steps 3 to 5 as evaluated first, like one big step, then the program continues at step 6.

Now that we covered that, there is a shortcut to this process, using the `+=` operator.
You can see the `+=` operator as a combination of both the `+` and the `=`.
The previous example, using the `+=` operator would look like this:

```csharp
var concatenatedString = "Greetings ";
concatenatedString += "from .NET!";
Console.WriteLine(concatenatedString);
```

The second line of the preceding code is simplified.
It does the same, without the need to specify that `concatenatedString = concatenatedString + [something else]`.
This new syntax remove unneeded pieces, reducing the length of the line of code, possibly even making it easier to read.

Enough of this, next, its your turn to try it out.

## Exercise

To practice concatenation, we will code the exercise of the previous article, with a twist.
You must ask for the first and last name of the user, then you must use concatenation to output the result using a single `Console.WriteLine` call.

Here is the previous solution, including the `Title` and `Clear` additions:

```csharp
using System;

Console.Title = "IntroToDotNet";

Console.Write("What is your first name? ");
var firstName = Console.ReadLine();
Console.Clear();

Console.Write("What is your last name? ");
var lastName = Console.ReadLine();
Console.Clear();

// TODO: rewrite the following code
Console.Write("Greetings ");
Console.Write(firstName);
Console.Write(" ");
Console.Write(lastName);
Console.WriteLine("!");
```

Here are a few optional hints if you feel stuck:

{%- capture hintContent -%}You can concatenate multiple values back to back, like this:

```csharp
var greetings = "Greetings " + "Carl-Hugo" + " " + "Marcotte" + "!";
```

{%- endcapture -%}
{%- assign hintContent = hintContent | markdownify -%}
{%- include spoiler.html title="Hint" content=hintContent -%}

Once you are done, you can compare with `My Solution` below.

{%- capture solutionContent -%}**Program.cs**

```csharp
using System;

Console.Title = "IntroToDotNet";

Console.Write("What is your first name? ");
var firstName = Console.ReadLine();
Console.Clear();

Console.Write("What is your last name? ");
var lastName = Console.ReadLine();
Console.Clear();

// Only the following code changed
var greetings = "Greetings " + firstName + " " + lastName + "!";
Console.WriteLine(greetings);
```

An alternative style would have been the following:

```csharp
var greetings = "Greetings ";
greetings += firstName;
greetings += " ";
greetings += lastName;
greetings += "!";
Console.WriteLine(greetings);
```

Both styles would have yield the same results and both are acceptable.

> **But which one to pick?** Pick the style that you prefer or the style that is the more suitable for the program that you are building.
> You don't always have all the values at the beginning, making the second style more suitable.

Don't worry if your solution is different than mine.
As long as you completed it, it means you understood the lesson or at least practiced.
Practicing is the key to success!
{%- endcapture -%}
{%- assign solutionContent = solutionContent | markdownify -%}
{%- include spoiler.html title="My Solution" content=solutionContent -%}

Good job! You completed another small chapter of your programming journey.

## Conclusion

In this article, ...

{%- include learn-coding-with-dot-net-core/next.md nextIndex=7 -%}

### Table of content

{%- include learn-coding-with-dot-net-core/toc.md currentIndex=6 -%}
