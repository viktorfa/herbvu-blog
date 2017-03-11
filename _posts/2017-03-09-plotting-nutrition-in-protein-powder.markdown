---
layout: post
title:  Plotting Nutrition in Protein Powder
date:   2017-03-09 03:31:03 +0800
categories: comparison data herbvu protein powder charts ternary
---


I saw a post on Reddit some time ago where someone plotted nutritional info of protein bars on a ternary plot. I thought
it was a cool idea, and since HerbVu has a lot of relevant data, I decided to make an improved version for protein powder.
This can hopefully help people find the right bar for their needs.
<div id="ternary-static-image">
    <a href="{{site.baseurl}}{{page.url}}">
        <img src="{% asset_path protein-powder-ternary.png %}" alt="Protein Bars Ternary Plot"/>
    </a>
</div>
<!--more-->
<div class="input-group">
    <span class="input-group-addon">Filter</span>
    <input id="query-text-input" type="text" class="form-control"/>
</div>
<div id="ternary-container">
    <div id="bar-chart"></div>
    <div id="ternary"></div>
</div>
<br>
Click on a point to open its shop page and go to [HerbVu](http://www.herbvu.com) to see information about price etc.

The data for this is gathered from [iHerb](http://www.iherb.com?rcode=UCO843) and [Vitacost](https://goo.gl/q3yE9v)



{% include plotly-head.html %}

{% js ternary-plot %}
{% js protein-powder-data %}
{% js protein-powder-ternary %}
