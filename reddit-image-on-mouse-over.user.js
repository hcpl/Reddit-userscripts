// ==UserScript==
// @name        Reddit Image on Mouse Over
// @version     0.1.8
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
    var imageExtensions = getImageExtensions();
    var aElements = element.getElementsByTagName('a');

    for (var i = 0; i < aElements.length; ++i) {
        var a = aElements[i];

        if ('href' in a.attributes) {
            var link = a.attributes.href.value;

            for (var j = 0; j < imageExtensions.length; ++j) {
                var ext = imageExtensions[j];
                var needsToReplaceExt = ext.constructor === Array;

                var fromExt = needsToReplaceExt ? ext[0] : ext;

                if (endsWith(link, fromExt)) {
                    if (a.getElementsByTagName('img').length > 0) {
                        continue;
                    }

                    a.classList.add('userscripted-image-link');

                    var newLink = link.replace('http://', 'https://');
                    newLink = needsToReplaceExt ? newLink.replace(ext[2], ext[1]) : newLink;

                    var img = document.createElement('img');
                    img.setAttribute('src', newLink);

                    a.appendChild(img);
                }
            }
        }
    }
}

function getImageExtensions() {
    var imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', ['.gifv', '.gif']];

    for (var i = 0; i < imageExtensions.length; ++i) {
        var ext = imageExtensions[i];
        if (ext.constructor === Array) {
            ext.push(new RegExp(ext[0] + '$'));
        }
    }

    return imageExtensions;
}

function endsWith(str, pattern) {
    return str.length >= pattern.length && str.indexOf(pattern, 0) + pattern.length === str.length;
}
