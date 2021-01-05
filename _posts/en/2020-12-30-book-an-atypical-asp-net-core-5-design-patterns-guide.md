---
title: 'Book: An Atypical ASP.NET Core 5 Design Patterns Guide'
subtitle: 'The story behind the book'
date: 2020-12-30 00:00:00 -0500
post-img: '//cdn.forevolve.com/blog/images/articles-header/2021-01-00-Book-story.png'
lang: en
categories: en/articles
tags:
    - C#
    - Design Patterns
    - ASP.NET Core 5
    - .NET 5
    - Book
proficiency-level: Intermediate
updates:
    - { date: 2021-01-04, description: 'Update the subtitle and the header image' }
---

During the summer of 2018, I began writing a book outline with Packt. At first, the goal was a 320-350 pages hands-on book about ASP.NET Core design patterns. Two years and a half later, we have 750+ pages. I can say that I learned many things during that period and that writing a book is way different from what I initially thought.

<!--more-->

## Where did I get the idea?

That adventure began with a message on LinkedIn. I was asked if I would be interested in writing a hands-on book about design patterns by someone at Packt. I was releasing a series of articles at the time about that exact subject so, I thought about the proposal. I decided to move forward with the idea. At that point, I had a one-pager, filled with high-level information, explaining what they were looking for.

## The first outline

Here, I started to collaborate with Packt and built the first outline, which had 21 chapters.
Half of those are more or less in the final book.
The chapters were split into six sections.
I ended up working with multiple people on that, as people tend to move on to other jobs or get promoted.
At this point, we signed a standard contract, and they evaluated a timeline to complete that outlined book; I had no idea how to determine the number of pages per day that I could write.

## The writing

I started writing the book while heading to Europe, so the writing kicked off on the plane. I thought that I could write quite a few chapters in 4 weeks, but I was wrong.

I started using MS Word, then switched to Packt online editor, but at some point, Grammarly was making the document freeze.
Let's be honest, MS Word beats any WYSIWYG editor blindly.
So, at that point, I created a team in my Teams (Microsoft 365), backed by SharePoint.
I invited the people involved in the team when needed.
From there, we had a reliable collaboration platform, with tools like comments, multiple users editing the same document simultaneously, etc.
More importantly, the initial reason to go back to MS Word: Grammarly was not making my documents go boom!

Grammarly is a digital writing assistance tool with some very cool AI-powered features.
I'm not a native English speaker, and even if I were, having a tool that points out mistakes is very useful, especially in very long documents.
It is so easy to miss a detail.

As for the document styles, they started as standard MS Word, then became online WYSIWYG.
Then I recreated the online styles in MS Word, so the documents continue to look the same.
At the same time, I didn't want the styles to be just visual for many reasons.
For example, suppose the headings are actual headings.
In that case, MS Word fills the navigation pane based on them, allowing you to navigate your document and see its outline.

Later, I got an MS Word template from Packt, especially crafted for this.
We are now somewhere during the editorial review.
We updated the existing documents and I used that new template when creating the last few chapters.

At this point, I'm way past the initial schedule, and the outline has evolved quite a bit.
We have 5 sections, and 18 chapters.

## The reviews

Now that I'm almost done, with only a few chapters left, it was time to start reviewing the content.
It was the first time I was writing a book, and let me tell you, that was way more work than I was expecting, and there are way more reviewing phases than I would have thought.
Which is a good thing to catch as many errors as possible.

### The editorial reviews

The editorial reviews started. To make it easier, we used Teams to coordinate our efforts. It was all set up already, so why not.
From there, my editor gave me many valuable comments and tips.
These were from changing the name of a heading to breaking long code blocks into smaller pieces to all kind of details.

At this point, I had no idea how many pages I wrote.
This was a big mistake that I would discover quite soon.

### The technical reviews

After a solid round of editorial reviews, we needed to get that book out.
The release date of .NET 5 was announced, and we had a few months left.
So I asked a friend if he wanted to review the book and let Packt find a second technical reviewer.
While completing the editorial reviews, the technical reviewers started working.

Even if we can adapt most of the book's content to future versions of .NET (architectural principles, dependency injection, design patterns), it contains some tightly coupled subjects with .NET 5.
So we had to deliver it as close to the launch of .NET 5 as possible.
.NET 6 should be out next year, in November after all.

Back to the reviews, many good comments got out of the technical reviews, both content-wise, and technical-wise.
It is easy to miss small details when you spent 2 years writing, moving things around, changing things, reviewing things, etc.

At this point, I could not act on all comments and ideas, as some would have required a massive amount of work.
I felt the content was good as-is, but I still wrote down some of those ideas for a future edition.

