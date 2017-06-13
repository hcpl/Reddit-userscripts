// ==UserScript==
// @name        Reddit Image on Mouse Over
// @version     0.1.0
// @description Shows Imgur image when mouse is hovered over
// @license     MIT
// @author      Nguyen Duc My
// @namespace   https://github.com/hcpl
// @match       https://www.reddit.com/r/*/comments/*
// @grant       none
// ==/UserScript==


(function() {
    'use strict';

    addStylesheet();
    addInitialMouseOverHandlers();
})();


function addStylesheet() {
    var style = document.createElement('style');
    style.textContent = 'a.tohover img { display:none } a.tohover:hover img { display: block }';

    document.head.appendChild(style);
}

function addInitialMouseOverHandlers() {
    tryAddMouseOverHandlers(document);
}


function tryAddMouseOverHandlers(element) {
    var aElements = Array.prototype.slice.call(element.getElementsByTagName("a"));

    var imgurLinks = aElements.filter(function(a) {
        return 'href' in a.attributes && a.attributes.href.value.search('imgur') > 0;
    });

    for (var i = 0; i < imgurLinks.length; ++i) {
        var link = imgurLinks[i];
        link.setAttribute('class', 'tohover');

        var img = document.createElement('img');
        img.setAttribute('src', link.attributes.href.value);

        link.appendChild(img);
    }
}
