---
title: 'Speed up your builds to up to 375% and watch for changes for an even faster dev cycle using this workaround on WSL2/Ubuntu'
subtitle: 'Using Jekyll, from WSL/Linux (Workaround 1)'
date: 2020-02-04 00:00:00 -0500
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
updates:
    - { date: 2020-02-04, description: 'Fix some typos and update the title to be clearer' }
    - { date: 2020-02-07, description: 'Link to the second version of the article' }
---

In this article, we explore a workaround to watch for changes using a Jekyll project, Windows 10, WSL2, Ubuntu 18.04, and Visual Studio Code.
We can apply the same technique to webpack, gulp, or any projects that require watching the file system for changes.
Moreover, I noticed a significant speed boost when running commands, like build, of up to 375% on the Linux file system directly.<!--more-->

> Unfortunately, everything was working fine for me over WSL1 and broke on WSL2. Why not go back? Well, I wanted to explore WSL2 to see if it was a viable alternative for projects built with Docker.
> So far, besides the impossibility of watching the file system correctly, it is working well enough, so I want to stick with it. ¸
> My goal behind using WSL2 is to maintain a single set of bash script to run, build, debug, and deploy containers instead of a mix of bash and PowerShell (to keep this short).

## Follow up article

I wrote a [follow up article](/en/articles/2020/02/07/speed-up-your-builds-and-watch-for-changes-to-up-to-375-percent-using-this-workaround-on-wsl2-ubuntu-on-windows/), showing an improved solution to the same problem covered in this article. Some information of the current article could still be of interest to you, so don't stop reading or feel free to come back later.

## Prerequisites

You will need the following:

