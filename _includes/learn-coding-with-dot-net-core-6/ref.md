{%- assign index = include.index -%}
{%- assign article = site.data.learn-coding-with-dot-net-core-6[index] -%}
{%- if include.urlPrefix -%}
    {%- assign urlPrefix = include.urlPrefix -%}
{%- endif -%}

{%- if article.enabled -%}
[{{ article.title }}]({{ article.url | prepend: urlPrefix }})
{%- else -%}
{{ article.title }}
{%- endif -%}