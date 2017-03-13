---
title: "Opérations Git de base en utilisant le client de GitHub"
date:  2016-08-18 -0500
post-img: "img/2016-08-18-operations-git-de-base-en-utilisant-le-client-de-github.png"
lang: fr
categories: fr/articles
---

### Table des matières
<ol class="forevolve-toc"><li><a href="#comment-clone-un-repo-git-github" data-forevolve-level="3">Comment <code>clone</code> un repo git GitHub </a></li><li><a href="#comment-changer-de-branch" data-forevolve-level="3">Comment changer de <code>branch</code> </a></li><li><a href="#voir-lhistorique-des-modifications-liste-des-commits" data-forevolve-level="3">Voir l’historique des modifications <small>liste des <code>commit</code>s</small> </a></li><li><a href="#commit-ses-changements" data-forevolve-level="3"><code>commit</code> ses changements </a></li><li><a href="#push-et-pull" data-forevolve-level="3"><code>push</code> et <code>pull</code> </a></li><li><a href="#letat-de-la-synchronisation" data-forevolve-level="3">L’état de la synchronisation </a></li><li><a href="#letat-des-fichiers-avant-un-commit" data-forevolve-level="3">L’état des fichiers avant un <code>commit</code> </a></li><li><a href="#cest-la-fin" data-forevolve-level="2">C’est la fin </a></li></ol>

<!--more-->

*Je vais ajouter et modifier des scénarios si le besoin s'en fait sentir.*

### Comment `clone` un repo git GitHub
#### Choix du repo que vous voulez `clone`
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/Git-GiHub-Branch-6.png" alt="Git-GiHub-Branch-6" width="590" height="603" class="alignnone size-full wp-image-309" />

#### Choisir le dossier
Choisir un dossier où sauvegarder les fichiers, exemple: `C:\Repositories\`.
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/Git-GiHub-Branch-14.png" alt="Git-GiHub-Branch-14" width="320" height="382" class="alignnone size-full wp-image-323" />

### Comment changer de `branch`
#### Sélectionner un repo existant
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/Git-GiHub-Branch-8.png" alt="Git-GiHub-Branch-8" width="328" height="182" class="alignnone size-full wp-image-311" />

#### Choisir une `branch`
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/Git-GiHub-Branch-1.png" alt="Git-GiHub-Branch-1" width="355" height="533" class="alignnone size-full wp-image-305" />
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/Git-GiHub-Branch-2.png" alt="Git-GiHub-Branch-2" width="375" height="208" class="alignnone size-full wp-image-306" />
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/Git-GiHub-Branch-3.png" alt="Git-GiHub-Branch-3" width="207" height="150" class="alignnone size-full wp-image-307" />

Le contenu du dossier contient maintenant le code de cette `branch`, vous pouvez donc ouvrir le projet dans l'éditeur de code de votre choix.

### Voir l'historique des modifications <small>liste des `commit`s</small>
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/Git-GiHub-Branch-15.png" alt="Git-GiHub-Branch-15" width="1012" height="227" class="alignnone size-full wp-image-327" />

### `commit` ses changements
Assurez-vous de [sélectionner un repo existant](#selectionner-un-repo-existant), ensuite:
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/Git-GiHub-Branch-9.png" alt="Git-GiHub-Branch-9" width="655" height="585" class="alignnone size-full wp-image-312" />

### `push` et `pull`
Le bouton *sync* fait le `push` et le `pull`:
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/Git-GiHub-Branch-10.png" alt="Git-GiHub-Branch-10" width="282" height="233" class="alignnone size-full wp-image-313" />

### L'état de la synchronisation
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/Git-GiHub-Branch-11.png" alt="Git-GiHub-Branch-11" width="472" height="158" class="alignnone size-full wp-image-314" />
* En vert: les `commit`s sur GitHub
* En orange: les `commit`s locaux
* En rouge: la copie de travail (l'état actuel des fichiers)

**Exemple, après notre `sync`:**
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/Git-GiHub-Branch-12.png" alt="Git-GiHub-Branch-12" width="252" height="100" class="alignnone size-full wp-image-315" />

*Les `commit`s locaux ont été "publiés" en ligne (`push`). S'il y avait eu des `commit`s distants, ils auraient été "téléchargés" (`pull`).* 

### L'état des fichiers avant un `commit`
Lors d'un `commit`, le client GitHub offre un identificateur visuel pour chaque fichier

**Nouveau fichier:**
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/Screenshot_15.png" alt="Screenshot_15" width="37" height="30" class="alignnone size-full wp-image-319" />

**Fichier modifié:**
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/Screenshot_16.png" alt="Screenshot_16" width="29" height="28" class="alignnone size-full wp-image-320" />

**Fichier supprimé:**
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/Screenshot_17.png" alt="Screenshot_17" width="32" height="34" class="alignnone size-full wp-image-318" />

**Par exemple:**
<img src="http://www.forevolve.com/wp-content/uploads/2016/08/Git-GiHub-Branch-13.png" alt="Git-GiHub-Branch-13" width="527" height="592" class="alignnone size-full wp-image-317" />

## C'est la fin
Si vous avez des idées ou des commentaires, n'hésitez pas.