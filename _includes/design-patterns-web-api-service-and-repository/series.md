## The series (shared section)
In the series, we will create an Asp.Net Core 2.0 Web API, and we will focus on the following major concerns:

1. The web part; the HTTP request and response handling.
1. The business logic; the domain.
1. The data access logic; reading and writing data.

During the article, I will try to include the thinking process behind the code.

Technology-wise, we will use [Asp.Net Core](https://www.microsoft.com/net/core), [Azure Table Storage](https://docs.microsoft.com/en-us/azure/storage/storage-dotnet-how-to-use-tables) and [ForEvolve Framework](https://github.com/ForEvolve/Toc) to build the Web API.

To use the ForEvolve Framework (or let's say toolbox), you will need to install packages from a custom NuGet feed.
If you dont know [How to use a custom NuGet feed in Visual Studio 2017](/en/articles/2017/08/06/how-to-use-a-custom-nuget-feed-in-visual-studio-2017/), feel free to take a look at this article.
If you do, the ForEvolve NuGet feed URI is `https://www.myget.org/F/forevolve/api/v3/index.json`.

We will also use [XUnit](https://xunit.github.io/) and [Moq](https://github.com/moq/moq4) for both unit and integration testing.

{% include design-patterns-web-api-service-and-repository/toc.md %}

*I will update the table of content as the series progress.*

### "Prerequisites"
In the series, I will cover multiple subjects, more or less in details, and I will assume that you have a little idea about what a Web API is, that you know C# and that you already have a development environment setup (i.e.: Visual Studio, Asp.Net Core, etc.).

### The goal
At the end of this article series, you should be able to program an Asp.Net Core Web API in a structured and testable way using the explained techniques (design patterns).
These design patterns offer a clean way to follow the Single Responsibility Principle.

Since design patterns are language-agnostic, you can use them in different applications and languages. In an [Angular](https://angular.io/) application, you will most likely use Dependency Injection for example. 

This is one of the beauties of **design patterns; they are tools to be used, not feared!**

### Prerelease
At the time of the writing, Asp.Net Core 2.0 is still a prerelease version and require Visual Studio 2017 Preview to be run.
I will update the code sample once Asp.Net Core 2 is released and remove this notice.
Until then, most of the code should run without any change in Asp.Net Core 1.1 (beside program.cs and startup.cs that will need some adjustments).

The ASP.NET Core CI dev build are taken from the following NuGet feed: [https://dotnet.myget.org/F/aspnetcore-ci-dev/api/v3/index.json](https://dotnet.myget.org/F/aspnetcore-ci-dev/api/v3/index.json).

---