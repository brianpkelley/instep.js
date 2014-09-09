/**
 * inStep.js
 * -------
 * inpsired by Charlie.js
 * https://github.com/sfioritto/charlie.js
 *
 * Some logic may look similar to Charlie.js and I make
 * no effort to hide its influence on this script.
 * -------
 * 
 * Author: Brian Kelley - http://www.tastybytes.net
 * Copyright: 2014 inStep.js - http://www.instepjs.com
 */

// Namespace
window.in_ = {};
window.in_.cache_ = {};


/**
 * Primary Function for initializing a new instance
 */
window.instepjs = function( videoId, dataTag, readyFn ) {
	in_.assert(videoId,'You must specify a valid id of a video element');
	
	// If this video has already been setup, return instance
	if ( in_.cache_[videoId] ) {
		return in_.cache_[videoId];
	} // Else construct a new isntance
	
	/**
	 * Constructor
	 */
	this.video = document.getElementById( videoId );
	this.data = new in_.dataParser(videoId, dataTag);
	
	this.animationList = this.data.getAnimations();
	this.rules = new in_.cssRules();
	
	this.animations = [];
	this.animationList.forEach( function( item, i, array ) {
		this.animations.push( new in_.animation( item, this.rules.getAnimationRule(item.name), this.rules.getKeyframeRule(item.name) ) );
	}.bind(this) );
	
	this.tech = in_.tech.get( this.video );
	
	this.animationController = new in_.animationController( this.animations );
	this.loopController = new in_.loopController( this.tech, this.animationController );
	
	console.log( this );
	
	
	// Add this to the cache to prevent duplicates
	in_.cache_[videoId] = this;
	// Fire off the ready function bound to this
	readyFn.bind(this)();
	// Return "this" for future use
	return this;
};

window.instepjs.prototype.addAnimation = function( el, data ) {
	console.log( "ADDING ANIMATION", el, data);
	var nextIndex = this.animations.length;
	var newAnimations = this.data.parseAnimationData( el, data );
	console.log( newAnimations );
	newAnimations.forEach( function( item, i, array ) {
		newAnimation = new in_.animation( item, this.rules.getAnimationRule(item.name), this.rules.getKeyframeRule(item.name) );
		this.animations.push(  newAnimation );
	}.bind( this ) );
	
	this.animationList = this.animationList.concat( newAnimations );
}