// ==UserScript==
// @name        reddit-post-anchored-link
// @namespace   reddit
// @description Adds a button per post to represent an anchored link (like the parent button) derived from a permalink
// @match       https://www.reddit.com/r/*/comments/*
// @version     0.1.0
// @grant       none
// ==/UserScript==


(function () {
    'use strict';

    addPostButtons();
})();


function addPostButtons() {
    var buttonLists = document.getElementsByClassName("flat-list buttons");
    for (var i = 1; i < buttonLists.length; ++i) {
        var list = buttonLists[i];
        var commentId = getCommentId(list);
        addButton(list, commentId);
    }
}

function getCommentId(buttonList) {
    var a = buttonList.children[0].children[0];
    var pathParts = a.href.split('/');
    var commentId = pathParts[pathParts.length - 2];

    return commentId;
}

function addButton(buttonList, commentId) {
    var a = document.createElement('a');
    a.setAttribute('class', 'bylink');
    a.setAttribute('href', '#' + commentId);
    a.setAttribute('rel', 'nofollow');
    a.innerHTML = "link";
    var li = document.createElement('li');
    li.appendChild(a);

    buttonList.appendChild(li);
}