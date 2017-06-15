---
title: "Some essential keyboard shortcuts and mouse tips that everyone should know to be more productive"
date:  2016-12-16 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2016-12-16-some-essential-keyboard-shortcuts-and-mouse-tips-that-everyone-should-know-to-be-more-productive.png"
lang: en
categories: en/articles
redirect_from: "/articles/2016/12/16/some-essential-keyboard-shortcuts-and-mouse-tips-that-everyone-should-know-to-be-more-productive/"
---

Based on what I saw in the field, from beginners to senior professional developers, many people could be more productive when it comes to text selection.

There are a few things that can help you write what's in your mind faster (most of the time: code):
1. IntelliSense/autocomplete (`ctrl+space` + `up/down arrows` + `tab` or `enter` or `.` or ...) - this is a topic for another day.
1. Code snippets (i love my `guard`, `aaa` (arrange, act, assert) snippets) - another topic for another day.
1. The use of your keyboard (i.e.: shortcuts)

The keyboard shortcuts presented here can be useful to anyone but are more focused on programming.

Adding these in your day to day work should boost your productivity, allowing you to think more of your results and less about the process to get there.
<!--more-->
## Copy & Paste
Some basic shortcuts that everyone should use.
These works almost everywhere, from a text editor to the file explorer.

| Description | Shortcut | Alternate |
|----------------------|-----------------------|------------------------|
| Copy | `ctrl+c` | `shift+insert` |
| Paste | `ctrl+v` | `ctrl+insert` |
| Cut | `ctrl+x` | |

After today, you should never use "right-click > Copy", "right-click > Paste" or "right-click > Cut", ever again!

Let's add a few more:

| Description | Shortcut |
|----------------------|-----------------------|
| Select all | `ctrl+a` |
| Save | `ctrl+s` |


## Navigating the sea of words, fast!
A mouse is a great tool to make selections, but it is not always the best, and it is often not the fastest.

### Mouse shortcuts - the fast and precise way!
**Select a word with the mouse**
To select a word: `double+click` it. 

`click+drag` takes time, stop doing that!

#### Visual Studio tips - `ctrl+click` & `ctrl+click+drag`
In some software, like **Visual Studio**: `ctrl+click` will select the word you click.

**Select multiple words with the mouse**
Based on the previous tip, you can `ctrl+click` a word (that word will be selected), hold `ctrl` and `click` down and move your mouse left or right. That way, you will select the next/previous word(s).

**Example**, using the following code snippet:

1. `ctrl+click` the letter `g` of the keyword `string`,
1. hold both `ctrl` and `click` down,
1. then move over the letter `v` of argument name `value`

By doing that, you selected `string value` in a few milliseconds. 
Now, try the same thing again, but using `click+drag your mouse around` instead. 

Have you noticed the time and precision differences?

```CSharp
[HttpPut("{id}")]
public void Put(int id, [FromBody]string value)
{
}
```

#### A better way than `click+drag`
A better way than `click+drag`, if you can't `ctrl+click+drag`, is to:

1. `click` at the beginning of what you want to select
1. then `shift+click` at the end of what you want to select

**Example**, using that last code snippet:

1. `click` before the `s` letter of `string` (put the cursor left of `string`)
1. Then `shift+click` after the `e` letter of `value` (put the cursor right of `value`) to select `string value`.

<img src="//cdn.forevolve.com/blog/images/2016/vs-code-manual-select-3.png" alt="vs-code-manual-select-3" />
<img src="//cdn.forevolve.com/blog/images/2016/vs-code-manual-select-4.png" alt="vs-code-manual-select-4" />

*Based on what we will see next, it would be even faster and more precise to put your cursor left of `string` then hold down `ctrl+shift` then hit the `right arrow` twice.*

### Back to keyboard shortcuts
Most of the time, you have both hands on the keyboard so navigating your code with that same keyboard is a key to your productivity.

#### Basic navigation

| Description | Shortcut | Complement |
|--------------------------------------------------|-------------------|--------------------|
| Move to the previous line | `up arrow` | |
| Move to the next line | `down arrow` | |
| Move the cursor around characters | `left arrow` | `right arrow` |
| Move the cursor around words | `ctrl+left arrow` | `ctrl+right arrow` |
| Move the cursor at the beginning of the line | `home` | |
| Move the cursor at the end of the line | `end` | |
| Move the cursor at the beginning of the document | `ctrl+home` | |
| Move the cursor at the end of the document | `ctrl+end` | |

**A side note about the `home` key**
Some software, including Visual Studio and Visual Studio Code, allows you to "double-tap" the `home` key, see the example below.

**Beginning state**, the cursor is at the end of the line.
<img src="//cdn.forevolve.com/blog/images/2016/dbl-tap-home-1.png" alt="dbl-tap-home-1" />

