---
title:  "How to deploy and host a Jekyll website in Azure blob storage using a VSTS continuous deployment pipeline"
subtitle: "Step 1: Jekyll"
date:     2018-07-10 00:00:00 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2018-07-00-jekyll-vsts-azure-v3.jpg"
unsplash-credit: Photo by Jilbert Ebrahimi on Unsplash
lang: en
categories: en/articles
tags: 
- Azure
- VSTS
- DevOps
- Jekyll
# proficiency-level: Novice
technology-relative-level:
- { name: Azure, level: Beginners }
- { name: VSTS, level: Beginners }
- { name: DevOps, level: Beginners }
- { name: Jekyll, level: Intermediate }
- { name: Git, level: Intermediate }
---

The first step is to create a [Jekyll](https://jekyllrb.com/) website.
This article is very short; the focus of the series is more about DevOps than Jekyll itself.
I also assume that you know Jekyll already.
If you dont, dont worry, just keep reading.

That said, after reading the entire series, you could try with another static site builder or even simply a static web site if you want; Jekyll is only a mean to an end here. Personaly, I may go [Blazor](https://github.com/aspnet/Blazor) on Azure (if I find the time)!

That said, I did choose Jekyll because I like that static sitebuilder.<!--more-->

{% include jekyll-vsts-azure/toc.md currentIndex=1 %}

## The setup

### Install Jekyll and Ruby

If you need to install Jekyll and Ruby, you should follow the [official Jekyll installation guide](https://jekyllrb.com/docs/installation/) to install all prerequisites.

<aside>
    <header>Tips and tricks - Setup Ruby and Jekyll using Ubuntu on Windows 10</header>
    <section>
        <p>If you have Windows 10, this is the easiest way that I fugyured out to set everthing up:</p>
        <ol>
            <li>Open the Windows Store</li>
            <li>Search and install Ubuntu.</li>
            <li>
                Then I open a bash terminal and follow the official
                <a href="https://jekyllrb.com/docs/installation/#ubuntu">Install on Ubuntu Linux</a>
                instruction from the Jekyll website.
            </li>
        </ol>
        <p>
            This is way easier than setting up everything on Windows (unless stuff changed recently and since I wrote this).
            <i>Non-Microsoft things tend to be easier to install using bash!</i>
        </p>
        <p>Another cool thing, if you are using <a href="https://code.visualstudio.com/">Visual Studio Code</a>, you can access bach directly from there in the VS Code folder. This is really awesome, you should use this oportunity to try that out!</p>
    </section>
</aside>

### Creating the website

To create our Jekyll website, follow those quicksteps:

1.  Create directory (I will call mine `JekyllOnAzure`)
1.  Initialize a Git repository
1.  Open a terminal (or open the folder in VS Code then use the integrated terminal).
    - If you installed Jekyll on Ubuntu on Windows 10, type `bash` to start a bash session.
1.  Type `jekyll new .`
1.  Commit you changes

And voilà! You got yourself a new empty Jekyll website.

To test if it work:

1.  Type: `jekyll server` or `bundle exec jekyll server`.
1.  Open a browser on the `Server address` (in VS Code, `ctrl+click` on the link in the terminal).

> If you have a hard time, please refer to the official [Quick-start guide](https://jekyllrb.com/docs/quickstart/).

From here, you can use another theme, add some plugins, etc.
I will not cover Jekyll customization; I will leave you to build your own thing!

{% include jekyll-vsts-azure/next.md nextIndex=2 %}
