---
title: 'Potential const issue in a plugin-based system'
subtitle: 'cosnt vs readonly'
date: 2024-04-10 00:00:00 -0500
post-img: '//cdn.forevolve.com/blog/images/articles-header/2024-04-const-vs-readonly-banner.png'
og-img: '//cdn.forevolve.com/blog/images/articles-header/2024-04-const-vs-readonly-LinkedIn.png'
twitter-img: '//cdn.forevolve.com/blog/images/articles-header/2024-04-const-vs-readonly-LinkedIn.png'
lang: en
categories: en/articles
tags:
    - .NET
    - C#
proficiency-level: Novice
ai-assisted: true
---

In this article, I'm following up on my comment on Dave Callan's post about the difference between `const` and `readonly` in C# (embedded at the end).
By simplifying my thoughts for a LinkedIn comment, I realized I was not clear enough, so I took the time to write this blog and showcase a complete working scenario, which is more complex and real-life-like than what I initially wrote.

Consider this setup:<!--more-->

-   We have the Shared assembly, which defines a constant (`const`).
-   We have a Plugin assembly that utilizes a constant from the Shared assembly. We could reference the Shared assembly using a NuGet package, which is not the case in the code sample we explore here to keep it simple.
-   A Host Program dynamically loads plugins at runtime, including the Plugin Assembly. It also uses the same constant as the Plugin assembly from the Shared assembly, which we could also load through a NuGet package (not the case to keep it simple).

Here lies the issue: if the constant in the Shared assembly changes and the dependent assemblies are not recompiled, there will be a mismatch between the new value and what the assemblies will use. For example, if the Host Program is recompiled but not the Plugin assembly, then there will be a mismatch when the Host Program utilizes it.

## Code sample

To illustrate the scenario with minimal code, we must create three separate projects: `Shared` class library, `Plugin` class library, and the `HostProgram` ASP.NET Core application. Each is as straightforward as possible while retaining a real-life-like structure.

Here are a few technical details:

-   The `HostProgram` loads plugins from the `Plugins` directory.
-   A plugin must implement the `IPlugin` interface from the `Shared` library.
-   Two solutions are in the directory: one for the plugin and one for the host.
-   The `HostProgram` and the `Plugin` use the `MY_CONST` constant.
-   When compiling the plugin using the `INITIAL_VALUE` build configuration, the `INITIAL_VALUE` symbol is used to simulate an old `Shared` assembly compilation.
-   The `HostProgram/Plugins/Plugin.dll` file was compiled using the `INITIAL_VALUE` build configuration.

Here's a diagram that represents this setup:

<figure>
    <img src="//cdn.forevolve.com/blog/images/2024/2024-04-ConstantPluginDiagramDark.png">
    <figcaption>
        A C4 component diagram representing the relationship between the projects.
    </figcaption>
</figure>

