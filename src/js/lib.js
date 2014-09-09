in_.vendors = ["webkit","moz","o","ms"];



/**
 * String Helper functions
 */
in_.string = {};
in_.string.toCamelCase = function ( str ) {
	return str.replace(/[\-|\s]([a-z])/g, function (g) { return g[1].toUpperCase(); })
};


/**
 * DOM Helper functions
 */
in_.dom = {};
in_.dom.listToArray = function ( nodeList ) {
	var i;
	var returnArray = [];
	for ( i = 0; i < nodeList.length; i++ ) {
		returnArray.push( nodeList[i] )
	}
	
	return returnArray;
};

in_.dom.attributesToObject = function( item ) {
	var i;
	var attributeList = item.attributes;
	var returnObject = {};
	var nodeName;
	
	for ( i = 0; i < attributeList.length; i++ ) {
		nodeName = in_.string.toCamelCase( attributeList[i].nodeName.replace('data-','') );
		returnObject[nodeName] = attributeList[i].nodeValue;
	}
	
	return returnObject
};


/**
 * CSS Helper Functions
 */
in_.css = {};
in_.css.animationDuration = (function() {
	var name = "";
	return function( style ) {
		if ( style.animationDuration ) {
			name = 'animationDuration';
		}
		
		for (var i = 0; i < in_.vendors.length && name == ""; ++i) {
			var vp = in_.vendors[i];
			if ( style[vp+'AnimationDuration'] ) {
				name = vp+'AnimationDuration';
			}
		}
		
		return style[name];
	}
})();








in_.assert = function( condition, message ) {
	if ( !condition ) {
		throw message || "An Error Occurred";
	}
};


	/*!
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 *
 */

// @win window reference
// @fn function reference
 in_.domReady = function(win, fn) {

	var done = false, top = true,

	doc = win.document, root = doc.documentElement,

	add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
	rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
	pre = doc.addEventListener ? '' : 'on',

	init = function(e) {
		if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
		(e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
		if (!done && (done = true)) fn.call(win, e.type || e);
	},

	poll = function() {
		try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
		init('poll');
	};

	if (doc.readyState == 'complete') fn.call(win, 'lazy');
	else {
		if (doc.createEventObject && root.doScroll) {
			try { top = !win.frameElement; } catch(e) { }
			if (top) poll();
		}
		doc[add](pre + 'DOMContentLoaded', init, false);
		doc[add](pre + 'readystatechange', init, false);
		win[add](pre + 'load', init, false);
	}

}
	