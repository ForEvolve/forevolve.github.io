---
title:  "A beginner guide to exceptions"
subtitle: "The basics"
date:     2018-01-15 00:00:00 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2018-01-00-exceptions.png"
unsplash-credit: Photo by Jilbert Ebrahimi on Unsplash
lang: en
categories: en/articles
tags: 
- C#
proficiency-level: Novice
---

Today we will take a look at how to propagate errors using Exceptions.
I will do my best to keep the article as simple as possible with lots of code samples. 
I believe  that learning the basics is essential in programming.

## Prerequisites
You must understand what is a class, a type, a property and have a basic knowledge of inheritance.

## What is an Exception?
An exception is a particular Type representing an error.<!--more--> It must derive (inherit) from `Exception` (directly or indirectly). 

You can do two things with exceptions:

1. `throw` them; to create and propagate errors.
2. `catch` them; to handle errors.

> **Error handling**
>
> You don’t want your system to crash every time a user sends you an incorrect input, right?
> Well, let's start by crashing it anyway!

## Throwing Exceptions
Exceptions, when thrown, are propagated down the execution stack (unwinded) until handled (`catch`-ed). 
If they are not, your program will crash (partially or entirely).

Here is a visual representation of this:

![Exception propagation diagram](//cdn.forevolve.com/blog/images/2018/exception-propagation-diagram.png)

Frameworks, SDKs and what not, throws exceptions to alert you, the developer, that an error occurred.
Don’t worry; you can throw some too in your own programs!

Here is how:

``` csharp
throw new Exception();
```

Or, with some custom error message:

``` csharp
throw new Exception("My custom error message that makes sense.");
```

### System exceptions 
Now that we saw the `Exception` class briefly, let's take a look at other predefined exceptions type, provided by the .NET framework:

- `NotImplementedException` is thrown when an operation is not yet implemented (coded). Often scaffolded by VS, like when you ask VS to implement an interface.
- `NotSupportedException` is thrown when a feature is not supported. For example, a provider might not support all features.
- `ArgumentException` is thrown when the value of an argument is invalid.
- `ArgumentNullException` is thrown when the value of an argument is `null`. This is often used by guard clause, guarding injection of `null` dependencies in the constructor. See [Dependency injection](http://www.forevolve.com/en/articles/2017/08/14/design-patterns-web-api-service-and-repository-part-2/#dependency-injection) for more information on the subject.
- `NullReferenceException` is thrown when you are using a member of a `null` object. For example, in the following code: `SomeClass obj = null; obj.SomeProp = 123;`, the system will throw a `NullReferenceException` when executing the second statement `obj.SomeProp = 123;`.
- `IndexOutOfRangeException` is thrown when you are accessing a position in an array that does not exist, for example, trying to access the 11th elements of a 10 elements array.
- `ArgumentOutOfRangeException` is similar to `IndexOutOfRangeException` and can be thrown by many collections (and other objects). For example, trying to read the first element of an empty `List<T>` will throw this type of exception.

### Anatomy of an Exception
Let's take a look at the most commonly used properties of the `Exception` class.

> For more information, see [docs.microsoft.com](https://docs.microsoft.com/en-us/dotnet/api/system.exception?view=netstandard-2.0#Properties).

#### Message
The `Message` is probably the most used property of the `Exception` class; it represents the error message.

#### InnerException
The `InnerException` is the source of the `Exception`. You can also see this as the underlying error or as a sub-error.

> This property is read-only and must be set by the `Exception(String, Exception)` constructor of the `Exception` class.
>
> Example: `throw new Exception("My error message", myInnerException);`

#### StackTrace
The `StackTrace` property can help you diagnose the error and pinpoint its source. This contains the execution stack that causes the error.

#### Source
The `Source` property gives you the name of the application or the object that caused the error. This is not always useful but can be. 

> I more often simply jump to the `StackTrace` instead. The top line is the frame where the `Exception` has been thrown.

### Custom exceptions
To create a custom exception, you need to create a class that inherits from another exception.

It is as easy as this:

``` csharp
public class MySuperMeaningfulException : Exception
{
}
```

> By convention, you should suffix your class name with `Exception`.

Then you can throw it like any other exception:

``` csharp
throw new MySuperMeaningfulException();
```

#### Enforce a message
You can enforce a specific message for a particular type of exception, or allow the caller code to create a custom message by exploiting the base constructors.

Pass-through constructor (custom message):

``` csharp
public class MySuperMeaningfulException : Exception
{
    public MySuperMeaningfulException(string message)
        : base(message)
    {
    }
}
// ...
throw new MySuperMeaningfulException("My custom message.");
```

Enforcing a specific message:

``` csharp
public class MySuperMeaningfulException : Exception
{
    public MySuperMeaningfulException()
        : base("My custom message.")
    {
    }
}
// ...
throw new MySuperMeaningfulException();
```

You can even create a specific message with useful parameters:

``` csharp
public class MySuperMeaningfulException : Exception
{
    public MySuperMeaningfulException(int someMeaningfulCount)
        : base($"My custom message with a meaningful count of {someMeaningfulCount}.")
    {
    }
}
// ...
throw new MySuperMeaningfulException(12);
```

From this point, I will leave your imagination to think of other ways of using custom exception.

## Catching exceptions
Throwing errors is exciting and all but what about handling them? To do that, we will use the `try` and `catch` keywords.

1. `try` wraps the code to be executed; the code that can throw an exception.
2. `catch` contains your error handling code.

Here is an example:

``` csharp
try
{
    // The code to be executed; that can throw an exception.
}
catch (Exception)
{
    // The error handling code.
}
```

If we take a more in-depth look at the `catch` block, there is no way to access the `Exception` instance and most of the time you want access to the exception's properties (ex.: the error message), let's see how to fix that:

``` csharp
try
{
    // The code to be executed; that can throw an exception.
}
catch (Exception ex)
{
    // The ex variable can be used to access the Exception properties.
}
```

Simple right?

To go a little further, we can add multiple `catch` blocks that each handles a different type of error. Let's see how:

``` csharp
try
{
    // The code to be executed; that can throw an exception.
}
catch (IndexOutOfRangeException ex)
{
    // The IndexOutOfRangeException error handling code.
}
catch (Exception ex)
{
    // The other Exception error handling code.
}
```

> **Side notes**
>
> Depending on the version of C# that you are using, ordering the catch blocks might be necessary; they might need to be ordered from the more precise to the more general exception types. For example, `catch (Exception)` should always be the last `catch` block, when you need it; it is the more general exception of all.
> 
> Also, the name of the variables might need to be different for each `catch` block.

---

> **Tip of the day**
>
> If you are creating a system from scratch, creating a custom base exception can be a great idea. 
> For example, in some component of your system, you could handle your custom exceptions and system exceptions differently.
>
> This could be done by two `catch` blocks: `catch (MyCustomException)` and `catch (Exception)`.
>
> Once again, this is an introduction to exceptions; I will leave your imagination to it, for now.

---

> **Important**
>
> As stated in the official documentation: In general, you should only catch those exceptions that you know how to recover from.
>
> Therefore, if you can only do so much within a catch block, don't catch it or catch it, do your thing, then rethrow it (see below).

### Rethrowing an exception
Sometimes, you want to do something with an Exception then rethrow it, so it continues to "move down" the execution stack.
You can do that in a catch block with `throw;`.

``` csharp
try
{
    // The code to be executed; that can throw a MySuperMeaningfulException.
}
catch (MySuperMeaningfulException ex)
{
    logger.Log(ex);
    throw;
}
```

Using `throw;` like this has the advantage of preserving the exception `StackTrace`.

You can also catch an exception and throw another exception instead.

``` csharp
try
{
    // The code to be executed; that can throw a MySuperMeaningfulException.
}
catch (MySuperMeaningfulException ex)
{
    logger.Log(ex);
    throw new MyEvenMoreMeaningfulException();
}
```

Doing that will make `MySuperMeaningfulException` disappear and be "replaced" by `MyEvenMoreMeaningfulException`.
But what if you want to preserve `MySuperMeaningfulException`?

``` csharp
public class MyEvenMoreMeaningfulException : Exception
{
    public MyEvenMoreMeaningfulException(Exception innerException)
        : base("My even more meaningful exception message.", innerException)
    {
    }
}

//...

try
{
    // The code to be executed; that can throw a MySuperMeaningfulException.
}
catch (MySuperMeaningfulException ex)
{
    logger.Log(ex);
    throw new MyEvenMoreMeaningfulException(ex);
}
```

As you may have noticed, the initial `MySuperMeaningfulException` has become the `InnerException` value of the `MyEvenMoreMeaningfulException`. 
This is useful to keep a reference to that initial error.

To achieve this result, `MyEvenMoreMeaningfulException` simply use one of the `Exception` constructor, passing to it the `InnerException`.

There is one last `throw` case that we can cover, which is similar to `throw;` but it will not preserve the `StackTrace` of the original error:

``` csharp
try
{
    // The code to be executed; that can throw a MySuperMeaningfulException.
}
catch (MySuperMeaningfulException ex)
{
    logger.Log(ex);
    throw ex;
}
```

### "Plain catch"
You can also create a catch block specifying no type at all. 
If you are working with a recent version of C#, this will behave the same way as `catch (Exception)` but it is **not recommended**.

``` csharp
try
{
    // The code to be executed; that can throw a MySuperMeaningfulException.
}
catch
{
    // The error handling code.
}
```

> If you are using an older version of C#, well this is a little different. 
> That said, explaining this is out of the scope of "a beginner guide to exceptions".
> The reason why I mentioned it is that you know it exists.

## Finally
There is another keyword that we haven't talked about yet; it is: `finally`.
The `finally` keyword allows you to create a block of code that will always be executed, whether the "try" code throws an exception or not. 
This is very useful to ensure that `IDisposable` objects are disposed of correctly.

You can add a `finally` block after a `try` block with no `catch` block or after all your `catch` blocks.

`try/finally` example:

``` csharp
try
{
    // The code to be executed; that can throw one or more exceptions.
}
finally
{
    // The code to be executed whether or not an exception is thrown.
}
```

`try/catch/finally` example:

``` csharp
try
{
    // The code to be executed; that can throw one or more exceptions.
}
catch (Exception ex)
{
    // The error handling code.
}
finally
{
    // The code to be executed whether or not an exception is thrown.
}
```

`try/catch/catch/catch/finally` example:

``` csharp
try
{
    // The code to be executed; that can throw one or more exceptions.
}
catch (MySuperMeaningfulException ex)
{
    // MySuperMeaningfulException error handling code.
}
catch (MyEvenMoreMeaningfulException ex)
{
    // MyEvenMoreMeaningfulException error handling code.
}
catch (Exception ex)
{
    // Some general error handling code.
}
finally
{
    // The code to be executed whether or not an exception is thrown.
}
```

> **Interesting fact**
>
> The compiler does wrap `using` code blocks in `try/finally` blocks.
> See below for more information.

### Under the hood (using)
Since I talked about it, here is an example of a using statement, and it's IL counterpart.

Here is the `using` example: 

``` csharp
using (var component = new SomeDisposableComponent())
{
    component.SomeOperation();
}
```

Here is the IL (Intermediate language; compiled C# code) version of the same code: 

``` csharp
{
    SomeDisposableComponent component = new SomeDisposableComponent();
    try
    {
        component.SomeOperation();
    }
    finally
    {
        if (component != null)
            ((IDisposable)component).Dispose();
    }
}
```

## Conclusion
Exceptions are very easy to use and are a very powerful mechanism, but they are also more costly than a hand-crafted solution like "operation results".

Feel free to leave your questions and comments below.

### What's next?
My next article will talk about "operation results" as an alternative way of communicating errors between components.

Until then, happy coding!