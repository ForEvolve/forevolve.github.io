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

In the article {% include learn-coding-with-dot-net-core/ref.md index=4 %}, we talked about the flow of a program, moving from the first instruction to the next.
Here, we are exploring how to run only part of the code, based on different values.

By writing conditional code blocks, we can create a program that actually have more complex logic than a linear flow than what we programmed so far.

Let's now explore how to program that using C#.

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
Because of that, if we execute the code, .NET will report an error telling us `The name 'b' does not exist in the current context`.

Let's explore why I indented the code inside the block before writing our first conditional code block using the `if` statement.

#### Indentation

Have you noticed the indentation added inside the statements block?
By convention, we add that indentation for readability.
That makes the different contexts (or nested-levels) line up vertically, like this:

![indentation of a statements block](//cdn.forevolve.com/blog/images/2021/indentation-of-a-statements-block.png)

In C#, we usually use 4 spaces to indent the code.
People may also use 2 spaces (not frequent in the .NET/C# world).
Some people also prefers to use tabs instead of spaces.
By default, Visual Studio and Visual Studio Code will translate a tab to _N_ spaces automatically (default: 4), so you don't have to type 4 spaces every time; one tab will do.
That default can also be configured.

> **"Fun" fact":** A tabs versus spaces war also exists where people prefer tabs over spaces or vice versa and argue that their way is the best over the other.
> I personally use spaces, tried tabs, tried many technique during the years, and realized that it does not matter much in the end.
> If you are working in a team or an enterprise, there may well be existing guidelines around this.

Next, we explore the `if` statement.

### The `if` statement

The `if` statement does literally what its English definition is: **if the _condition_ is true, then enter the statements block; otherwise, don't**.
This is where we begin to put that Boolean algebra to good use.
The syntax goes like this:

```csharp
if (condition)
{
    // Do something when condition is true
}
```

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

In the preceding code, `input == "GO"` represents the condition that evaluates to a boolean result.
When running the program, if the user enters `GO` (uppercase), the program will print `The user entered GO!`, otherwise, it will skip that code block.
Here is a running example:

![if statement program execution](//cdn.forevolve.com/blog/images/2021/2021-06-05-if-statement-program-execution.gif)

As we can see from that recording, if we enter something else than `GO`, the program skips the statements block.
Here is the visual representation of this program flow when the user enters `GO`:

![Visual representation of the program flow when the user enters GO](//cdn.forevolve.com/blog/images/2021/GO-condition-true.png)

Here is the visual representation of this program flow when the user enters `NOT GO`:

![Visual representation of the program flow when the user enters NOT GO](//cdn.forevolve.com/blog/images/2021/GO-condition-false.png)

> **Note:** in the preceding diagrams, the part that are not executed are grayed out.

But what happens if we want something different to happen if the input is not `GO` while keeping this logic?
This is what the `else` statement is for.

### The `else` statement

The `else` statement must follow an `if` statement block (or an `else if` block; see bellow).
We can't write an `else` block alone.

The `else` statements block is the fallback of an `if` block.
The syntax goes like this:

```csharp
if (condition)
{
    // Do something when condition is true
}
else
{
    // Do something when condition is false
}
```

In the next example, we put that to good use and display `Console.WriteLine("The user did not enter GO!");` when the input is different than `"GO"`.
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
However, we can remove that second comparison `input != "GO"` by leveraging the `else` statement instead.
This will a) remove that comparison (slightly improve performance) and b) make our program more maintainable by removing the duplicated logic.

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
With them, we can execute only certain statements blocks based on runtime values; like value entered by the user.

Here is the visual representation of this program flow when the user enters `GO`:

![Visual representation of the program flow when the user enters GO](//cdn.forevolve.com/blog/images/2021/GO-condition-true-if-else.png)

Here is the visual representation of this program flow when the user enters `NOT GO`:

![Visual representation of the program flow when the user enters NOT GO](//cdn.forevolve.com/blog/images/2021/GO-condition-false-if-else.png)

> **Note:** in the preceding diagrams, the part that are not executed are grayed out.

Ok, but what happens when we want to write a different message if the user enters `SHOW ME`?
That's what we are exploring next using the `else if` statement.

### The `else if` statement

The `else if` statement is a follow up `if` statement if you wish.
As we saw in the preceding section, we can have two `if` statement back to back and they are independent of each other.
However, the `else if` statement allows to add another conditional block after the `if`, but the condition will only be evaluated if the previous block was `false`.
We can chain as many `else if` statements as we need.
An `else` statement can optionally go last; after all `else if` blocks.

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

We could do this only with `if` statements, but as you can see below, it can get complicated:

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
if (input != "GO" && input != "SHOW ME") // <--
{
    Console.WriteLine("The user did not enter GO nor SHOW ME!");
}
Console.WriteLine("End of the program.");
```

By looking at the preceding code, we can see that the more logic we add, the more complex the `else`-like block becomes (the `if` line marked by a `<--` comment).
Here we have to conditions (`input == "GO"` and `input == "SHOW ME"`) so we must make sure that both are `false` before executing the default block (`input != "GO" && input != "SHOW ME"`).

> **Tips:** I strongly advice against writing that type of code as it can get out of hand very quickly.
> In this case, seeing it first hand will allow you to identify such code.
> Always aim at simplicity and readability.

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

As we can see from the preceding code block, using `if`, `else if`, then `else`, allowed us to get rid of the complex condition that was negating the other two conditions.
This code is still simple, but think about adding more and more conditions.
By doing so, the last `if` would become hard to maintain, error-prone, and hard to read.
Moreover, all conditions would be duplicated; once for its own `if` block and negated for that last `if`.

Using an `else` statement just makes our life easier, so why not, right?
Anyway, running any of those two programs results in the following execution flow:

![else if statement program execution](//cdn.forevolve.com/blog/images/2021/2021-06-05-else-if-statement-program-execution.gif)

Now, let's explore how the code is evaluated.
Those two small sets of differences change many things in the execution flow, as demonstrated in the following image:

![else if diff order execution flow](//cdn.forevolve.com/blog/images/2021/2021-else-if-diff-order-all-annotations.png)

In the preceding image, we can noticed that each condition is evaluated (on the left) while the conditions are evaluated only when the previous one was false (on the right).
This is the big difference between using `if—else if—else` or not.

To make it easier to understand, let's compare the steps depicting the scenario of a user typing `GO` (`input == "GO"`):

![else if diff order execution flow when input equals GO](//cdn.forevolve.com/blog/images/2021/2021-else-if-diff-order-input-equals-go.png)

Let's start by looking into the steps on the left:

1. The first few lines are executed.
2. The first `if` is evaluated to `true`.
3. The program writes a line to the console.
4. The second `if` is evaluated to `false`.
5. The third `if` is evaluated to `false`.
6. The program writes a line to the console.

Let's now compare this with the steps on the right:

1. The first few lines are executed.
2. The first `if` is evaluated to `true`.
3. The program writes a line to the console.
4. The program writes a line to the console.

In that second execution flow, only the first `if` is evaluated.
The program skips the evaluation of the `else if` statement and _jumps over_ both the `else if` and `else` blocks.

Here is the visual representation of this program flow when the user enters `GO`:

![Visual representation of the program flow when the user enters GO](//cdn.forevolve.com/blog/images/2021/GO-condition-if-elseif-else.png)

Here is the visual representation of this program flow when the user enters `SHOW ME`:

![Visual representation of the program flow when the user enters SHOW ME](//cdn.forevolve.com/blog/images/2021/SHOW-ME-condition-if-elseif-else.png)

Here is the visual representation of this program flow when the user enters `NOT GO`:

![Visual representation of the program flow when the user enters NOT GO](//cdn.forevolve.com/blog/images/2021/NOT-GO-condition-if-elseif-else.png)

> **Note:** in the preceding diagrams, the part that are not executed are grayed out.

Now that we explored all of that, it is time for you to practice.

## Exercise

You must write a program that:

-   Asks the user to input his first name.
-   Asks the user to input his last name.
-   If the user enters your first name and last name, write `Hey! that's me!` to the console.
-   If the user enters any other names combination, write `Hello, FIRST_NAME, LAST_NAME` where `FIRST_NAME` and `LAST_NAME` are the names the user entered.

Here are a few optional hints in case you feel stuck:

{%- capture hintContent -%}If you don't remember how to ask a user of his input, have a look at {% include learn-coding-with-dot-net-core/ref.md index=4 %}.{%- endcapture -%}
{%- assign hintContent = hintContent | markdownify -%}
{%- include spoiler.html title="Hint 1" content=hintContent -%}

{%- capture hintContent -%}There are multiple ways of implementing this solution.
However, an `if` followed by an `else` blocks should be a good start.{%- endcapture -%}
{%- assign hintContent = hintContent | markdownify -%}
{%- include spoiler.html title="Hint 2" content=hintContent -%}

{%- capture hintContent -%}The AND operator (`&&`) and the equality operator (`==`) will allow you to combine both conditions (first name and last name) into one.
Feel free to have a look at {% include learn-coding-with-dot-net-core/ref.md index=8 %} if you need a reminder on logical operators.{%- endcapture -%}
{%- assign hintContent = hintContent | markdownify -%}
{%- include spoiler.html title="Hint 3" content=hintContent -%}

Once you are done, you can compare with **My Solution** below.

{%- capture solutionContent -%}**Program.cs**

```csharp
const string MyFirstName = "Carl-Hugo";
const string MyLastName = "Marcotte";

Console.WriteLine("What is your first name? ");
var firstName = Console.ReadLine();
Console.Clear();

Console.WriteLine("What is your last name? ");
var lastName = Console.ReadLine();
Console.Clear();

if (firstName == MyFirstName && lastName == MyLastName)
{
    Console.WriteLine("Hey! that's me!");
}
else
{
    Console.WriteLine($"Hello, {firstName}, {lastName}");
}
```

In the preceding code, I:

-   Leveraged constants to make those values more obvious and easier to change (located at the top of the file). We explored constants in {% include learn-coding-with-dot-net-core/ref.md index=2 %}.
-   Used `if—else` blocks, introduced in this article.
-   Composed the conditional expression using the equality operator (`==`) and the AND logical operator (`&&`) translating the English requirements to code: « _If the user enters your first name and last name \[...]_ ».
-   Employed string interpolation to format the output of the `else` block. We explored string interpolation in {% include learn-coding-with-dot-net-core/ref.md index=6 %}.

As you may start to notice, the more we move forward, the more LEGO&#174; blocks we can piece together, and the more complex the application we are able to build.
All the pieces are simple, the craft is about assembling them correctly.
The hardest part of programming is probably to teach our brain to _think computer_, allowing it to translate human-described requirements to code.

> **Tip:** don't think about the code itself; understand the human version of the problem instead, then try to fix it. This should help you.

---

Here is an alternative way you could have implemented the condition:

```csharp
// ...
if (firstName != MyFirstName || lastName != MyLastName)
{
    Console.WriteLine($"Hello, {firstName}, {lastName}");
}
else
{
    Console.WriteLine("Hey! that's me!");
}
// ...
```

In the preceding condition, the logic is inverted.
That condition could also have been simplified to:

```csharp
// ...
if (!(firstName == MyFirstName && lastName == MyLastName))
{
    Console.WriteLine($"Hello, {firstName}, {lastName}");
}
// ...
```

If you are not sure how I was able to play with those conditions, we explore that in {% include learn-coding-with-dot-net-core/ref.md index=11 %}.

{%- endcapture -%}
{%- assign solutionContent = solutionContent | markdownify -%}
{%- include spoiler.html title="My Solution" content=solutionContent -%}

Good job! You completed another small chapter of your programming journey.

## Conclusion

In this article, we learnt how to write code that gets executed only when certain conditions are met.
We learnt about the **equality** (`==`) and **inequality** (`!=`) operators.
Then we explored how to write, `if`, `else if`, and `else` statements blocks to alter the linear flow of a program.
We also briefly covered code indentation as a good way to write clearer code.

Please leave your questions or comments in the comments.

{%- include learn-coding-with-dot-net-core/next.md nextIndex=11 -%}

### Table of content

{%- include learn-coding-with-dot-net-core/toc.md currentIndex=10 -%}
