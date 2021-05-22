---
title:  "How to use a custom NuGet feed in Visual Studio 2017"
date:   2017-08-06 00:00:00 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2017-08-06-how-to-use-a-custom-nuget-feed-in-visual-studio-2017.jpg"
lang: en
categories: en/articles
tags: 
- Visual Studio
- ForEvolve Framework
- NuGet
proficiency-level: Novice
---

This article will be very brief.
In it, I will show you how to use the ForEvolve Framework feed. 
**This could be applied to any other NuGet feed, including your own.**
Take a look at [MyGet](http://www.myget.org/) if you want one :smile:.<!--more-->

## Acquiring the NuGet feed URI
In the [ForEvolve Table of content](https://github.com/ForEvolve/Toc) project, you can find the feed URI, which is:

> https://www.myget.org/F/forevolve/api/v3/index.json

## Setting up Visual Studio
In Visual Studio, you can access the NuGet feeds settings in a few different ways.

### First method
Go to: `Tools > Options > NuGet Package Manager > Package Source`

> **Tip:** type `nuget` in the search box :smile:.

![Visual Studio Options](//cdn.forevolve.com/blog/images/2017/vs-options.png)

### Second method

In the project or the solution, in the `Manage NuGet Packages...` window, click the "gear icon."

![Manage NuGet Packages... - gear icon highlighted](//cdn.forevolve.com/blog/images/2017/vs-nuget-package-sources-from-nuget-window.png)

### Create the feed
Once you reached that window:

1. Click the green `+` icon
1. In the bottom, name the feed (instead of `Package source`) and paste in the URI (instead of `http://packagesource`)
1. Click the `Update` button
1. Click `OK`

You can now use the feed in all your projects!

![NuGet Package Manager - Package Source](//cdn.forevolve.com/blog/images/2017/vs-nuget-package-sources.png)

## Where to see what feed is in use?
When you manage your project or solution packages, make sure the dropdown list is set to "All" or to the feed you want to use.

![Manage NuGet Packages... - Package source](//cdn.forevolve.com/blog/images/2017/vs-nuget-feed-source.png)

### Example
If you choose the "ForEvolve" feed and check the `Include prerelease` checkbox, you should see something like this:

![Manage NuGet Packages... - Package source](//cdn.forevolve.com/blog/images/2017/vs-nuget-forevolve-feed-packages-v2.png)

The selected package is the meta-package. You can always use this one if you don't need fine grained package selection.

# That's it!
You know how to add and use custom NuGet feeds.

Happy coding!