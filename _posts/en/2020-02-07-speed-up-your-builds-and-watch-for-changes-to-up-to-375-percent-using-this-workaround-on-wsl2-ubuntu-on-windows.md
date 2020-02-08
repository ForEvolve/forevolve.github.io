---
title: 'Speed up your builds to up to 375% and watch for changes for an even faster dev cycle using this workaround on WSL2/Ubuntu'
subtitle: 'Using Jekyll, from Windows (Workaround 2)'
date: 2020-02-07 00:00:00 -0500
post-img: '//cdn.forevolve.com/blog/images/articles-header/2020-02-00-WSL2.jpg'
unsplash-credit: Photos by Victoria Heath and Matthew T Rader on Unsplash
lang: en
categories: en/articles
tags:
    - Jekyll
    - WSL2
# proficiency-level: Intermediate
technology-relative-level:
    - { name: Jekyll, level: Intermediate }
    - { name: WSL2, level: Intermediate }
    - { name: Bash, level: Intermediate }
    - { name: VS Code, level: Intermediate }
    - { name: Git, level: Intermediate }
---

In this article, we explore how to use VS Code on Windows and use the Linux file system to watch for changes in an improved dev workflow that I described recently in the [first article](/en/articles/2020/02/04/speed-up-your-builds-and-watch-for-changes-to-up-to-375-percent-using-this-workaround-on-wsl2-ubuntu/) about this subject.

