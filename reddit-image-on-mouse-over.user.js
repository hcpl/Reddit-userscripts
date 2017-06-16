// ==UserScript==
// @name        Reddit Image on Mouse Over
// @version     0.1.7
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
    addInitialMouseOverElements();
    addDomObserversToMoreComments();
})();


function addStylesheet() {
    var style = document.createElement('style');
    style.textContent = 'a.userscripted-image-link img { display:none } a.userscripted-image-link:hover img { display: block }';

    document.head.appendChild(style);
}

function addInitialMouseOverElements() {
    tryAddMouseOverElements(document);
}

function addDomObserversToMoreComments() {
    var moreComments = document.getElementsByClassName('morecomments');

    var observer = new MutationObserver(function(mutations, _observer) {
        for (var i = 0; i < mutations.length; ++i) {
            if (mutations[i].addedNodes.length && mutations[i].target.className.search('live-timestamp') < 0) {
                tryAddMouseOverElements(mutations[i].target);
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

function tryAddMouseOverElements(element) {
    var aElements = Array.prototype.slice.call(element.getElementsByTagName('a'));

    var imageLinks = aElements.filter(function(a) {
        var imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

        if ('href' in a.attributes) {
            var link = a.attributes.href.value;

            for (var i = 0; i < imageExtensions.length; ++i) {
                if (endsWith(link, imageExtensions[i])) {
                    return true;
                }
            }
        }

        return false;
    });

    for (var i = 0; i < imageLinks.length; ++i) {
        var link = imageLinks[i];
        if (link.getElementsByTagName('img').length > 0) {
            continue;
        }

        link.classList.add('userscripted-image-link');

        var img = document.createElement('img');
        img.setAttribute('src', link.attributes.href.value.replace('http://', 'https://'));

        link.appendChild(img);
    }
}

function endsWith(str, pattern) {
    return str.length >= pattern.length && str.indexOf(pattern, 0) + pattern.length === str.length;
}
