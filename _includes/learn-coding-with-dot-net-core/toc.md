
Now that you are done with this {% if include.currentIndex == 1 -%}first{%- endif %} article, please look at the series’ content.

{%- include dynamic-toc.html currentIndex=include.currentIndex articles=site.data.learn-coding-with-dot-net-core -%}