I wrote the missing few chapters during this period while doing editorial reviews and having two technical reviewers reading chapters.
It was very hard to follow and remember what chapter was in what state.
So I created a Teams List tab where I started adding columns to track the state of all steps of every chapters, sections, front matter, and preface.
This was a great idea, and I wish I had created that list a few months earlier.

### Copy-editing

Once the writing process, editorial review, and technical reviews were completed, it was time to start the copy-editing process.
So a firm reviewed my spelling, styles and made sure the quality was book-level.

So here started the review of the changes made by the proof-readers.
Because I wanted to make sure that what they did was in line with what I wanted.
With all the moving parts around, moving chapters, splitting chapters, adding and removing content, they caught many mistakes during this phase that we missed during the earlier stages, leading to an improved product.

During this phase, I also bought a domain and converted all links into short links, so readers with a hard copy could type links quickly in their browsers.
I used Firebase Dynamic Links to shorten links.

Next, I received a PDF version of the chapters.

### Layout and indexing

The PDF looked like the final product and included the changes from the copy-editing phase.
So here we go again, reviewing all chapters.
At this point, I read the whole book to make sure I did not miss anything and that the final product would be fluid.
This was another round of updates, from small leads to invalid characters to missing explanations to blurry images and tables.

Some chapters were cleaner than others. For example, some had around 400 comments in them, with quote characters in code blocks that were not imported correctly and were transformed into curly quotes or french-like quotes. There were all kinds of details to fix.
Here I wished I wrote only 300-400 pages instead of 750!

Next was another round of proofing.

### Proofing

Once again, they applied my changes, and proof-readers read all the chapters to correct any mistakes we could have missed.
Then I received the prefinal document.

### Prefinal

Here, I received a single PDF file, which was the book.
I started to see some light at the end of the tunnel.
That said, I had quite a long list of elements from the last proofing phase to make sure everything was there, so it took many days to revise at 12 to 15 hours per day.
My wife helped a lot here and in the previous phase.
She's not a tech person but has high standards and knows how to review documents.
She found many mistakes in my changes and the changes made by the other actors.
I guess that "once an auditor, always an auditor."
I should have got her on board earlier.

Now that I could see the diagrams in a final-enough format, I remade about 80 diagrams, so they looked good in that format, under a 100% zoom level.
Reworking wide diagrams to fit on a 600 pixels wide page, it not always easy, especially if you want to keep them clear.

At this point, I sent our 450 comments back (which was significantly less than in any other phases).

### Final

They applied my last wave of changes, and uploaded to book to their server, ready to be published.
At this point, we can say that we are done.

## Conclusion

After at least a thousand hours, I've released my first book.
Thanks to my editor, who was there a lot throughout the process, and to Packt to have published it.
At this point, I hope people will like the book, as I put a lot of effort into it, and I tried to do something new and different than what others are doing.

Until now, the biggest document that I ever wrote was 100 pages of C#/ASP.NET Web Forms notes for the first course I dispensed in 2010.
I then learned it was too much work for a 40 (or 60) hours course.
Well, I was carried away by the fun of teaching ASP.NET/C# I guess.

During this book-writing process, I learned a lot that I wish I knew two years and a half ago.
Suppose I write another book or for a future revision of this one, I'll take the experience that I acquired to make it easier for me and everybody else who will work on the book.

### Tips

Here are a few tips that can seem obvious at first, but that should help writing a book:

1. Start with a convention about what you highlight and why. Make sure everyone follows that same convention. This will save you countless hours.
1. Make sure you know all of the styles you can and cannot use, like bold, italic, code, code block, keywords, quote, etc. This should save you another countless hours.
1. Keep track of the state of each phase. This helps you know what you have to do next and in what order (priority). It also helps with the moral as the more green you see in your tracking sheet (done items), the better it feels. If the people who work with you update their own status in that list/change tracker, it will save lots of unneeded coordination efforts.
1. Split long code listing into smaller pieces.
   Initially, I wrote about many subjects following a blog-like recipe: small lead, pages of code, explanation.
   Not the best in a book, so I ended up breaking those huge blocks into smaller pieces.
   For most of them, I followed that recipe: small lead, part of the code (a method for example), explanation of that code, optional lead to the next block, more code, and so on.
   Once the listing was completed, I added the last explanations and often some additional information about the whole code (often a file or a few files).

I hope you enjoyed this short story and few tricks.
From here, feel free to have a look and buy my book.

If you are interested in the content, have a look at the following article:
[What's inside?](/en/articles/2021/01/05/book-an-atypical-asp-net-core-5-design-patterns-guide-content/)

{% include buy-net5-book.html %}
