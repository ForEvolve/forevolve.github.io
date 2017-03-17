---
title: "How to add jQuery Intellisense to a Visual Studio Code JavaScript file"
date:  2016-08-12 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2016-08-12-jQuery-intellisense-in-vs-code.png"
lang: en
ref: jquery_intellisense_vscode
categories: en/articles
redirect_from: "/articles/2016/08/12/how-to-add-jquery-intellisense-to-a-visual-studio-code-javascript-file/"
---

## Before starting
If you really just want to execute the steps without any explanation, try to jump right to the [Conclusion](#conclusion) section. 

That being said, you can always read the parts that you are not sure about later :)

## Prerequisites
Before going further, you will need `node.js` and `npm`. If you don't know what those are, lets just say that `npm` is a package manager and it requires Node. We will use `npm` from within VS Code (in command line), to help us install our **jQuery "IntelliSense" definition file**.<!--more-->
1. <a href="https://nodejs.org/en/download/current/" target="_blank">Node.js</a>
1. NPM is packaged with Node, so no more action are required here :)

Install Node and NPM and make sure the path is added to you `PATH` environment variable. This way, you will be able to get access to **node** and **npm** from everywhere without typing the file path every time. Which will become really useful really fast, I am telling you. 

*If I remember well, during the installation process, the installer will prompt you about that. But its been a while since I installed Node, so I might be wrong here.*

After the installation, open a console (`cmd` for Windows users) and type `npm`. If this does not work, look at the following link: [fixing npm path in Windows 8](http://stackoverflow.com/questions/27864040/fixing-npm-path-in-windows-8#27864253). For other Windows versions this will be pretty similar. For other OS, I really don't know - Google is your friend tho... sry

## jQuery IntelliSense
### The project directory
Now that Node.js and NPM are installed, lets create a Visual Studio Code `folder`. I created my project there at `F:\Repos\BlogPost\jquery-intellisense`.

**Here is my project structure:**
<img src="//cdn.forevolve.com/blog/images/2016/vs-code-jquery-project-structure.png" alt="vs-code-jquery-project-structure" />

In my `index.html` file I used the **Bootstrap 3 Snippets** extension to create the basic layout (`bs3-template:html5` snippet). I changed the linked jQuery file to the version 3.1.0 and I also included the `integrity` and `crossorigin` attributes to my `script` tag. 
<a href="https://marketplace.visualstudio.com/items?itemName=wcwhitehead.bootstrap-3-snippets" target="_blank"><img src="//cdn.forevolve.com/blog/images/2016/bs-3-snippets-vs-code-extension.png" alt="bs-3-snippets-vs-code-extension" /></a>

**Here is the full `index.html` file:**
{% highlight html %}
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>How to add jQuery IntelliSense to a Visual Studio Code JavaScript file</title>

        <!-- Bootstrap CSS -->
        <link href="//netdna.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet">

        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
            <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
        <![endif]-->
    </head>
    <body>
        <h1 class="text-center">How to add jQuery IntelliSense to a Visual Studio Code JavaScript file</h1>

        <!-- jQuery -->
        <script src="http://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>
        <!-- Bootstrap JavaScript -->
        <script src="//netdna.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
        <script src="js/app.js"></script>
    </body>
</html>
{% endhighlight %}

### jQuery TypeScript type definitions
Now, you might think the following: 
> Why is the title saying *JavaScript* but now you talk about *TypeScript* ?

We will use a **TypeScript type definitions** file in JavaScript. 

*If you don't know TypeScript, this is also a nice topic to look into. But lets keep this for another day...*

#### Installing TSD globally
Lets install the npm package named [TSD](https://www.npmjs.com/package/tsd) globally, by typing the following command:
```
npm install tsd -g
```
*Open a console (a VS Code terminal, a `cmd` for Windows users, etc.), it doesn't really matter since we are installing the package globally.*

#### Installing the jQuery TypeScript type definitions file
Once this is done, open a new console (or use the same one), but this time, make sure that you are in your project `folder`.
<img src="//cdn.forevolve.com/blog/images/2016/vs-code-jquery-terminal.png" alt="vs-code-jquery-terminal" />

Type the following command:
```
tsd install jquery --save
```
*This will install the TypeScript type definitions file we are looking for.*

Your project structure should now look like this:
<img src="//cdn.forevolve.com/blog/images/2016/vs-code-jquery-project-structure-2.png" alt="vs-code-jquery-project-structure-2" />

#### Use the definition file(s)
Lets open our `app.js` file. If you type `$` there is still nothing. To enable jQuery IntelliSense, we need to add a `///` reference instruction to our JavaScript file.

For some reasons, VS Code does not update after you type the `path`so if you are stuck with an error like the following, reopen the file and it should fix it.
<img src="//cdn.forevolve.com/blog/images/2016/vs-code-jquery-intellisense-error.png" alt="vs-code-jquery-intellisense-error" />

Here is the copyable snippet:
```JavaScript
/// <reference path="../typings/tsd.d.ts" />
```
*This basically told VS Code to append the type definitions contained in our `tsd.d.ts` file to its actual IntelliSense.*

If you open the `tsd.d.ts` file you will see a reference to `jquery/jquery.d.ts` which is our jQuery type definitions file (the file we "installed" earlier). So, by linking the `tsd.d.ts` in our JavaScript files, it allows us to include all our loaded type definitions files at  once (we only have jQuery for now, but who knows the future ;) ).

Back to our `app.js` file, we now have full jQuery IntelliSense:
<img src="//cdn.forevolve.com/blog/images/2016/vs-code-jquery-intellisense-3.png" alt="vs-code-jquery-intellisense-3" />
<img src="//cdn.forevolve.com/blog/images/2016/vs-code-jquery-intellisense-2.png" alt="vs-code-jquery-intellisense-2" />

## What to do in your next project
Now that we have everything setup and working, the only thing you need to do in your next project is to [Install the jQuery TypeScript type definitions file](#installing-the-jquery-typescript-type-definitions-file) and `reference` it in your JavaScript files, as explained in the [Use the definition file(s)](#use-the-definition-files) section.

So the command you want to remember is this one:
```
tsd install jquery --save
```

And this one:
```JavaScript
/// <reference path="../typings/tsd.d.ts" />
```
*Note that the value of the `path` attribute must match your `tsd.d.ts` file location, so you might need to adjust it.*

## Conclusion
It was pretty strait forward, assuming you already had **Node.js** and **npm** installed, we did the following:
1. Create a folder and add some file in it (or open an existing one)
1. Install **TSD** globally using the following command: `npm install tsd -g`
1. Install the jQuery type definitions file in our project using the following command: `tsd install jquery --save`
1. Add a reference to our `tsd.d.ts` file in our `app.js`file (or the file you want jQuery IntelliSense in) using the following triple-slash comment: `/// <reference path="../typings/tsd.d.ts" />`

... And voilà!

Happy coding!