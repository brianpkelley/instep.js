
in_.loopController = function( tech, animationController ) {
	in_.assert( tech, 'Loop Controller: Valid Tech Required' );
	in_.assert( animationController, 'Loop Controller: Valid animationController Required' );
	
	this.tech_ = tech;
	this.animationController_ = animationController;
	
	this.lastTickTime = null;
	
	this.sync();
};

in_.loopController.prototype.sync = function() {
	this.tech_.on('play', this.start.bind( this ) );
	this.tech_.on('pause', this.stop.bind( this ) );
	this.tech_.on('seek', this.seek.bind( this ) );
};

in_.loopController.prototype.request_ = null;


in_.loopController.prototype.start = function() {
	
	this.lastTickTime = this.tech_.getCurrentTime();
	this.request_ = window.requestAnimationFrame( this.tick.bind(this) );
};

in_.loopController.prototype.stop = function() {
	window.cancelAnimationFrame( this.request_ );
	this.animationController_.pauseAnimations();
};

in_.loopController.prototype.tick = function() {
	// Do cool stuff here
	var now = this.tech_.getCurrentTime();
	
	this.animationController_.startAnimations(this.lastTickTime, now);
	
	
	this.lastTickTime = now;
	this.request_ =  window.requestAnimationFrame( this.tick.bind(this) );
};

in_.loopController.prototype.seek = function() {
	
};