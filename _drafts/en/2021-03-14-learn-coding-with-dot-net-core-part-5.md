---
title: 'How to read user inputs from a console'
subtitle: 'A beginner guide to programming with .NET 5 and C#'
date: 2021-03-14 00:00:00 -0500
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

In this article we explore how to read user inputs from the console.
This article is the foundation of more dynamic notions enabling our programs to change based on user interactions and react to them.

{% include learn-coding-with-dot-net-core/intro-series.md %}<!--more-->

## User input

So far, we used the `Console.Write` and `Console.WriteLine` methods to write to the console.
We also created variables and constants to hold and reuse some text.
However, we don't know how to interact with the user yet.

There are multiple type of application, like web apps, mobile apps, and windows apps.
In our case, we will continue to use console applications because they are the simplest.
We don't need to bother with complex user interfaces, animation, or interaction, and we can focus on learning to program.

> Console apps may feel less exciting, but that allows us to focus on only one subject at a time.
> Remember that every piece of knowledge that you are acquiring is like a new LEGO<sup>&reg;</sup> block that you'll be able to piece with the others later.
> Moreover, what you are learning in this series is reusable in most, if not all, other type of apps.

There are three methods offered by the `Console` class to read user inputs, `Read`, `ReadKey`, and `ReadLine`.
The first two can be used for more complex scenarios while the third one is very straight forward, which is the method we are focusing on in this article.

As its name implies, `Console.ReadLine` reads the line entered by the user.
It is simple and gives us the power to accomplish what we need, to learn the basic concepts of programming.

## Reading a line entered by a user

The `Console.ReadLine` method returns a `string`, which represent the line written in the console by the user.
Here is an example:

```csharp
using System;

Console.Write("Please enter a greeting message then press ENTER: ");
var hello = Console.ReadLine();
Console.WriteLine(hello);
```

In the preceding code, we write a message to the user, then wait for the user to enter some message.
The program will block its execution there, until the user hit the `<ENTER>` key.
At this point, it will resume and continue, then write the read line back to the console.

Here is the console content when running the program and entering `Hello Amigo!<ENTER>`:

```plaintext
Please enter a greeting message then press ENTER: Hello Amigo!
Hello Amigo!
```

> **More info:** it is important to note that the _new line character_ (the `<ENTER>`) is not part of the line (not saved in the `hello` variable).

Now that we saw an example, let's explore the flow of execution of the program.

## Flow of execution

The program flow, or flow of execution, represents the order in which the instructions (lines of code) are executed.
In our case, the program is linear; it starts at the top and end at the bottom of the `Program.cs` file.
Nevertheless, the `Console.ReadLine()` method blocks the program, waiting for a user input, which disturbs the flow.

Here is what happens:

