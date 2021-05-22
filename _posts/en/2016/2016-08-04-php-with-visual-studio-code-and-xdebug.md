---
title:  "PHP with Visual Studio Code and XDebug"
date:   2016-08-04 00:00:00 -0500
post-img: "//cdn.forevolve.com/blog/images/articles-header/2016-08-04-php-with-visual-studio-code-and-xdebug.png"
lang: en
ref: php_vscode_xdebug
categories: en/articles
redirect_from: "/articles/2016/08/04/php-with-visual-studio-code-and-xdebug/"
proficiency-level: Novice
tags: 
- PHP
- Visual Studio Code
---

## Introduction
In my introductory class to server-side programming with PHP and MySQL, I need a code editor or a full-featured IDE. Usually I go with NetBeans, but this year i decided to give the new cool kid a shot, so i picked : Visual Studio Code. Before officially choosing anything, I had to test its capabilities.

Here is what I am looking for:
* A simple environment to focus on programming instead of on infrastructure (introduction on programming need to be on programming, not on tooling)
* A free code editor (who does not like free stuff?)
* Code coloring
* Basic PHP code completion support
* PDO code completion support (there is a part about database)
* Debugger with breakpoints
* Support for PHP built-in Web server (no Apache virtual host or any other esoteric setup to manage, again, programming should be the focus)

My conclusion: VS Code covers most of my expectation for an introductory class code editor.
The only problem is that, as of today, the PDO Intellisense is only partly covered and pretty close to 0%. Let this be a subject for another day.

**In the current tutorial:** 
1. We will <!--more--> install PHP, MySQL, phpMyAdmin and Apache using MAMP
1. We will install Visual Studio Code
1. We will install a VS Code plugin, named `PHP Debug` 
1. We will create a project (well its called opening a folder)
1. We will add an `index.php` file to our project
1. We will configure VS Code linter to use our PHP installation
1. We will learn how to open a command line console directly in Code
1. We will also cover how to copy and paste in the console
1. We will start a PHP development server
1. We will configure our PHP installation and activate XDebug
1. We will connect VS Code to listen to XDebug
1. We will start an XDebug session manually and we will see how to use the `xdebug-helper` Chrome extension instead

That's a lot of stuff, so lets get started...

## Installing PHP & MySQL with MAMP
Before coding in PHP, you need PHP installed and before connecting to MySQL, you need MySQL installed as well. Pretty obvious right?

For easy installation, I recommend <a href="http://www.wampserver.com/">WAMP</a> or <a href="https://www.mamp.info/en/">MAMP</a>.
I usually go with WAMP, but let's try MAMP today since it is compatible with both Windows and OS X.

