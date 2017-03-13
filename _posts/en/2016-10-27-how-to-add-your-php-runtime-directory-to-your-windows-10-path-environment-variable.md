---
title: "How to add your PHP runtime directory to your Windows 10 PATH environment variable"
date:  2016-10-27 -0500
post-img: "img/2016-10-27-how-to-add-your-php-runtime-directory-to-your-windows-10-path-environment-variable.png"
lang: en
categories: en/articles
---

Today I will explain how to add your PHP runtime directory to your Windows 10 `PATH` environment variable.
This will give you global access to `php.exe` from any command prompt.

*Please note that you must reopen your command prompt windows (if you had any open prior to the update).*

*Command prompt loads the `PATH` environment variable when it is first open.*

## Target audience

* Windows 10 users
* PHP developers that want PHP to be globally accessible from any command prompt (ex.: php.exe for "linting" or to start a dev. server)

*Note that you are not limited to PHP, this can be any directory containing any program - ex.: `npm`*
<!--more-->

## How to

> Copy shortcut: `ctrl+C`
> Paste shortcut: `ctrl+V`

1. Find your PHP installation directory and copy it somewhere (your clipboard is a good place)
    * For MAMP users it will be something like `C:\MAMP\bin\php\php5.6.21` (the PHP version may vary).
1. Right-click on the "Start menu"
1. Click "System" <img src="http://www.forevolve.com/wp-content/uploads/2016/10/Win-Path-01.png" alt="win-path-01" class="alignnone size-full wp-image-361" />
1. Click "Advanced system settings" <img src="http://www.forevolve.com/wp-content/uploads/2016/10/Win-Path-02.png" alt="win-path-02" class="alignnone size-full wp-image-361" />
1. Click "Environment Variables..." <img src="http://www.forevolve.com/wp-content/uploads/2016/10/Win-Path-03.png" alt="win-path-03" class="alignnone size-full wp-image-361" />
1. Select the "Path" variable (in your user or in the system list)
1. Click "Edit..." <img src="http://www.forevolve.com/wp-content/uploads/2016/10/Win-Path-04.png" alt="win-path-04" class="alignnone size-full wp-image-361" />
1. Click "New"
1. Paste your PHP path <img src="http://www.forevolve.com/wp-content/uploads/2016/10/Win-Path-05.png" alt="win-path-05" class="alignnone size-full wp-image-361" />
1. Click OK
1. Click OK
1. Click OK
1. Close your "system window"

And voilà!

## How to test if it worked out

1. Open a command prompt
    1. Right-click on the start menu
    1. Click "Command Prompt" or  "Command Prompt (admin)"
1. In the command prompt, type `php -?`

If it displays PHP help then it worked!