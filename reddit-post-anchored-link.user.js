// ==UserScript==
// @name        Reddit Post Anchored Link
// @version     0.1.2
// @description Adds a button per post to represent an anchored link (like the parent button) derived from a permalink
// @license     MIT
// @author      Nguyen Duc My
// @namespace   https://github.com/hcpl
// @match       https://www.reddit.com/r/*/comments/*
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
        if (list.children.length > 0) {
            var commentId = getCommentId(list);
            addButton(list, commentId);
        }
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