### Installing MAMP
Its pretty straight forward, you download the installer, click next, next, next and it is installed. I unchecked the Pro Version checkbox since I do not plan to buy it. If you do plan on doing a lot of PHP development, it might be a good idea to take a look at the MAMP Pro version, its only about 80$ CAD (well, that's up to you).

### Configuration
Now that MAMP is installed, lets open it. It is a nice clean and minimalist window with a few options in it: Preference, Open start page and Start Servers.
<img src="//cdn.forevolve.com/blog/images/2016/MAMP_01.png" alt="WAMP" />

If you see the following error message, don't worry you can easily change the port number by configuring MAMP.
<img src="//cdn.forevolve.com/blog/images/2016/MAMP_02.png" alt="WAMP port alert" />

As we are heading toward configuring our environment, lets click the **Preferences...** button.

#### Start/Stop
In this tab, there is some basic options, that are pretty self-explanatory.
<img src="//cdn.forevolve.com/blog/images/2016/MAMP_03.png" alt="WAMP Preferences" />

#### Ports
This is the tab to use to change port numbers.
<img src="//cdn.forevolve.com/blog/images/2016/MAMP_04.png" alt="WAMP Preferences ports" />

Due to a conflict with IIS Express, I need to change my Apache port to 8080. Skype also cause conflict some times, so if you have Skype installed, that might be the cause of the problem. If MAMP did not alert you of a port conflict, you don't need to change anything so you can skip this part.

After updating MAMP Apache port number, I found out that I also needed to update my Apache `httpd.conf` file as well. <em>You may also need to restart MAMP if something seems wrong.</em>

##### Update Apache port number
1. Open **MAMP\bin\apache\conf\httpd.conf**
2. Find the line `Listen 80` (ctrl+f in notepad)
3. Change `80` by the port you configured (i used `8080`) so the line should now look like `Listen 8080`.
4. Save the file

#### PHP
We wont use PHP 7, so I will change the version to 5.6.21.
<img src="//cdn.forevolve.com/blog/images/2016/MAMP_05.png" alt="WAMP Preferences PHP" />

#### Web Server
We wont touch this.
<img src="//cdn.forevolve.com/blog/images/2016/MAMP_06.png" alt="MAMP Preferences Web Server" />

### Testing our installation
Back on the main window, if we click "Open start page" it should open the start page. I love when software's are that self-explanatory!

*If the page does not open or if there seems to be a problem, try to restart your MAMP (or the servers: "stop servers" then "start servers").*

From this Web page, we have access to phpMyAdmin and to the `phpinfo`.

<img src="//cdn.forevolve.com/blog/images/2016/MAMP_07.png" alt="MAMP Start page" />

## Setting up Visual Studio Code

Now that we have MAMP up and running, lets install our code editor. First head to https://www.visualstudio.com/ and download "Code". Make sure you pick **Code**, not Visual Studio Community, that is a totally different product.

<img src="//cdn.forevolve.com/blog/images/2016/VSCode-Download.png" alt="VSCode - Download" />

Run the installer, again its a pretty straight forward installation.

### How to install plugins
Now that we have installed our code editor, we will need to install the following plugin:
* PHP Debug (it will allow us connect Code with XDebug)

Since June update there is a plugin "tab" with a search box.
<img src="//cdn.forevolve.com/blog/images/2016/VSCode-Plugins.png" alt="VSCode - Plugins" />
*The small number (3 in the screenshot) is the number of plugins that have available updates.*

1. Search for the plugin you want (in our case, just search for "php")
1. Optionally, when you see a plugin that you might want to install, click on it. This will open its "read me" file. Usually it contains a description of the plugin, how to install it, how it works, etc.
1. Click on the green "Install" button to install.
1. Restart VS Code (you can install multiple plugins before restarting)

### VS Code folder
In code, a project is named a folder, so you basically open a directory and work with it.

Lets create our PHP project.
1. Click "File > Open folder..."
1. Select your working directory (or create one)
1. Click "Select Folder"

*See [The Basics of Visual Studio Code](https://code.visualstudio.com/docs/editor/codebasics) for more info about Visual Studio Code.*

This is my project structure (i choose this directory structure to show you how to start the PHP server within a sub-directory):
<img src="//cdn.forevolve.com/blog/images/2016/VSCode-project2.png" alt="VSCode - project2" />

In my `index.php`, I've added basic Bootstrap 3 template code, but that doesn't really matter. Here is my code (from the `Bootstrap 3 Snippets` VS Code plugin):
```HTML
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Title Page</title>

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
        <h1 class="text-center">Hello World</h1>

        <!-- jQuery -->
        <script src="//code.jquery.com/jquery.js"></script>
        <!-- Bootstrap JavaScript -->
        <script src="//netdna.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    </body>
</html>
```

## PHP development server
Now that we have an opened folder and a PHP page that we want to see in a browser, we still have a few things to do to make it work out.

### Tell Code where is PHP
We will first tell Code about our PHP installation. Code will use the default PHP linter `php.exe -l` to validate our code and to underline errors. By default, the validation happen on file save but you could configure it to happen when typing.

To do that, we need to alter our configuration. I decided to go for "User settings", this way it will be done for all of my projects. It is also possible to have different settings per project, but lets just focus on **User settings** for now.
<img src="//cdn.forevolve.com/blog/images/2016/VSCode-Settings2.png" alt="VSCode Settings" />

*Settings, in Code, use the JSON format which is flexible and easy to manage (and human readable).*

Lets configure our `php.validate.executablePath`, your configuration file should now look like this:
```JSON
// Place your settings in this file to overwrite the default settings
{
    "php.validate.executablePath": "PATH TO MAMP\\bin\\php\\php5.6.21\\php.exe" 
}
```
**Notice the `\\` instead of `\`. We are in a JSON string and we need to escape slashes, like in JavaScript and many other programming languages.**

By default, the "PATH TO MAMP" is `c:\mamp`. The full path to `php.exe` should look like this: `c:\mamp\bin\php\php5.6.21\php.exe` (don't forget to escape the slashes).

*For more info on Code and PHP, see [PHP Programming in VS Code](https://code.visualstudio.com/docs/languages/php).*

### Opening a console
To start our server, we will need a console. To do that, go to **View > Integrated terminal**.
<img src="//cdn.forevolve.com/blog/images/2016/VSCode-console.png" alt="VSCode - console" />
*You can even have multiple consoles open at the same time.*

#### Copy/paste
In the console, **ctrl+c** and **ctrl+v** are not yet supported. To copy/paste you need to use these shortcut instead:
* Copy: **ctrl+insert**
* Paste: **shift+insert**

### Starting the server
In the console, we will tell PHP to start a development server in our `www` sub directory by typing the following command:
```
PATH TO MAMP\bin\php\php5.6.21\php.exe -S localhost:8000 -t src/www
```
<img src="//cdn.forevolve.com/blog/images/2016/VSCode-project2.png" alt="VSCode - project2" />

If you visit `http://localhost:8000/` in a browser, you should see the content of your `index.php` file.

#### Breaking down the command
* `-S localhost:8000`indicate the server host and port.
* `-t src/www` indicate the web root.

For a folder without sub-directories, where `index.php` is at the root (see screenshot below), you can run this command instead:
```
PATH TO MAMP\bin\php\php5.6.21\php.exe -S localhost:8000
```
<img src="//cdn.forevolve.com/blog/images/2016/VSCode-sinple-project.png" alt="VSCode - simple project" />


## Setting up XDebug
Now that we have everything setup, lets connect XDebug to Code.

### Lets write some PHP and create a breakpoint
Lets add a bit of PHP in our `index.php` file (we need something to test our connection):
<img src="//cdn.forevolve.com/blog/images/2016/VSCode-some-php.png" alt="VSCode - some php" />

* To create a **breakpoint**, click in the margin. 
* To remove it, click the breakpoint again.

*If you don't know what a breakpoint is, just create one anyway and you will soon discover what it does.*

### Configure PHP to enable XDebug
PHP use configuration saved in a text file named `php.ini`. That file is located in the same directory as `php.exe`. 

Lets go to our PHP installation directory: `PATH TO MAMP\\bin\\php\\php5.6.21\\`. 
As you can see MAMP does not create the `php.ini` file but instead it created two templates: `php.ini-development` and `php.ini-production`. To create our `php.ini` file, lets duplicate the `php.ini-development` file and rename the copy `php.ini`.

Your PHP directory should now look like this:
<img src="//cdn.forevolve.com/blog/images/2016/PHP-ini.png" alt="PHP - ini" />

#### Inside the php.ini file
In this file you can control how PHP does things. I wont go deep into it, but if you are interested, you can easily find tons of info by googling a bit.

We want to add the following code at the bottom of `php.ini`:
```
[xdebug]
zend_extension = "PATH TO MAMP/bin/php/php5.6.21/ext/php_xdebug.dll"
xdebug.remote_enable=1
xdebug.remote_host=localhost
xdebug.remote_port=9000
```
*When you do configuration changes, if you have a running PHP development server, you need to restart it. To do so, in the console, hit `Ctrl+C` to stop it, then `up arrow` to write your last command back, then press `enter` to execute it.*

### Create the `launch.json` file
To start debugging in Code, you will need to add some commands somewhere. That somewhere is a file named `launch.json`. But don't worry our plugin will do it for us:
1. Go to the debug tab
1. Click the green "play" button, this should open the command menu
1. In the command menu, choose PHP and it will create a `launch.json` file in a `.vscode` directory.
1. Click the green "play" button again to "Listen for XDebug"

<img src="//cdn.forevolve.com/blog/images/2016/VSCode-debug.png" alt="VSCode - debug" />

Your `launch.json` file should look like this:
```JSON
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Listen for XDebug",
            "type": "php",
            "request": "launch",
            "port": 9000
        },
        {
            "name": "Launch currently open script",
            "type": "php",
            "request": "launch",
            "program": "${file}",
            "cwd": "${fileDirname}",
            "port": 9000
        }
    ]
}
```
*The port must be the same in both `launch.json` and `php.ini` files.*

### Manually starting a XDebug session
In your browser, you only have to add the following querystring to the URL you want to start debugging: `?XDEBUG_SESSION_START`.
Example: `http://localhost:8000/?XDEBUG_SESSION_START`

If you try it, your code should break in Code at line 2 of your `index.php` file.

<img src="//cdn.forevolve.com/blog/images/2016/VSCode-debug-breakopint.png" alt="VSCode - debug - breakopint" />

*For more info on XDebug, you can take a look at [their website](https://xdebug.org/) or at [Debugging and Profiling PHP with Xdebug](https://www.sitepoint.com/debugging-and-profiling-php-with-xdebug/).*

### Google chrome extension
If you are like me and don't like to remember those kind of things and that don't want to bother about navigation and all that stuff, you will find the following Chrome extension very handy: [xdebug-helper](https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc/related?hl=en).

It add a little "bug" icon. When you click on it, it shows you a few options including "Debug" (which start a debugging session) and "Disable" (which end the debugging session).
<img src="//cdn.forevolve.com/blog/images/2016/Chrome-XDebug-extension.png" alt="Chrome XDebug extension" />

*There is multiple ways to start an XDebug session, the plugin use cookies instead of querystrings.*

## Conclusion
Now that we are done, lets recap on what we achieved:
1. We installed PHP, MySQL, phpMyAdmin and Apache using MAMP
1. We installed Visual Studio Code
1. We installed the Code `PHP Debug` plugin
1. We created a project (well we opened a folder) 
1. We added an `index.php` file to our project
1. We configured VS Code linter to use our PHP installation
1. We learnt how to open a command line console directly in Code
1. We also covered how to copy and paste in the console
1. We started a PHP development server (in our folder root or in a sub-directory)
1. We configured our PHP installation and activated XDebug
1. We connected VS Code to listen to XDebug
1. We started an XDebug session manually and how to lazily use the `xdebug-helper` Chrome extension to not bother about additional querystrings

Now that everything is connected, we can write some PHP and debug it using Visual Studio Code! 

For **new projects** we only need to have VS Code `PHP Debug` extension create the `launch.json` file for us and voilà!