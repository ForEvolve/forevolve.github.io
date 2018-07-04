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
            <td><a href="{{ article.url }}">{{ article.title }}</a></td>
        </tr>
    {% endfor %}
    </tbody>
</table>
