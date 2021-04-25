{%- assign index = include.firstPart | minus: 1 -%}
{%- assign firstPartArticle = site.data.learn-coding-with-dot-net-core[index] -%}
{%- assign pageTitle = page.title -%}
{%- if include.pageTitle -%}
    {%- assign pageTitle = include.pageTitle -%}
{%- endif -%}

{%- if pageTitle == firstPartArticle.title -%}
    {%- assign articleGroupName = firstPartArticle.group.name -%}

{::options parse_block_html="true" /}

    {%- capture listHtmlFragment -%}
    {%- for item in site.data.learn-coding-with-dot-net-core -%}
        {%- if item.group -%}
            {%- assign itemGroupName = item.group.name -%}
            {%- assign itemTitle = item.title -%}
            {%- assign itemIndex = item.index | minus: 1 -%}
            {% if itemGroupName == articleGroupName %}
- {% include learn-coding-with-dot-net-core/ref.md index=itemIndex urlPrefix=include.urlPrefix %}{% if itemTitle == pageTitle %} (you are here){% endif %}{% endif %}
        {%- endif -%}
    {%- endfor -%}
    {%- endcapture -%}

{::options parse_block_html="false" /}

<blockquote>
    This article is the first part of a sub-series showcasing the following articles:
    {{ listHtmlFragment | markdownify }}
</blockquote>

{%- else -%}
> This article is part of a sub-series, starting with {% include learn-coding-with-dot-net-core/ref.md index=index urlPrefix=include.urlPrefix %}.
> It is not mandatory to read all articles in order, but I strongly recommend it, especially if you are a beginner.
> If you are already reading the whole series in order, please discard this word of advice.
{%- endif -%}

