// Charlie.js
// http://coding.smashingmagazine.com/2013/11/18/the-future-of-video-in-web-design/

in_.cssRules = function() {
	
	this.rules_ = {};
	this.rules_.keyframe = this.findRules( this.findKeyframeRules.bind(this) );
	this.rules_.animation = this.findRules( this.findAnimationRules.bind(this) );
	
};
in_.cssRules.prototype.KEYFRAMES_RULE_ = window.CSSRule.KEYFRAMES_RULE
																			|| window.CSSRule.WEBKIT_KEYFRAMES_RULE
																			|| window.CSSRule.MOZ_KEYFRAMES_RULE
																			|| window.CSSRule.O_KEYFRAMES_RULE
																			|| window.CSSRule.MS_KEYFRAMES_RULE;

in_.cssRules.prototype.findRules = function( matches ){
	console.log( this.KEYFRAMES_RULE_ );
	//document.stylesheets is not an array by default.
	// It's a StyleSheetList. toArray converts it to an actual array.
	var styleSheets = in_.dom.listToArray( document.styleSheets );
	var rules = [];

	// forEach iterates through a list, in this case passing
	//every sheet in styleSheets to the next forEach
	styleSheets.forEach(function( sheet ){
		
		//This foreach iterates through each rule in the style sheet
		//and checks if it passes the matches function.
		in_.dom.listToArray(sheet.cssRules).forEach( function( rule ){
			if ( matches( rule ) ) {
				rules.push( rule );
			}
		}.bind(this));
	}.bind(this));
	
	return rules;
};

in_.cssRules.prototype.findKeyframeRules = function( rule ) {
	return this.KEYFRAMES_RULE_ === rule.type;
};

in_.cssRules.prototype.findAnimationRules = function( rule ) {
	return rule.style && rule.style[this.animationName(rule.style)]
};

in_.cssRules.prototype.animationName = (function(){
	var name = "";
	return function(style){
			if (name) {
					return name;
			} else {
					if (style.animationName) {
							name = "animationName";
					} else if (style.webkitAnimationName) {
							name = "webkitAnimationName";
					} else if (style.mozAnimationName) {
							name = "mozAnimationName";
					} else if (style.oAnimationName) {
							name="oAnimationName";
					} else if (style.msAnimationName) {
							name = "msAnimationName";
					} else {
							name = "";
					}
					return name;
			}
	}
})();


in_.cssRules.prototype.getRules = function( type ) {
	return this.rules_[type];
}

in_.cssRules.prototype.getAnimationRule = function( name ) {
	var match = null;
	
	this.rules_.animation.some( function( item, i, array) {
		if ( item.selectorText.substr(1) == name ) {
			console.log( 'MATCH' );
			match = item;
			return true;
		}
		return false;
	}.bind(this) );
	return match;
}

in_.cssRules.prototype.getKeyframeRule = function( name ) {
	var match = null;
	
	this.rules_.animation.some( function( item, i, array) {
		if ( item.name == name ) {
			console.log( 'MATCH' );
			match = item;
			return true;
		}
		return false;
	}.bind(this) );
	return match;
}






