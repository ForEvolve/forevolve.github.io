{% assign nextIndex = include.nextIndex %}
{% assign nextArticle = site.data.learn-coding-with-dot-net-core[nextIndex] %}

{% if include.hideHeading %}{% else %}## Next step{% endif %}

{% if include.continueText %}{{ include.continueText }}{% else %}It is now time to move to the next article:{% endif %}{% if nextArticle.enabled %}
[{{ nextArticle.title }}]({{ nextArticle.url }}).
{% else %}
**{{ nextArticle.title }}** that's coming soon. Stay tuned by following me:
<div class="follow-me-list-horizontal article-next-social">
    {%- include social-list.html hide-follow-me-text=true -%}
</div>
{% endif %}
