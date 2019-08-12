/*\
title: $:/plugins/tiddlywiki/katex/latex-parser.js
type: application/javascript
module-type: wikirule

Wiki text inline rule for LaTeX. For example:

```
	$$latex-goes-here$$		inline latex

	\[more-latex\]			display latex

	$$
	latex-goes-here			also display 
	$$
```

This wikiparser can be modified using the rules eg:

```
\rules except latex-parser 
\rules only latex-parser 
```

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "latex-parser";
exports.types = {inline: true};

exports.init = function(parser) {
	this.parser = parser;
	// Regexp to match
	this.matchRegExp = /\\\[|\$\$(?!\$)/mg;
};

exports.parse = function() {
	// figure out which delimiter we're dealing with. the result of the first regex from init is stored in this.match
	var openmatch = this.match[0],
		delimiterstyle,
		reEnd;

	if(openmatch == '\$\$') {
		delimiterstyle = "dollar";
		reEnd = /\$\$/mg;
	} else {
		delimiterstyle = "bracket";
		reEnd = /\\\]/mg;
	}
	// Move past the match
	this.parser.pos = this.matchRegExp.lastIndex;
	
	// Look for the end marker
	reEnd.lastIndex = this.parser.pos;
	var match = reEnd.exec(this.parser.source),
		text,
		displayMode;
	// Process the text
	if(match) {
		text = this.parser.source.substring(this.parser.pos,match.index);
		if(delimiterstyle == 'dollar') {
			displayMode = text.indexOf('\n') != -1;
		}
		else {
			displayMode = "true"
		}
		this.parser.pos = match.index + match[0].length;
	} else {
		text = this.parser.source.substr(this.parser.pos);
		displayMode = false;
		this.parser.pos = this.parser.sourceLength;
	}
	return [{
		type: "latex",
		attributes: {
			text: {
				type: "text",
				value: text
			},
			displayMode: {
				type: "text",
				value: displayMode ? "true" : "false"
			}
		}
	}];
};

})();
