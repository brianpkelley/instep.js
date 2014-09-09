in_.tech.html = in_.techBase.extend({
	
});
in_.tech.html.prototype.sync = function(event) {
	console.log('Syncing HTML Video with inStep.js', this.play_);
	
	this.video_.addEventListener(event,this[event+'_']);
	
};

in_.tech.html.prototype.getCurrentTime = function() {
	return this.video_.currentTime;
}









in_.tech.get = function( video ) {
	return new in_.tech.html( video );
}
