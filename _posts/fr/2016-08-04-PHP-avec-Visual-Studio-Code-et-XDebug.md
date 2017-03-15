---
title: "PHP avec Visual Studio Code et XDebug"
date:  2016-08-04 00:00:00 -0500
post-img: "img/2016-08-04-php-with-visual-studio-code-and-xdebug.png"
lang: fr
ref: php_vscode_xdebug
categories: fr/articles
redirect_from: "/fr/articles/2016/08/04/php-with-visual-studio-code-and-xdebug/"
---

## Introduction
Pour mon cours d'introduction à la programmation serveur avec PHP et MySQL, j'utilise généralement l'IDE NetBeans, mais cette année j'ai décidé de donner une chance à Visual Studio Code. Bien entendu, avant de choisir un editeur de code, j'ai fait quelques tests de ses capabilités.

Voici la liste des choses que je veux:
* Un environnement simple afin de mettre l’accent sur la programmation et non sur les outils
* Un editeur de code gratuit
* Coloration du code
* Complétion de code PHP de base
* Complétion de code pour PDO
* Déboguer avec breakpoint
* Prise en charge du serveur Web de développement intégré à PHP (sauver les "virtual host" d’Apache ou toute autre configuration ésotérique. Accent: programmation, ce n'est pas un cours orienté sur la gestion de serveur Web)

Ma conclusion: VS Code couvre la majorité de mes attentes pour l'editeur de code d'un cours d'introduction. Le seul problème est que, présentement, l'Intellisense pour PDO est couverte seulement en partie (voire même assez proche de 0%). Mais gardons ceci comme sujet pour un autre jour.

**Dans le tutoriel actuel:**
1. Nous allons <!--more--> installer PHP, MySQL, phpMyAdmin et Apache en utilisant MAMP
1. Nous allons installer Visual studio Code
1. Nous allons installer un plug-in de VS Code, nommé `PHP Debug`
1. Nous allons créer un "projet" (ouvrir un dossier)
1. Nous allons ajouter un fichier `index.php` à notre projet
1. Nous allons configurer le VS Code linter pour qu'il utilise notre installation de PHP (php.exe -l)
1. Nous allons apprendre comment ouvrir une console de ligne de commande directement dans Code
1. Nous aborderons également comment copier et coller dans la console
1. Nous allons démarrer un serveur de développement PHP
1. Nous allons configurer notre installation de PHP afin d'y activer XDebug
1. Nous allons connecter VS Code à XDebug
1. Nous allons ouvrir une session XDebug manuellement et nous allons voir comment utiliser l'extension `xdebug-Helper` de Chrome pour nous faciliter la vie.

Ça fait beaucoup de choses, commençons.

## Installation de PHP et de MySQL avec MAMP
Avant tout, nous devons installer PHP et MySQL. Pour ce faire, nous allons utiliser <a href="https://www.mamp.info/en/">MAMP</a> puisqu'il est compatible Windows et OS X.

### Installation de MAMP
L'installation est assez simple, cliquez suivant, suivant suivant... et le tour est joué. J'ai personnellement décoché l'option "Version Pro" car je ne planifie pas l'acheter, mais si vous planifiez faire beaucoup de PHP, je vous conseille de regarder cette option, peut être que ça serait un 80$ CAD bien investi (à vous de voir).

### Configuration
Maintenant que MAMP est installé, ouvrons-le. L'interface est très minimaliste et tant qu'a moi bien conçu. Difficile d'être plus simple.
<img class="alignnone size-medium wp-image-85" src="http://www.forevolve.com/wp-content/uploads/2016/07/MAMP_01-300x202.png" alt="WAMP" width="300" height="202" />

Si vous voyez le message suivant en ouvrant MAMP, vous devrez changer le port utilisé par Apache.
<img class="alignnone size-medium wp-image-86" src="http://www.forevolve.com/wp-content/uploads/2016/07/MAMP_02-300x103.png" alt="WAMP port alert" width="300" height="103" />

Configurons notre nouvel environnement en cliquant sur « Préférences... »

#### Start/Stop
Dans cet onglet, les options disent bien ce qu'ils font.
<img class="alignnone size-medium wp-image-83" src="http://www.forevolve.com/wp-content/uploads/2016/07/MAMP_03-300x204.png" alt="WAMP Preferences" width="300" height="204" />

#### Ports
Dans cet onglet, nous pourrons changer les ports.
<img class="alignnone size-medium wp-image-84" src="http://www.forevolve.com/wp-content/uploads/2016/07/MAMP_04-300x204.png" alt="WAMP Preferences ports" width="300" height="204" />

À cause d'un conflit avec IIS Express, je dois changer mon port d'Apache, je vais utiliser 8080. J'ai déjà vu Skype causer des problèmes avec le port 80, alors peut-être que c'est la cause de votre message d'erreur. Si MAMP ne vous a pas averti d'un conflit, vous n'avez pas à changer le port d'Apache et vous pouvez sauter cette portion.

Après avoir mis à jour mon port dans MAMP, j'ai découvert que je devais mettre à jour mon `httpd.conf` manuellement. *Vous devrez peut-être redémarrer MAMP si quelque chose semble ne pas avoir fonctionné.*

##### Mettre à jour le port d'Apache
1. Ouvrir **MAMP\bin\apache\conf\httpd.conf**
2. Trouver la ligne `Listen 80` (ctrl+f dans bloc-notes)
3. Changer `80` par le port que vous avez configuré dans MAMP (j'ai utilisé `8080`) alors la ligne devrait ressembler à `Listen 8080`.
4. Sauvegarder le fichier

#### PHP
Nous n'utiliserons pas PHP 7, donc nous allons changer la version à 5.6.21.
<img class="alignnone size-medium wp-image-92" src="http://www.forevolve.com/wp-content/uploads/2016/07/MAMP_05-300x205.png" alt="WAMP Preferences PHP" width="300" height="205" />

#### Serveur Web
Nous ne toucherons à rien ici.
<img class="alignnone size-medium wp-image-93" src="http://www.forevolve.com/wp-content/uploads/2016/07/MAMP_06-300x206.png" alt="MAMP Preferences Web Server" width="300" height="206" />

### Testons notre installation
Retournons dans la fenêtre principale de MAMP et cliquons sur "Open start page". Ça devrait ouvrir la page de démarrage dans un navigateur.

*Si ça ne fonctionne pas, essayer de redémarrer MAMP ou de redémarrer le serveur ("stop servers" ensuite "start servers").*

À partir de cette page Web, nous aurons accès à phpMyAdmin et à `phpinfo`.

<img src="http://www.forevolve.com/wp-content/uploads/2016/07/MAMP_07-300x211.png" alt="MAMP Start page" width="300" height="211" class="alignnone size-medium wp-image-115" />

## Installation et configuration de Visual Studio Code
Maintenant que nous avons MAMP installé et fonctionnel, installons notre editeur de code. Allez à l'adresse suivante afin de télécharger Visual Studio Code: https://www.visualstudio.com/. Assurez-vous de choisir **Code** et non Visual Studio Community, ce n'est pas du tout le même produit.

<img src="http://www.forevolve.com/wp-content/uploads/2016/07/VSCode-Download-284x300.png" alt="VSCode - Download" width="284" height="300" class="alignnone size-medium wp-image-117" />

Exécuter l'installeur, ça devrait être assez similaire à : suivant, suivant, suivant.

### Comment installer des plug-ins
Maintenant que nous avons installé notre editeur de code, nous aurons besoin du plug-in suivant:
* PHP Debug (il nous permettra de connecter Code avec XDebug)

Depuis la mise à jour de juin, il y a un onglet "plug-ins" avec une boite de recherche à l'intérieur.
<img src="http://www.forevolve.com/wp-content/uploads/2016/07/VSCode-Plugins-300x223.png" alt="VSCode - Plugins" width="300" height="223" class="alignnone size-medium wp-image-118" />
*Le chiffre 3 représente le nombre de plug-ins ayant des mises à jour disponibles*

1. Recherchez le plug-in désiré (dans notre cas, cherchez "php")
1. Optionnelement, vous pouvez cliquer sur le plug-in afin de voir sa description
1. Cliquez sur le bouton "Installer" ("Install") vert
1. Redémarer VS Code (vous pouvez installer plusieurs plug-ins avant de redémarrer)

### Dossier VS Code ("folder")
Dans code un projet est nommé un dossier, car, en gros, nous ouvrons simplement un dossier (fichiers et sous-dossiers).

Créons notre premier projet PHP:
1. Cliquez sur *Fichier > Ouvrir un dossier* ("File > Open folder...")
1. Choisissez votre dossier de travail (ou créer en un)¸
1. Cliquez sur *Choisir le dossier* ("Select Folder")

*Voir [The Basics of Visual Studio Code](https://code.visualstudio.com/docs/editor/codebasics) pour plus d'information sur Visual Studio Code.*

Voici ma structure de projet (j'ai volontairement choisi cette structure afin de démarrer un serveur PHP ayant comme racine un sous-répertoire)
<img src="http://www.forevolve.com/wp-content/uploads/2016/07/VSCode-project2.png" alt="VSCode - project2" width="280" height="184" class="alignnone size-full wp-image-128" />

J'ai ajouté un gabarit de base de Bootstrap 3 (à l'aide du plug-in de VS Code nommé `Bootstrap 3 Snippets` pour les intéressés) dans mon `index.php`, mais ce n'est pas important, n'importe quoi fera l'affaire:
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

## Serveur de développement PHP
Maintenant que nous avons un projet ouvert dans Code et un fichier PHP, il nous reste encore quelques petites choses à faire avant d'aller le voir dans un navigateur.

### Indiquer à Code où se trouve PHP
Indiquons où est PHP afin que Code puissent utiliser le "linter" par défaut de PHP (`php.exe -l`) afin de valider nos erreurs. Par défaut, Code validera notre code lors de la sauvegarde d'un fichier.

Nous allons modifez la configuration de notre utilisateur dans Code ("User settings"). De cette façon, tous nos projets seront configurés ainsi. *Chaque projet peut également avoir sa propre configuration.*
<img src="http://www.forevolve.com/wp-content/uploads/2016/07/VSCode-Settings2-263x300.png" alt="VSCode Settings" width="263" height="300" class="alignnone size-medium wp-image-129" />
*Les configurations dans Code sont au format JSON, se qui offrent une façon flexible et facile à géré (et lisible pour un humain).*

Allons configurer la variable `php.validate.executablePath` dans notre fichier JSON.
```JSON
// Place your settings in this file to overwrite the default settings
{
    "php.validate.executablePath": "PATH TO MAMP\\bin\\php\\php5.6.21\\php.exe" 
}
```
**Remarquez-les `\\` à la place de `\`. Nous devons "escape" les "\" dans une chaine de caractères JSON, tout comme en JavaScript ou dans d'autres langages de programmation.**

Par défaut, "PATH TO MAMP" devrait être `c:\mamp`. Le chemin complet vers `php.exe` sera donc `c:\mamp\bin\php\php5.6.21\php.exe` (ne pas oublier de convertir en "double-slash").

*Pour plus d'info sur Code et PHP: [PHP Programming in VS Code](https://code.visualstudio.com/docs/languages/php).*

### Ouverture d'une console
Pour démarrer notre serveur, nous aurons besoin d'une console. Pour ce faire, allez dans **View > Integrated terminal**.
<img src="http://www.forevolve.com/wp-content/uploads/2016/07/VSCode-console-140x300.png" alt="VSCode - console" width="140" height="300" class="alignnone size-medium wp-image-120" />
*Il est également possible d'avoir plusieurs consoles ouvertes en même temps.*

#### Copier/coller
Dans la console, les raccourcis **ctrl+c** et **ctrl+v** ne sont pas encore supportés. Pour copier/coller, vous devrez utiliser les raccourcis clavier suivants:
* Copier: **ctrl+insert**
* Coller: **shift+insert**

### Démarage du serveur
Dans la console, la commande suivante indiquera à PHP de démarrer un serveur dans le répertoire `www`:
```
PATH TO MAMP\bin\php\php5.6.21\php.exe -S localhost:8000 -t src/www
```
<img src="http://www.forevolve.com/wp-content/uploads/2016/07/VSCode-project2.png" alt="VSCode - project2" width="280" height="184" class="alignnone size-full wp-image-128" />

Si vous naviguez jusqu'à l'adresse suivante dans un navigateur `http://localhost:8000/`, vous devriez voir le contenu de votre fichier `index.php`.

#### Morcelons la commande
* `-S localhost:8000` défini l'hôte ("host") et le port
* `-t src/www` définit, optionnellement, la racine du site Web 

Pour un dossier où la racine Web est la même que celle du projet (voir capture ci-bas), vous pourriez exécuter la commande suivante:
```
PATH TO MAMP\bin\php\php5.6.21\php.exe -S localhost:8000
```
<img src="http://www.forevolve.com/wp-content/uploads/2016/07/VSCode-sinple-project.png" alt="VSCode - simple project" width="274" height="111" class="alignnone size-full wp-image-131" />

## Configuration de XDebug
Maintenant que tout est prêt, il ne nous reste plus qu'à configurer XDebug.

### Ajoutons un peu de PHP afin de créer un "breakpoint"
Dans notre fichier `index.php` ajoutons une petite ligne de PHP: n'importe quoi, vraiment. Tout ce que nous voulons c'est de tester notre connexion entre Code et XDebug:
<img src="http://www.forevolve.com/wp-content/uploads/2016/07/VSCode-some-php.png" alt="VSCode - some php" width="261" height="150" class="alignnone size-full wp-image-135" />

* Afin de créer un **breakpoint**, cliquez dans la marge
* Afin de supprimer un breakpoint, cliquez dessus

*Si vous ne savez pas ce qu'est un breakpoint, vous le verrez sous peu (rapidement du moins).*

### Activation de XDebug
Les configurations de PHP sont sauvegardées dans un fichier nommé `php.ini`. Ce fichier est dans le même dossier que l'exécutable `php.exe`.

Allons dans le dossier de PHP: `PATH TO MAMP\\bin\\php\\php5.6.21\\`. 
MAMP n'a pas créé de fichier `php.ini` mais plutôt deux gabarits: `php.ini-development` et `php.ini-production`. Dupliquez le fichier `php.ini-development` et renommez la copie `php.ini`.

Votre dossier devrait maintenant ressembler à ceci:
<img src="http://www.forevolve.com/wp-content/uploads/2016/07/PHP-ini.png" alt="PHP - ini" width="619" height="163" class="alignnone size-full wp-image-136" />

#### L'intérieur du fichier `php.ini`
Ce qui est écrit à l'intérieur de ce fichier contrôle le comportement de PHP. Je n'irai pas plus loin sur ce sujet pour l'instant, mais si ça vous intéresse, vous trouverez des tonnes d'informations en googlant un peu, et ce, sans trop de difficulté j'en suis sur.

Pour XDebug, nous devons ajouter le bloc de code suivant dans le bas de notre fichier `php.ini`:
```
[xdebug]
zend_extension = "PATH TO MAMP/bin/php/php5.6.21/ext/php_xdebug.dll"
xdebug.remote_enable=1
xdebug.remote_host=localhost
xdebug.remote_port=9000
```
*Si vous avez un serveur PHP en marche, après avoir fait des modifications dans se fichier, vous devrez le redémarrer. Dans la console de Code, appuyez sur `Ctrl+C` afin d'arrêter votre serveur, ensuite appuyez sur `flèche vers le haut` afin de réécrire votre dernière commande et finalement appuyez sur `entrée` pour l'exécuter.*

### Création du fichier `launch.json`
Afin de connecter Code avec XDebug, nous devons créer des commandes que Code utilisera. Sans trop entrer dans les détails, notre plug-in fera tout ça pour nous. Ces commandes sont sauvegardées dans un fichier nommé `launch.json` qui est situé dans un dossier `.vscode`:
1. Allez dans l'onglet débogage
1. Appuyer sur le bouton de lecture vert ("play"), ce qui devrait ouvrir un menu
1. Dans ce menu, sélectionné PHP afin de créer le fichier `launch.json`
1. par la suite, cliquez sur le bouton de lecture vert ("play") de nouveau afin de démarrer le mode "écoute de XDebug".

<img src="http://www.forevolve.com/wp-content/uploads/2016/07/VSCode-debug.png" alt="VSCode - debug" width="959" height="272" class="alignnone size-full wp-image-134" />

Votre fichier `launch.json` devrait ressembler à ceci:
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
*Le numéro de port doit être le même dans le fichier `launch.json` et dans le fichier `php.ini`.*


### Débutter une session XDebug manuellement
Afin de commencer une session XDebug, nous n'avons qu'à ajouter le paramètre d'URL suivant à notre page: `?XDEBUG_SESSION_START`
Exemple: `http://localhost:8000/?XDEBUG_SESSION_START`

Si vous l'essayez, l'exécution de la page devrait être arrêté à la ligne 2 de votre fichier `index.php` (sur votre "breakpoint") dans VS Code.
<img src="http://www.forevolve.com/wp-content/uploads/2016/07/VSCode-debug-breakopint.png" alt="VSCode - debug - breakopint" width="856" height="147" class="alignnone size-full wp-image-137" />

*Pour plus d'information sur XDebug, vous pouvez regarder [leur site Web](https://xdebug.org/) ou encore [Debugging and Profiling PHP with Xdebug](https://www.sitepoint.com/debugging-and-profiling-php-with-xdebug/).*

### Une extension pour Google Chrome
Si vous êtes comme moi et n'aimez pas avoir a vous souvenir de ces détails ou encore d'ajouter des paramètres d'URL, il y a une extension pour Google Chrome qui nous sera très pratique: [xdebug-helper](https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc/related?hl=en).

L'extension ajoute une petite icône. Quand vous cliquez dessus l'extension nous offre quelques options incluant "Debug" (commencer une session de débogage) et "Disable" (fin de la session de débogage).
<img src="http://www.forevolve.com/wp-content/uploads/2016/07/Chrome-XDebug-extension.png" alt="Chrome XDebug extension" width="153" height="211" class="alignnone size-full wp-image-142" />

*Il y a plusieurs façons d'utiliser XDebug, le plug-in utilise un témoin ("cookie") plutôt qu'un paramètre d'URL. C'est pour cela que vous ne voyez pas de `XDEBUG_SESSION_START` et que ça fonctionne quand même.*

## Conclusion
Ayant maintenant atteint la fin, récapitulons nos réalisations:
1. Nous avons installer PHP, MySQL, phpMyAdmin et Apache en utilisant MAMP
1. Nous avons installé Visual studio Code
1. Nous avons installé un plug-in de VS Code, nommé `PHP Debug`
1. Nous avons créé un "projet" (ouvert un dossier)
1. Nous avons ajouté un fichier `index.php` à notre projet
1. Nous avons configuré le VS Code linter pour qu'il utilise notre installation de PHP
1. Nous avons appris comment ouvrir une console directement dans Code
1. Nous avons également vu comment copier et coller dans la console
1. Nous avons démarré un serveur de développement PHP
1. Nous avons configuré notre installation de PHP afin d'y activer XDebug
1. Nous avons connecté VS Code à XDebug
1. Nous avons ouvert une session XDebug manuellement et nous avons vu comment utiliser l'extension `xdebug-Helper` de Chrome pour nous faciliter la vie.

Maintenat que tout est connecté, nous pouvons écrire du PHP et le déboguer avec Visual Studio Code!

Pour nos **nouveaux projets**, nous n'aurons qu'à laisser `PHP Debug` (notre plug-in de VS Code) créer le fichier `launch.json` pour nous et voilà!