// ==UserScript==
// @name        Reddit Image on Mouse Over
// @version     0.1.4
// @description Shows an image when mouse is hovered over
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
    addDomObserversToMoreComments();
})();


function addStylesheet() {
    var style = document.createElement('style');
    style.textContent = 'a.tohover img { display:none } a.tohover:hover img { display: block }';

    document.head.appendChild(style);
}

function addInitialMouseOverHandlers() {
    tryAddMouseOverHandlers(document);
}

function addDomObserversToMoreComments() {
    var moreComments = document.getElementsByClassName('morecomments');

    var observer = new MutationObserver(function(mutations, _observer) {
        for (var i = 0; i < mutations.length; ++i) {
            if (mutations[i].addedNodes.length && mutations[i].target.className.search('live-timestamp') < 0) {
                tryAddMouseOverHandlers(mutations[i].target);
            }
        }
    });

    for (var i = 0; i < moreComments.length; ++i) {
        var entryUnvoted = moreComments[i].parentElement;
        var thing = entryUnvoted.parentElement;
        var sideTable = thing.parentElement;

        observer.observe(sideTable, { childList: true, subtree: true });
    }
}


// Common

function tryAddMouseOverHandlers(element) {
    var aElements = Array.prototype.slice.call(element.getElementsByTagName("a"));

    var imageLinks = aElements.filter(function(a) {
        var imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];

        if ('href' in a.attributes) {
            var link = a.attributes.href.value;

            for (var i = 0; i < imageExtensions.length; ++i) {
                var ext = imageExtensions[i];
                if (endsWith(link, ext)) {
                    return true;
                }
            }
        }

        return false;
    });

    for (var i = 0; i < imageLinks.length; ++i) {
        var link = imageLinks[i];
        link.setAttribute('class', 'tohover');

        var img = document.createElement('img');
        img.setAttribute('src', link.attributes.href.value.replace('http://', 'https://'));

        link.appendChild(img);
    }
}

function endsWith(str, pattern) {
    return str.length >= pattern.length && str.indexOf(pattern, 0) + pattern.length === str.length;
}
