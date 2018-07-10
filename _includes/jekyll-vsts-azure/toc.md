## Table of content
{% if include.currentIndex > 0 %}{% assign intro = site.data.jekyll-vsts-azure-nav[0] %}If you are beginning to read the article series, I recommend that you start by the <a href="{{ intro.url }}">{{ intro.title | downcase }}</a>, to make sure you read the plan first then get all the prerequisites set up right.{% endif %}

<table class="table table-striped table-hover">
    <thead class="thead-inverse">
        <tr>
            <th>Article</th>
        </tr>
    </thead>
    <tbody>
    {% assign tdClass = "" %}
    {% for article in site.data.jekyll-vsts-azure-nav %}
    {% if article.enabled %}
        {% if article.index == include.currentIndex %}
            {% assign tdClass = "bg-success text-success" %}
        {% else %}
            {% assign tdClass = "" %}
        {% endif %}
    {% else %}
        {% assign tdClass = "text-muted" %}
    {% endif %}
        {% unless article.hidden %}
        <tr>
            <td class="{{ tdClass }}">
                {% if article.enabled %}
                    {% if article.index == include.currentIndex %}
                        <strong>
                            {{ article.title }}
                            <span class="toc-you-are-here badge">You are here</span>
                        </strong>
                    {% else %}
                        <a href="{{ article.url }}">{{ article.title }}</a>
                    {% endif %}
                {% else %}
                    <strong>
                        {{ article.title }}
                        <span class="toc-coming-soon badge">Coming soon</span>
                    </strong>
                {% endif %}
                <div class="small"><small>{{ article.description }}</small></div>
            </td>
        </tr>
        {% endunless %}
    {% endfor %}
    </tbody>
</table>
<aside>
    <header>Notes about VSTS screenshots</header>
    <p>
        All the VSTS screenshots uses the new UI, if you are still using the old one, the main menu is located at the top of the page instead of left.
        All options should be very similar.
    </p>
</aside>