-   Windows 10 with WSL2 installed; see [Installation Instructions for WSL 2](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install).
-   A [Unbuntu 18.04](https://www.microsoft.com/en-ca/p/ubuntu-1804-lts/9n9tngvndl3q?rtc=1&activetab=pivot:overviewtab) distro (could also work with other versions of Linux/Ubuntu).
-   [Jekyll](https://jekyllrb.com/) installed in your WSL2 Ubuntu
-   Git installed and configured in your WSL2 Ubuntu
-   [Visual Studio Code](https://code.visualstudio.com/) in Windows 10
-   The [Remote - WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) extension.

## The problem

The problem is that Linux is not getting notified when file changes on the Windows file system, so `watch` flags are not working.

## The solution

Use the Linux file system directly! We have a full Linux kernel installed after all, so why bother?

## The Workaround

It is very simple but cleaver (disclaimer: I did not have the original idea).

The steps are as follow:

1. `bash` into our Linux distro
1. `git clone` our project there, outside of the Windows file system
1. Use VS Code's "Remote - WSL" extension to open our "remote Linux project"
1. Start working and do our things, as usual!

### Bash into Linux

From a terminal, from VS code, or PowerShell, type `bash` to connect to your default WSL2 Linux distro.
The path should be `/mnt/{drive}/{the folder you were in on Windows}`.
For example, if you were in `c:\my-project`, the path on the Linux side should be `/mnt/c/my-project`.
The `/mnt` means it is mounting the Windows file system, which is what caused us problems.
To remedy that, we want to move to the Linux file system, by executing `cd ~`, which move us to our Linux `$HOME` directory.

### Git Clone

Now that you have `cd ~` into your `$HOME` directory, it is time to clone our project, but before that, let's get organized.

> To keep your file system clean and organized, I suggest that you create a directory for your projects.
> I like to name mine `repos`.
> To do that, run `mkdir repos`, then `cd repos` to enter it.

Now that everything is set, make sure that you are in the right directory, mine is `~/repos`, then run `git clone {the URI that you are looking for}`.
For example, if you want to clone my blog, run `git clone git@github.com:ForEvolve/forevolve.github.io.git`

> Unfortunately, Visual Studio Code's source control feature does not seem to work well, on my system at least, so you may need to set an SSH key or configure some credentials to access your git repository.
> The projects I used that trick with are hosted on GitHub, so I chose an SSH key to authenticate with them.
> So I had to configure one key, that works with all of my GitHub projects.
> Here is a tutorial that beats GitHub documentation, and that covers what you have to do: [How to Add an SSH Public Key to GitHub from Ubuntu 18.04 LTS](https://virtualzero.net/blog/how-to-add-an-ssh-public-key-to-github-from-Ubuntu-18.04-lts).

### Open VS Code

There is two way that I know to achieve this:

1. Simply `code .` from your bash terminal
1. Use a VS Code instance to open a WSL Remove VS Code instance

#### From bash

The first and simplest method, and the more amazing/magical, is as simple as, from your project directory, run:

```bash
code .
```

> For example, if I cloned my blog, I'd be located in `~/repos/forevolve.github.io`.

And yes, that's it, a VS Code _WSL: Ubuntu-18.04_ has just opened in the right directory!

#### From VS Code

From VS Code, `ctrl+shift+P`, then `Remote-WSL: New Window`.
That should open an instance of VS Code, connected to your WSL2 Ubuntu distro.

From there, you can **Open Folder**, and choose the Linux directory that you cloned your project in; in my case, it was `~/repos/forevolve.github.io`.

### Start Jekyll or the tool of your choice

From your VS Code connected to WSL, if you open a terminal (using `ctrl+.`), you can then run your favorite commands, like `bundle exec jekyll serve -I`.

#### Tips to "solve" bundle error

Full disclaimer, I'm pretty new to Linux, and I encountered a few problems here and there while working with WSL2/Jekyll.
Most of those problems were related to permissions (I think) of Ruby and Bundle.
I'm not a Ruby developer, I only use that for Jekyll, so there might be better ways/workarounds.
What I found was that running `bundle exec` as `root` was fixing my issues, so I just `sudo bundle exec` my commands.
I know that it is not recommended, but I only have a limited amount of time to spend on my personal projects, so that's it; I'm sharing my quirk with you anyway, and I welcome any better solution! BTW, not all of my projects require the use of `sudo`, for some reasons.

The type of error that I'm talking about:

-   Could not find eventmachine-1.2.7 in any of the sources
-   Run `bundle install` to install missing gems.

Then you run `bundle install`, then the same error pop back again.

## Drawbacks

There are a few quirks here and there (besides the `sudo` trick that I just talked about), first of all, some features in VS Code are not working, like the source control window, so you need to run your git command by hand.
Another one is the fact that you can't modify your files from Windows. That said, you can drag and drop new files into code (like images), which is fine enough by me.

## Conclusion

It is becoming easier to take advantage of both Linux and Windows now, which is extremely useful to Windows users that develop using non-Microsoft technologies.
Then, by moving your source code to the Linux file system, until everything in WSL2 gets fixed, you can use the productivity tools that make your life easier and your development cycle faster.

I hope you enjoyed this quick article and that you'll be able to add the `watch` flag when running your favorite tools using WSL2.

## Noticeable speed gain

Moreover, I noticed a considerable gain between building from the Windows file system vs the Linux filesystem, both ways through WSL2/Ubuntu/bash.
From `/mnt/...`, it took between 3.798 and 5.31 seconds while it took only between 1.415 and 1.433 seconds from `~/...`, which is faster from 265% to 375%.

I only ran three builds each and took the fastest and slowest, so these numbers could not reflect the reality of every project. That said, I find it very impressive and very convenient. For example, with incremental build activated, rebuilding this post takes less than 0.2 seconds using the Linux file system!

## Disclaimer

The source of the idea comes from [a comment](https://github.com/microsoft/WSL/issues/4739#issuecomment-571688826), from [nake89](https://github.com/nake89), in the GitHub issue that tracks this problem: [[WSL2] File changes made by Windows apps on Windows filesystem don't trigger notifications for Linux apps](https://github.com/microsoft/WSL/issues/4739).
