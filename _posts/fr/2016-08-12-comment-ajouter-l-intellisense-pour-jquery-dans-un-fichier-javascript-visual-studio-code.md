---
title: "Comment ajouter l'IntelliSense pour jQuery dans un fichier JavaScript - Visual Studio Code"
date:  2016-08-12 00:00:00 -0500
post-img: "img/2016-08-12-jQuery-intellisense-in-vs-code.png"
lang: fr
ref: jquery_intellisense_vscode
categories: fr/articles
redirect_from: "/fr/articles/2016/08/12/how-to-add-jquery-intellisense-to-a-visual-studio-code-javascript-file/"
---

## Avant propos
Si vous voulez uniquement exécuter les étapes sans lire les explications, vous pouvez essayer de sauter directement à la [Conclusion](#conclusion).

Cela étant dit, rien ne vous empêchera de relire les sections pour lesquelles vous avez besoin de plus d'explications plus tard :)

## Prérequis
Nous aurons besoin de `node.js` et de `npm` afin de réaliser ce tutoriel. `npm` est le "package manager" que nous utiliserons afin de télécharger notre fichier de définition de jQuery.<!--more-->
1. <a href="https://nodejs.org/en/download/current/" target="_blank">Node.js</a>
1. NPM s'installera avec Node.js

Assurez-vous que le chemin vers npm est configuré dans votre variable d'environnement `PATH`. De mémoire, ça se fait durant l'installation, mais peut être que je me trompe.
Si vous tapez `npm` dans une console (`cmd` sous Windows) et que le fichier n'existe pas, voici une piste de référence pour les utilisateurs de Windows: [fixing npm path in Windows 8](http://stackoverflow.com/questions/27864040/fixing-npm-path-in-windows-8#27864253). 

## L'IntelliSense de jQuery
### La structure du projet
Maintenant que nous avons `node.js` et `npm` installé, créons un projet afin de tester le tout.
Dans Visual Studio Code j'ai créé mon `folder` sous `F:\Repos\BlogPost\jquery-intellisense`.

**Voici ma structure de projet:**
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/vs-code-jquery-project-structure.png" alt="vs-code-jquery-project-structure" width="270" height="104" class="alignnone size-full wp-image-253" />

Dans mon fichier `index.html`, j'ai utilisé l'extension **Bootstrap 3 Snippets** afin de créer mon "layout" de base (avec le snippet `bs3-template:html5`). 
J'ai modifié le lien vers jQuery pour y inclure la version 3.1.0 et j'ai également ajouté les attributs `integrity` et `crossorigin` sur la balise `script`.

<a href="https://marketplace.visualstudio.com/items?itemName=wcwhitehead.bootstrap-3-snippets" target="_blank"><img src="http://www.forevolve.com/wp-content/uploads/2016/08/bs-3-snippets-vs-code-extension.png" alt="bs-3-snippets-vs-code-extension" width="637" height="169" class="alignnone size-full wp-image-254" /></a>

**Voici le contenu de mon fichier `index.html`:**
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

### Définition de type TypeScript pour jQuery
Vous pouvez peut-être vous dire: 
> Pourquoi dans un article de *JavaScript* tu nous parle de *TypeScript* ?

Nous allons utiliser des fichiers de type **TypeScript type definitions** en JavaScript. 

*Si vous ne connaissez pas TypeScript, c'est un autre très bon sujet. Dans notre cas, retournons à jQuery et JavaScript...*


#### Installation de TSD globalement
Installons globalement le package npm nommé [TSD](https://www.npmjs.com/package/tsd), en entrant la commande suivante dans un terminal:
```
npm install tsd -g
```

#### Installation du fichier de définition de type de jQuery
Dans votre console, assurez-vous d'être situé à la racine de votre `folder` (vous pouvez utiliser le terminal de VS Code).
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/vs-code-jquery-terminal.png" alt="vs-code-jquery-terminal" width="443" height="137" class="alignnone size-full wp-image-255" />

Entrez la commande suivante:
```
tsd install jquery --save
```
*Cette commande installe le fichier de définition de type de jQuery que nous recherchons.*

La structure de votre projet devrait maintenant ressembler à ça:
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/vs-code-jquery-project-structure-2.png" alt="vs-code-jquery-project-structure-2" width="269" height="208" class="alignnone size-full wp-image-256" />

#### Utilisation du fichier de définition de type
Ouvrez votre fichier `app.js`. Si vous tapez `$`, rien ne se passe. Pour activer l'IntelliSense de jQuery, nous devons ajouter une référence `///` à notre fichier JavaScript.

VS Code ne se met pas toujours à jour après la configuration de l'attribut `path`, alors si vous voyez l'erreur suivante, rouvrez votre fichier et tout devrait être réglé.
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/vs-code-jquery-intellisense-error.png" alt="vs-code-jquery-intellisense-error" width="408" height="85" class="alignnone size-full wp-image-257" />

Voici le snippet:
```JavaScript
/// <reference path="../typings/tsd.d.ts" />
```
*En gros, ça indique à VS Code d'ajouter les définitions contenues dans ce fichier à son IntelliSense.*

Si vous ouvrez le fichier `tsd.d.ts` vous allez voir qu'à l'intérieur, il n'y a qu'une référence vers `jquery/jquery.d.ts` (notre fichier de définition de type de jQuery). Donc, en liant le fichier `tsd.d.ts` dans un fichier JavaScript, nous ajoutons l'IntelliSense de tous les fichiers de définition de type que nous avons chargés.

De retour dans notre fichier `app.js` nous avons maintenant l'IntelliSense pour jQuery:
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/vs-code-jquery-intellisense-3.png" alt="vs-code-jquery-intellisense-3" width="522" height="347" class="alignnone size-full wp-image-267" />
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/vs-code-jquery-intellisense-2.png" alt="vs-code-jquery-intellisense-2" width="263" height="242" class="alignnone size-full wp-image-258" />

## Que faire dans nos prochains projets
Maintenant que nous avons tout installé et configuré, nous n'aurons qu'à exécuter les deux petites étapes suivantes le prochain coup:
1. [Installation du fichier de définition de type de jQuery](#installation-du-fichier-de-definition-de-type-de-jquery)
1. [Utilisation du fichier de définition de type](#utilisation-du-fichier-de-definition-de-type)

Les commandes à se souvenir sont:
```
tsd install jquery --save
```

Et:
```JavaScript
/// <reference path="../typings/tsd.d.ts" />
```
*La valeur de l'attribut `path` doit pointer vers votre fichier `tsd.d.ts` vous aurez donc à l'ajuster selon les besoins.*

## Conclusion
En assumant que vous aviez déjà **Node.js** et **npm** installé, ce fut assez simple et rapide. En condensé, nous avons fait ceci:
1. Créer un `folder` et y ajouter quelques fichiers (dans VS Code).
1. Installation de **TSD** globalement avec la commande suivante: `npm install tsd -g`.
1. Installation du fichier de définition de type de jQuery dans notre projet avec la commande suivante: `tsd install jquery --save`.
1. Ajout d'une référence vers notre fichier `tsd.d.ts` dans notre fichier `app.js` en utilisant le commentaire "trois-slash" suivant: `/// <reference path="../typings/tsd.d.ts" />`.

... Et voilà!

Bon code!