in_.animation = function( item, css, keyframes) {
	
	this.name_ = item.name;
	this.css_ = css;
	this.keyframes_ = keyframes;
	this.el_ = item.el;
	this.startTime_ = item.startTime;
	this.endTime_ = this.startTime + parseFloat( in_.css.animationDuration( this.css_.style ) );
	
	this.callbacks = item.callbacks;
	this.classbacks = item.classbacks;
	
	this.playing_ = false;
	
	this.animationCallback = this.onAnimationEnd.bind(this)
	
};

in_.animation.prototype.play = function() {
	this.el_.classList.add(this.name_);
	this.playing_ = true;
	
	this.el_.addEventListener('webkitAnimationEnd', this.animationCallback );
	this.el_.addEventListener('oAnimationEnd', this.animationCallback );
	this.el_.addEventListener('MSAnimationEnd', this.animationCallback );
	this.el_.addEventListener('animationEnd', this.animationCallback );
};

in_.animation.prototype.pause = function() {
	console.log( "PAUSE ANIMATION" )
	this.el_.style.webkitAnimationPlayState = "paused";
	this.el_.style.mozAnimationPlayState = "paused";
	this.el_.style.oAnimationPlayState = "paused"; 
	this.el_.style.animationPlayState = "paused";
	
	this.playing_ = false;
};

in_.animation.prototype.resume = function() {
	this.el_.style.webkitAnimationPlayState = "running";
	this.el_.style.mozAnimationPlayState = "running";
	this.el_.style.oAnimationPlayState = "running"; 
	this.el_.style.animationPlayState = "running";
	
	this.playing_ = true;
};

in_.animation.prototype.reset = function() {
	this.el_.removeEventListener('webkitAnimationEnd', this.animationCallback );
	this.el_.removeEventListener('oAnimationEnd', this.animationCallback );
	this.el_.removeEventListener('MSAnimationEnd', this.animationCallback );
	this.el_.removeEventListener('animationEnd', this.animationCallback );
	
	this.el_.classList.remove(this.name_);
	this.playing_ = false;
};

in_.animation.prototype.startTime = function() {
	return this.startTime_;
}

in_.animation.prototype.isPlaying = function() {
	return this.playing_;
}

in_.animation.prototype.onAnimationEnd = function() {
	
	this.reset();
	
	console.log( "ANIMATION END", this );
	
	if ( this.callbacks.length ) {
		this.callbacks.forEach( function( callback ) {
			callback();
		}.bind(this) );
	}
	
	if ( this.classbacks.length ) {
		this.classbacks.forEach( function( classback ) {
			if ( classback.indexOf('!') >= 0 ) {
				this.el_.classList.remove( classback.replace('!','') );
			} else {
				this.el_.classList.add( classback );
			}
		}.bind(this) );
	}
}