> The source code is available on GitHub: [https://github.com/Carl-Hugo/LinkedIn-Code/tree/main/2024-Q2/ConstantPlugin](https://github.com/Carl-Hugo/LinkedIn-Code/tree/main/2024-Q2/ConstantPlugin).

### Shared Assembly

The Shared project contains the plugin interface:

```csharp
using Microsoft.Extensions.Logging;

namespace Shared;

public interface IPlugin
{
    void Execute(ILogger logger);
}
```

It also contains the `Constants` class:

```csharp
namespace Shared;

public static class Constants
{
#if INITIAL_VALUE
    public const string MY_CONST = "InitialValue";
#else
    public const string MY_CONST = "UpdatedValue";
#endif
}
```

The preceding code defines a constant.
The `INITIAL_VALUE` symbol is used to simulate the compilation of multiple DLLs.
Unless defined, the `INITIAL_VALUE` symbol is equal to `false`.

### Plugin Assembly

The Plugin project references the Shared Assembly to implement the `IPlugin` interface.
It contains only the `MyPlugin` class:

```csharp
using Microsoft.Extensions.Logging;
using Shared;

namespace Plugin;

public class MyPlugin : IPlugin
{
    public void Execute(ILogger logger)
    {
        logger.LogInformation("Plugin using const: {const}", Constants.MY_CONST);
        logger.LogInformation("Plugin using readonly: {readonly}", Constants.MY_READONLY);
    }
}
```

The preceding code implements the `IPlugin` interface from the Shared assembly and uses the `MY_CONST` constant and the `MY_READONLY` member.
We leverage this to test the issue later.

### Host Program

The Host Program is an ASP.NET Core minimal API project that dynamically loads plugins that implement the `IPlugin` interface from the `Plugins` folder. It simulates a real-life scenario where plugins could be loaded from assemblies at runtime.

The host only contains the following `Program.cs` file:

```csharp
using Shared;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();
app.MapGet("/load-plugins", (IWebHostEnvironment hostingEnvironment, ILoggerFactory loggerFactory) =>
{
    var pluginsDirectory = Path.Combine(hostingEnvironment.ContentRootPath, "Plugins");
    var pluginAssemblies = Directory.GetFiles(pluginsDirectory, "*.dll");
    var pluginType = typeof(IPlugin);
    foreach (var pluginPath in pluginAssemblies)
    {
        var pluginTypes = Assembly.LoadFrom(pluginPath)
            .GetTypes()
            .Where(type => pluginType.IsAssignableFrom(type) && !type.IsInterface)
        ;
        foreach (var type in pluginTypes)
        {
            var logger = loggerFactory.CreateLogger(type);
            var plugin = Activator.CreateInstance(type) as IPlugin;
            plugin?.Execute(logger);
        }
    }
    var programLogger = loggerFactory.CreateLogger("Program");
    programLogger.LogInformation("Program using const: {const}", Constants.MY_CONST);
    programLogger.LogInformation("Program using readonly: {readonly}", Constants.MY_READONLY);
    return Results.Ok($"Plugins loaded and executed. Current constant value: {Constants.MY_CONST}");
});

app.Run();
```

The preceding code sets up a minimal ASP.NET Core application that listens for requests on the `/load-plugins` route. Upon receiving a request, it dynamically loads assemblies from the `Plugins` directory, searches for types that implement the `IPlugin` interface, and executes their `Execute` method. Remember the `Execute` method of the `MyPlugin` class logs the value of `MY_CONST` and `MY_READONLY` in the console. The endpoint also logs the value of `MY_CONST` and `MY_READONLY` in the console—as we can see above.

Now, if we execute the program and call the `/load-plugins` endpoint, the console will output something similar to the following:

```text
info: Plugin.MyPlugin[0]
      Plugin using const: InitialValue
info: Plugin.MyPlugin[0]
      Plugin using readonly: UpdatedValue
info: Program[0]
      Program using const: UpdatedValue
info: Program[0]
      Program using readonly: UpdatedValue
```

The preceding console outputs showcase that both loggers recorded their own version of the `const`—based on the time we compiled the assembly—but ended up using the same version of the `readonly` member:

-   The `Plugin.MyPlugin` logger wrote `InitialValue` for the constant (old compilation) and `UpdatedValue` for the `readonly` member (reference on the `Shared` assembly).
-   The `Program` logger wrote `UpdatedValue` for the constant (new compilation) and `UpdatedValue` for the `readonly` member (reference on the `Shared` assembly).

This example is a simplified setup showcasing a potential issue of using a `const` versus a `readonly` member.

## Conclusion

This example illustrates why it's crucial to understand the implications of using `const` in a distributed or modular application architecture. The compile-time nature of `const` means that any change requires all dependent assemblies to be recompiled to use the updated value. This is effortless within a single solution where everything is compiled and deployed together but can become challenging when assemblies are distributed separately, such as through NuGet packages or as part of a plugin system.

In conclusion, I want to bolster my original point: choosing between `const` and `readonly` requires understanding their technical differences and their impact on application architecture and deployment strategies.

Please leave a comment if you found this instructive and follow me on {%- include social-link-LinkedIn.html -%} for more insights into ASP.NET Core, .NET, C#, and software architecture.

<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7179790135180328961" height="1562" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
