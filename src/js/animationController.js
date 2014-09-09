
in_.animationController = function( animations ) {
	in_.assert( animations, 'Animation Controller: Valid animation list required' );
	this.animations_ = animations;
	
	this.playing_ = [];
	this.paused_ = [];
	
};

in_.animationController.prototype.startAnimations = function( from, to ) {
	//console.log( from, to );
	var animationsToStart = this.getAnimationsToStart( from, to );
	
	// Start new animations
	animationsToStart.forEach( function( animation, i ) {
		animation.play();
		this.playing_.push( animation );
	}.bind( this ) );
	
	// Start paused animations
	while ( ( animation = this.paused_.pop() ) !== undefined ) {
		animation.resume();
		this.playing_.push( animation );
	};
};

in_.animationController.prototype.pauseAnimations = function(){
	while ( ( animation = this.playing_.pop() ) !== undefined ) {
		if ( animation.isPlaying() ) { // double check
			animation.pause();
			this.paused_.push( animation );
		}
	};
}

in_.animationController.prototype.stopAnimations = function() {
	
};

in_.animationController.prototype.setOffset = function( seconds ) {
	var delay = -(seconds - animation.startsAt),
	delay = delay < 0 ? delay : 0,
	milliseconds = Math.floor(delay * 1000) + "ms";

	animation.element.style.webkitAnimationDelay = milliseconds;
	animation.element.style.mozAnimationDelay = milliseconds;
	animation.element.style.oAnimationDelay = milliseconds;
	animation.element.style.msAnimationDelay = milliseconds;
	animation.element.style.animationDelay = milliseconds;
};



in_.animationController.prototype.getAnimationsToStart = function( from, to ) {
	var returnArray = [];
	var tempStartTime = null;
	this.animations_.forEach( function( animation, i ) {
		//console.log( animation );
		
		tempStartTime = animation.startTime();
		//console.log( tempStartTime );
		
		if ( tempStartTime >= from && tempStartTime <= to ) {
			returnArray.push( animation );
		}
	}.bind( this ) );
	
	return returnArray;
}