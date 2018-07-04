## Table of content
{% if include.currentIndex > 0 %}{% assign intro = site.data.jekyll-vsts-azure-nav[0] %}If you are starting the article series, I recomment that you start by the <a href="{{ intro.url }}">{{ intro.title | downcase }}</a>, just to make sure you read the plan first then get all the steps right.{% endif %}

<table class="table table-striped table-hover">
    <thead class="thead-inverse">
        <tr>
            <th>Article</th>
        </tr>
    </thead>
    <tbody>
    {% for article in site.data.jekyll-vsts-azure-nav %}
        <tr>
            <td>
                {% if article.index == include.currentIndex %}
                    <strong>{{ article.title }} [you are here]</strong>
                {% else %}
                    <a href="{{ article.url }}">{{ article.title }}</a>
                {% endif %}
            </td>
        </tr>
    {% endfor %}
    </tbody>
</table>