![Code sequence](//cdn.forevolve.com/blog/images/2021/2021-03-00-learn-to-code-input-2.png)

1. The program writes the question to the console.
1. The program executes the right-end of the assignation operator (`=`), the `Console.ReadLine()` method, which waits for the user to hit the `<ENTER>` key.
    > **More info:** The assignation operator `=` is always the last to be executed, it has the lowest priority.
1. The user types `Hello Amigo!` then hit `<ENTER>`.
1. The program then resumes and assigns the user-entered value to the `hello` variable.
1. The program writes that input back to the console.

Here is a second way to visualize this flow:

![Code sequence graph](//cdn.forevolve.com/blog/images/2021/2021-03-00-learn-to-code-input-graph-5.png)

In this case, the `Console.ReadLine()` method manages the bifurcation even if code-wise, the flow is linear.

> **Note:** We will learn ways to control the flow of a program in future articles.

Next, it is your turn to try this out.

## Exercise

To practice all that we explored so far, including user-inputs, you must write a program that asks the following two questions to the user:

1. `What is your first name?`
1. `What is your last name?`

Then, the program must greet that user, using the following format: `Greetings {first name} {last name}!`.

> **Example:** Assuming the user entered `Carl-Hugo` as the first name and `Marcotte` as the last name, the greeting message would read `Greetings Carl-Hugo Marcotte!`.

Here are a few optional hints, if you feel stuck:

{%- capture hintContent -%}Ask the first question, read the input, then repeat the same process for the second question.{%- endcapture -%}
{%- assign hintContent = hintContent | markdownify -%}
{%- include spoiler.html title="Hint 1" content=hintContent -%}

{%- capture hintContent -%}Create two variables, one for the first name and one for the last name.{%- endcapture -%}
{%- assign hintContent = hintContent | markdownify -%}
{%- include spoiler.html title="Hint 2" content=hintContent -%}

{%- capture hintContent -%}Use primarily `Console.Write` to write the text to the console.{%- endcapture -%}
{%- assign hintContent = hintContent | markdownify -%}
{%- include spoiler.html title="Hint 3" content=hintContent -%}

Once you are done, you can compare with `My Solution` below.

{%- capture solutionContent -%}**Program.cs**

```csharp
using System;

Console.Write("What is your first name? ");
var firstName = Console.ReadLine();

Console.Write("What is your last name? ");
var lastName = Console.ReadLine();

Console.Write("Greetings ");
Console.Write(firstName);
Console.Write(" ");
Console.Write(lastName);
Console.WriteLine("!");
```

Don't worry if your solution is different than mine.
As long as you completed it, it means you understood the lesson or at least practiced.
Practicing is the key to success!
{%- endcapture -%}
{%- assign solutionContent = solutionContent | markdownify -%}
{%- include spoiler.html title="My Solution" content=solutionContent -%}

Good job! You are done with another small chapter of your programming journey.

## Bonus information

In this short section we explore two more manipulation of the console:

-   How to set its title.
-   How to clear what is written in it.

### Setting a custom console title

If you want to change the console title, you can set the `Console.Title` property to the string of your choice, like this:

```csharp
Console.Title = "IntroToDotNet";
```

Pretty straight forward, isn't it?
Next, let's see how to clear the text from the console.

### Clearing the console

One last bit of knowledge here, we can clear the console using the `Console.Clear()` method.
So instead of the following output:

```plaintext
What is your first name? Carl-Hugo
What is your last name? Marcotte
Greetings Carl-Hugo Marcotte!
```

We could clear the console between each question to obtain the following flow:

![Adding Console.Clear calls](//cdn.forevolve.com/blog/images/2021/2021-03-00-learn-to-code-input-ConsoleClear-2.gif)

Here is the code to achieve that result:

{%- capture solutionContent -%}**Program.cs**

```csharp
using System;

Console.Title = "IntroToDotNet"; // Custom title

Console.Write("What is your first name? ");
var firstName = Console.ReadLine();
Console.Clear(); // Clear after the first question

Console.Write("What is your last name? ");
var lastName = Console.ReadLine();
Console.Clear(); // Clear after the second question

Console.Write("Greetings ");
Console.Write(firstName);
Console.Write(" ");
Console.Write(lastName);
Console.WriteLine("!");
```

{%- endcapture -%}
{%- assign solutionContent = solutionContent | markdownify -%}
{%- include spoiler.html title="Console.Clear Solution" content=solutionContent -%}

And that's it for this article.

## Conclusion

In this article we explored how to read user inputs from the console.
We used the `ReadLine` method to acquire the value a user wrote before hitting the `<ENTER>` key.
This is the foundation of the next many articles where we will use this to acquire data from the user and treat that data and do something with it!

We also looked at how to change the title of the terminal window, because why not, right?
Finally, we explored how to clear the text to reset the console to an empty state.
This second interlude can be very handy at crafting an interesting user experience (UX).

{%- include learn-coding-with-dot-net-core/next.md nextIndex=6 -%}

### Table of content

{%- include learn-coding-with-dot-net-core/toc.md currentIndex=5 -%}