The first `home` keypress takes the cursor before the first character of the current line, leaving white spaces left of your cursor.
<img src="//cdn.forevolve.com/blog/images/2016/dbl-tap-home-2.png" alt="dbl-tap-home-2" />

The second `home` keypress takes the cursor at the beginning of the line, before white-spaces.
<img src="//cdn.forevolve.com/blog/images/2016/dbl-tap-home-3.png" alt="dbl-tap-home-3" />

If the cursor is already at the beginning of the line (the left-most side of the line), pressing `home` will get your cursor left of the first character of the line (right of the white-spaces).
<img src="//cdn.forevolve.com/blog/images/2016/dbl-tap-home-2.png" alt="dbl-tap-home-2" />

## Selection shortcuts
> Some general knowledge
>
> * `shift` is usually the "select from A to Z" modifier. Example: in Windows Explorer, you can select all files from your current selection to the file you `shift+click`.
> * `ctrl` is usually the "add this" modifier. Example: in Windows Explorer, you can add a file to your selection (`click` on a file then `ctrl+click` another file and bam! both files are selected).
>
> While selecting text, `shift` is our modifier-key (you will see what I mean shortly).

Now, let's put these shortcuts to good use, with the following "combos."

| Description | Shortcut |
|---------------------------------------------------------|-------------------------|
| Select from the cursor to the previous line | `shift+up arrow` |
| Select from the cursor to the next line | `shift+down arrow` |
| Select a character | `shift+left arrow` |
| | `shift+right arrow` |
| Select a words | `shift+ctrl+left arrow` |
| | `shift+ctrl+right arrow`|
| Select from the cursor to the beginning of the line | `shift+home` |
| Select from the cursor to the end of the line | `shift+end` |
| Select from the cursor to the beginning of the document | `shift+ctrl+home` |
| Select from the cursor to the end of the document | `shift+ctrl+end` |

See? `shift+[navigation shortcut]` = `[selection shortcut]`:)

If all this make little sense, open a text file or a code file and try them out.

They cover a very high number of real-life use-cases, don't be shy to mix and match. Try it out, practice is the best way to achieve everything.

Once you mastered all of these, ask for a raise (I'm not responsible if your boss refuses tho) ;)

### Select a line with the mouse
In many code/text editor, when you put your mouse cursor over the left margin (usually around the line numbers), the cursor will change, and you will be able to select the whole line with only one click. So, no need to waste time doing that manually anymore!

See how it looks in VS Code:
<img src="//cdn.forevolve.com/blog/images/2016/VS-Code-line-selection.png" alt="vs-code-line-selection" />
*Disclaimer: I noticed today that taking a screenshot of a cursor is not a trivial task, so... I kinda photoshopped the cursor...*

You can also `click`, hold down your `click` and move your mouse up or down to select more than one line.

If you followed what I said you should not be mystified by the following: you can `click` the first line then `shift+click` the last line you want to select.

Some software also allows `ctrl+click` to select many non-consecutive lines.

*You could achieve the same with your keyboard hitting `end` then `shift+home` then hold `shift` down and use the `up arrow` or `down arrow` to select multiple lines.*

### Code indentation
Now that we know a few ways to select one or more lines effectively, let's add some code indent shortcut to the list:
* In all code editor that I know of, `Tab` push the selected line(s) right for a predefined number of spaces, usually 2 or 4. You may want to keep the spaces or keep the tabs, but that is another subject for another day (this can get sensible)
* In most code editor that I know of, `shift+Tab` will pull the selected line(s) left for the same predefined number of spaces.

That said, there is no more reason not to format your code right anymore, even if you prefer the use of simple code editors to full-fledged IDE that does it for you.

A good tip, when a code block is formatted very badly (like really messed up):
1. Select all the lines of that code block
1. `shift+Tab` all the lines to the left
1. Select all sub-code-block one by one and format them using tabs

If you do that well, most of the code should be incrementally formatted in a few seconds.

## Visual Studio
For Visual Studio:
* `ctrl+.`brings up the "light bulb."
* `F12` is "go to definition."
* `alt+F12` brings the definition to you, inline.

There is so much more, but let's keep this short.

## Debugger
I think that all debugger that I used maps those two shortcuts while debugging:
* `F10` execute line and go to next line.
* `F11` step in the current line execution. If the line is a method/function call, the debugger will step into that function and allow you to follow that execution as well.

## Chrome and most modern browsers
* `F12` brings out the dev. tools :)

## Conclusion
When I first started to write this article I was sure it would be a short article... Let's call that a fail ;)

On another note, if you try to select text while in a car, a train, etc. you will see how much more stable is your keyboard versus your mouse, mousepad, fingers or Bluetooth pen...

Enjoy!