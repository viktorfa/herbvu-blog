---
layout: post
title:  Plotting Nutrition in Special Flours
date:   2017-09-25 14:12:03 +0200
categories: comparison data herbvu protein special flour charts ternary
---

<div id="ternary-static-image">
    <a href="{{site.baseurl}}{{page.url}}">
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
{% js special-flours-data %}
{% js special-flours-ternary %}
