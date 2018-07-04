## Table of content

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
