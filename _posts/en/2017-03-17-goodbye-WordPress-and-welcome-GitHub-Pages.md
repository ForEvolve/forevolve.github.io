---
title:  "Goodbye WordPress! And welcome GitHub Pages!"
date:   2017-03-17 00:00:00 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2017-03-17-goodbye-WordPress-and-welcome-GitHub-Pages.jpg"
lang: en
categories: en/articles
---

I have never been a huge fan of WordPress and today is the day that I go back to a life without WordPress. At least now, no one can say that I didn't try. 

## What drove my decision
Let's start with my initial requirements:

> A blog engine with Markdown and Multilanguage support.

### What was WordPress

A CMS-ish/blog-engine, plugin-based, very slow, that also needs<!--more--> security plugins that are even slower and some multi-language plugin that does not work with the other plugins that well, etc., etc. I could continue like this for a long time... 

I don't want to become a WordPress-plugin-specialist, there are a lot of them already.

### What is GitHub Pages (Jekyll)

A Markdown/HTML based website engine linked to a Git repository. It is powered by Jekyll - a ruby page generation engine, which also supports plugins. 

It generates static HTML pages after a Git push! -> FAST!

For the multi-language support, since GitHub does not allow all plugins to run, for obvious security reasons, I had to build something up. 

*Disclaimer:  I never looked at Ruby before, ever. I was 100% clueless about that language.*

It took me a few hours to download and setup Ruby, Jekyll, my GitHub repository, find out some info on the Internet and cook up a multilingual solution. I'll do my best to find the time to blog about it - I found some excellent posts, and these guys deserve some credits. 

I also had to migrate my WordPress posts, banners, and images. While at it I created a CDN backed up by a resizing-image-micro-app/service (I will open-source it at some point in a near future).

## Conclusion
In the end, I think that I've lost more time updating and tweaking WordPress that I spent writing articles. 

On the other end, GitHub Pages is simple and allow me to use my everyday tools.

So Goodbye WordPress! And welcome GitHub Pages!