[Craig Loewen](https://twitter.com/craigaloewen) tweeted me a [comment](https://twitter.com/craigaloewen/status/1224925470606548992?s=20) that lead to this even better solution, fixing the same problem and fixing the only drawback that I found.
Good thing that one of my 2020 resolution is to use Twitter more!

That said, we still use a Jekyll project, Windows 10, WSL2, Ubuntu 18.04, and Visual Studio Code.
We still can apply the same technique to webpack, gulp, or any projects that require watching the file system for changes.
We still benefit from a significant speed boost when running commands, like build, of up to 375% (and maybe more)!
But we also get all of the VS Code tooling to work (like the Git).<!--more-->

> This article is a follow up on [Speed up your builds to up to 375% and watch for changes for an even faster dev cycle using this workaround on WSL2/Ubuntu | Using Jekyll, from WSL/Linux (Workaround 1)](/en/articles/2020/02/04/speed-up-your-builds-and-watch-for-changes-to-up-to-375-percent-using-this-workaround-on-wsl2-ubuntu/).
> I initially wanted to add a note in that article, but it was getting too messy, so I decided to write a new less-fuzzy follow-up article instead.
> You don't need to read the previous article first, they are two solutions to the same problem. This technique is even better and more straightforward, but the other could be useful in some cases, hence why I'm not just replacing it. There are some information there that I have not ported here.

## Prerequisites

You will need the following:

-   Windows 10 with WSL2 installed; see [Installation Instructions for WSL 2](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install).
-   A [Unbuntu 18.04](https://www.microsoft.com/en-ca/p/ubuntu-1804-lts/9n9tngvndl3q?rtc=1&activetab=pivot:overviewtab) distro (could also work with other versions of Linux/Ubuntu).
-   [Jekyll](https://jekyllrb.com/) installed in your WSL2 Ubuntu or any other tool that you want to `-watch` something with.
-   Git installed and configured in your WSL2 Ubuntu
-   [Visual Studio Code](https://code.visualstudio.com/) installed in Windows 10

## The problem

The problem is that Linux is not getting notified when file changes on the Windows file system, so `watch` flags are not working.

## The solution

Use the Linux file system directly! We have a full Linux kernel installed after all, so why bother?

## The even better Workaround

This workaround is even easier to deal with and more powerful as we can change files in the Linux filesystem from Windows with Linux detecting the changes (which makes sense as the changes are happening on the Linux side).

The high-level steps are as follow:

1. `bash` into our Linux distro
1. `git clone` our project there, outside of the Windows file system
1. `explorer.exe .` back into windows (or `\\wsl$` there, from Windows explorer directly)
1. `vscode .` from Windows into ou Linux project folder

### Bash into Linux

From a terminal, VS code or PowerShell, type `bash` to connect to your default WSL2 Linux distro.
The path should be something like `/mnt/{drive}/{the folder you were in on Windows}`.
For example, if you were in `c:\my-project`, the path on the Linux side should be `/mnt/c/my-project`.
The `/mnt` means that Linux is mounting the Windows file system, which is what caused us problems.
To remedy that, we want to move to the Linux file system, by executing `cd ~`, which move us to our Linux `$HOME` directory.

TL;DR:

1. Open a terminal¸
2. `bash`
3. `cd ~`

### Git Clone

Now that you have `cd ~` into your `$HOME` directory, it is time to clone your project, but before that, let's get organized.

> To keep your file system clean and organized, I suggest that you create a directory for your projects.
> I like to name mine `repos`.
> To do that, run `mkdir repos`, then `cd repos` to enter it.

Now that everything is set, make sure that you are in the right directory, mine is `~/repos`, then run `git clone {the URI that you are looking for}`.
For example, if you want to clone my blog, run `git clone git@github.com:ForEvolve/forevolve.github.io.git`.

Then `cd` into that directory.

TL;DR:

1. `cd repos` (optional)
1. `git clone {the URI that you are looking for}`
1. `cd {the directory the project got cloned in}`

### Move back to Windows

From here, you can open Windows Explorer and navigate to the folder you cloned your repository in, starting from `\\wsl$`, but it would be way more tedious than what happens next:

1. Type `explorer.exe .` and hit enter (note the `.` after `.exe`)

That command should open Windows Explorer pointing to the Linux file system folder that you are in; magic! Thanks Craig for this magic trick!

### Open VS Code

You should be in Windows Explore, in a path similar to `\\wsl$\Ubuntu-18.04\home\{user}\repos\{the repo that you cloned}`.

From there you can:

1. Type `code .` from a Windows terminal (cmd or PowerShell)
1. Right-click the folder and choose "Open with Code" if you configured that.
   ![Open with Code context menu item](//cdn.forevolve.com/blog/images/2020/OpenWithVSCode.png)

That's it! You are now using VS Code from Windows over the Linux file system!

From code, you can now:

1. Open a terminal (`` ctrl+` ``)
1. `bash`
1. `bundle exec jekyll serve -I`

## Conclusion

It is becoming easier to take advantage of both Linux and Windows now, which is extremely useful to Windows users that develop with non-Microsoft technologies.
Then, by moving your source code to the Linux file system, until everything in WSL2 gets fixed, you can use the productivity tools that make your life easier and your development cycle faster.

I hope you enjoyed this quick article and that you'll be able to add the `watch` flag when running your favorite tools using WSL2.

## Drawbacks

The previously discussed drawbacks are no more, and the limitations from the first workaround are no longer real, which is even better!

So, no drawback that I can see, besides the 10 seconds setup required to clone your repo into Linux, which would be done by a tool from Windows for that matter.

## Noticeable speed gain

Moreover, I noticed a considerable gain between building from the Windows file system vs the Linux filesystem, both ways through WSL2/Ubuntu/bash.
From `/mnt/...`, it took between 3.798 and 5.31 seconds while it took only between 1.415 and 1.433 seconds from `~/...`, which is faster from 265% to 375%.

I only ran three builds each and took the fastest and slowest, so these numbers could not reflect the reality of every project. That said, I find it very impressive and very convenient. For example, with incremental build activated, rebuilding this post takes less than 0.2 seconds using the Linux file system!

## Disclaimer

The source of the idea comes from [a comment](https://github.com/microsoft/WSL/issues/4739#issuecomment-571688826), from [nake89](https://github.com/nake89), in the GitHub issue that tracks this problem: [[WSL2] File changes made by Windows apps on Windows filesystem don't trigger notifications for Linux apps](https://github.com/microsoft/WSL/issues/4739).

The updated idea comes from [Craig Loewen](https://twitter.com/craigaloewen)'s [tweet](https://twitter.com/craigaloewen/status/1224925470606548992?s=20) on my original post.

## Original article

Some information could still be of use in the [original article](/en/articles/2020/02/04/speed-up-your-builds-and-watch-for-changes-to-up-to-375-percent-using-this-workaround-on-wsl2-ubuntu/), so feel free to take a look next.
