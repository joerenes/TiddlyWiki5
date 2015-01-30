/*\
title: $:/plugins/tiddlywiki/katex/wrapper.js
type: application/javascript
module-type: widget

Wrapper for `katex.min.js` that provides a `<$latex>` widget. It is also available under the alias `<$katex>`

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var katex = require("$:/plugins/tiddlywiki/katex/katex.min.js"),
	macroparser = require("$:/plugins/tiddlywiki/katex/macro-parser.js"),
	Widget = require("$:/core/modules/widgets/widget.js").widget;

var KaTeXWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
KaTeXWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
KaTeXWidget.prototype.render = function(parent,nextSibling) {
	// Housekeeping
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	// Get the source text and figure out the displaystyle
	var text = this.getAttribute("text",this.parseTreeNode.text || "");
	var style = this.getAttribute("style",this.parseTreeNode.text || "");
	// expand macros, after loading them, if they are present
	var macrocont = $tw.wiki.getTiddlerText("LaTeX Macros");
	if (typeof macrocont === "undefined") {
		; // no macros
	} else {
		text = macroparser.expandLaTeXmacros(text,macrocont.toString().split('\n'));
	}
	// Render it into the appropriate element: span for inline, div with centering and \displaystyle for display
	var elemnt;
	if (style == "block") {
		text = "\\displaystyle "+text;
		elemnt = this.document.createElement("div");
		elemnt.setAttribute("style","text-align:center");
	} else {
		elemnt = this.document.createElement("span");
	}
	//text = (style == "block") ? "\\displaystyle "+text:text;
	//var elemnt = (style == "block")? this.document.createElement("div"):this.document.createElement("span");
	try {
		if($tw.browser) {
			katex.render(text,elemnt);
		} else {
			elemnt.innerHTML = katex.renderToString(text);
		}
	} catch(ex) {
		elemnt.className = "tc-error";
		elemnt.textContent = ex;
	}
	// Insert it into the DOM
	parent.insertBefore(elemnt,nextSibling);
	this.domNodes.push(elemnt);
};

/*
Compute the internal state of the widget
*/
KaTeXWidget.prototype.execute = function() {
	// Nothing to do for a katex widget
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
KaTeXWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.text) {
		this.refreshSelf();
		return true;
	} else {
		return false;	
	}
};

exports.latex = KaTeXWidget;
exports.katex = KaTeXWidget;

})();

