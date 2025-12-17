---
layout: default
title: Home
---

# Index of Pages

<ul>
{% assign excluded_basenames = "index,404" | split: "," %}
{% assign pages_sorted = site.pages | sort: "url" %}
{% for page in pages_sorted %}
  {% assign basename = page.path | split: "/" | last | split: "." | first %}
  {% if excluded_basenames contains basename %}{% continue %}{% endif %}
  {% if page.url contains "/assets/" or page.url contains "/vendor/" or page.url contains "/_site/" %}{% continue %}{% endif %}
  {% if page.dir contains "_layouts" or page.dir contains "_includes" or page.dir contains "_data" or page.dir contains "_sass" %}{% continue %}{% endif %}
  <li><a href="{{ page.url | relative_urle.title | default: page.url }}</a></li>
{% endfor %}
</ul>

