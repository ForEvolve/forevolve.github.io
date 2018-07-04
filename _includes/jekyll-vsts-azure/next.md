{% assign next = include.nextIndex %}

## Next article

{% if include.continueText %}{{ include.continueText }}{% else %}It is now time to move to the next article:{% endif %} [{{ site.data.jekyll-vsts-azure-nav[next].title }}]({{ site.data.jekyll-vsts-azure-nav[next].url }}).
