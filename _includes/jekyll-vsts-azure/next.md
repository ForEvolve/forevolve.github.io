{% assign nextIndex = include.nextIndex %}
{% assign nextArticle = site.data.jekyll-vsts-azure-nav[nextIndex] %}

## Next step

{% if include.continueText %}{{ include.continueText }}{% else %}It is now time to move to the next article:{% endif %}{% if nextArticle.enabled %}
[{{ nextArticle.title }}]({{ nextArticle.url }}).
{% else %}
**{{ nextArticle.title }}** that's coming soon; stay tuned it should not take long until its release.
{% endif %}