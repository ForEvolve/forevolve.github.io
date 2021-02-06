## Table of content
{% if include.currentIndex > 0 %}{% assign intro = site.data.jekyll-vsts-azure-nav[0] %}If you are beginning to read the article series, I recommend that you start by the <a href="{{ intro.url }}">{{ intro.title | downcase }}</a>, to make sure you read the plan first then get all the prerequisites set up right.{% endif %}

{%- include dynamic-toc.html currentIndex=include.currentIndex articles=site.data.jekyll-vsts-azure-nav -%}

<aside>
    <header>Notes about VSTS screenshots</header>
    <p>
        All the VSTS screenshots uses the new UI, if you are still using the old one, the main menu is located at the top of the page instead of left.
        All options should be very similar.
    </p>
</aside>
