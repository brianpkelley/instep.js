in_.techBase = Class.extend({
	init: function( video ) {
		this.video_ = video;
		this.setupEvents();
	},
	
	// Default list of events to sync
	events_: 'play,pause,stop,rewind,seek'.split(','),
	
	setupEvents: function() {
		this.events_.forEach(function( event, i, events ) {
			this[event+'_'] = { fn: function() {}, scope: this, sync: false };
		}.bind(this));
	},
	
	on: function( event, callback ) {
		in_.assert( this.events_.indexOf(event) >= 0, 'Event not recognized by tech layer.');
		
		console.log( "Adding Tech Event", event, callback );
		
		this[event+'_'] = callback; //, scope: scope };
		
		this.sync( event );
	},
	
	sync: function() {
		// Stub
		// This is where the tech and instep get synchronized
	}
	
});



in_.tech = {};

