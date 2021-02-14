{%- assign index = include.index -%}
{%- assign article = site.data.learn-coding-with-dot-net-core[index] -%}

{%- if article.enabled -%}
[{{ article.title }}]({{ article.url }})
{%- else -%}
{{ article.title }}
{%- endif -%}