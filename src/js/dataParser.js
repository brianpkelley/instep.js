

in_.dataParser = function(videoId, dataTag) {
	// default
	this.elementCache_ = this.getElements( videoId, dataTag );
	this.animationCache_ = this.getAnimations();
//	return this.cache_;
};

in_.dataParser.prototype.getElements = function( videoId, dataTag ) {
	dataTag = dataTag || 'instep';
	var returnArray = [];
	var tempObj;
	
	
	// Get all matching elements
	var els = in_.dom.listToArray( document.querySelectorAll('[data-'+dataTag+'="'+videoId+'"]') );
	
	// Convert attributes to object
	els.forEach( function(item, i, array) {
		tempObj = {};
		tempObj.el = item;
		tempObj.attributes = in_.dom.attributesToObject( item );
		returnArray.push( tempObj );
		
	}.bind(this));

	return returnArray;
};


in_.dataParser.prototype.getAnimations = function() {
	var returnArray = [];
	
	this.elementCache_.forEach( function( item ) {
		var computedAnimation = this.parseAnimationData( item.el, item.attributes.instepAnimations );
		returnArray = returnArray.concat( computedAnimation );
	}.bind( this ) );
	
	return returnArray;
};


/**
 * Can grab animation data from data-instep-animations in either JSON format or instep notation
 * JSON Example
 * Best for complex animations
 *
 * // As it would be writing in a data-instep-animations attribute
 * {"fade-in":{"2":["classback,"callback()"],"14":["callback()"],"callbacks":["classback","callback()"]},"fade-out":{"8":["!classback","classback2"],"22":[]}}
 *
 * // Broken Down
 * {
 * 	"fade-in":{  									// Animation Name
 * 		"2":[ 											// Play this at 2s
 * 			"classback",							// Apply this class when the animation completes
 * 			"callback()"							// Call this function when the animation completes
 * 		],
 * 		"14":[											// Play this at 14s
 * 			"callback()"							// call this function when the animation completes
 * 		],
 * 		"callbacks":[								// Apply these call or class backs to all times for this animation (2 and 14)
 * 			"classback",							// Apply this class when the animation completes at 2s and 14s
 * 			"callback()"							// Call this funciton when the animation completes at 2s and 14s
 * 		]
 * 	},
 * 	"fade-out":{									// Animation Name
 * 		"8":[												// Play this at 8s
 * 			"!classback",							// Remove this class when the animation completes
 * 			"classback2"							// Apply this class when the animation completes
 * 		],
 * 		"22":[]											// Play this animation at 22s and then do nothing 
 * 	}
 * }
 *
 *
 *
 * Instep Notation
 * Best for quick animation sets, but below is a full breakdown of options (same result as JSON example)
 *
 * // As it would be writing in a data-instep-animations attribute
 * fade-in[2{classback,callback()},14{callback}]{classback,callback()} fade-out[8{!classback,classback2},22]
 *
 * // Broken Down
 * fade-in[												// Animation Name
 * 	2{														// Play this at 2s
 * 		classback,									// Apply this class when the animation completes
 * 		callback()									// Call this function when the animation completes
 * 	},
 * 	14{														// Play this at 14s
 * 		callback()									// Call this function when the animation completes
 * 	}
 * ]{															// Apply these call or class backs to all times for this animation (2 and 14)
 * 	classback,										// Apply this class when the animation completes at 2s and 14s
 * 	callback()										// Call this funciton when the animation completes at 2s and 14s
 * }
 *
 * fade-out[											// Animation Name
 * 	8{														// Play this at 8s
 * 		!classback,									// Remove this class when the animation completes
 * 		classback2									// Apply this class when the animation completes
 * 	},
 * 	22														// Play this animation at 22s and then do nothing 
 * ]
 *
 * // Ideal use example
 * blink-in[1,2,3,4,5,6,7,8,9,10]{active} blink-out[1.5,2.5,3.5,4.5,5.5,6.5,7.5,8.5,9.5,10.5]{!active}
 * 
*/

in_.dataParser.prototype.parseAnimationData = function( el, animation ) {
	var returnArray = [];
	var timesRegex = /\[(.*)\]/ig; // Get all between two brackets 
	var timeDataRegex = /([\d\.]+)\{(.*?)\}|([\d\.]+)/ig; // Get digits (\d) after a "," or start of the string
	var genericCallbackRegex = /\w+\[.*?\]\{([\!\w]*?)\}/ig; // Get generic callbacks.  These apply to an entire animation set
	
	
	// Determin the type of the callback or classback string
	var callbackData = function( callack ) {
		// Object
		if ( typeof callback === "function" ) {
			return { type: 'callback', item: callback };
		}
		
		// String
		if ( callack.indexOf('()') >= 0 ) { // it's a callback
			var returnObj = {type: 'callback'};
			var name = callack.replace('()', '');
			var nameSplit = name.split('.');
			console.log( nameSplit );
			var fn = window;
			
			nameSplit.forEach( function( obj ) {
				console.log( obj, fn, fn[obj]);
				fn = fn[obj];
			});
			console.log( fn );
			returnObj.item = fn;
			return returnObj;
			
		} else { // it's a classback
			return {type: 'classback', item: callack };
		}
	}
	
	// Handle JSON
	var parseJSON = function( animationItem ) {
		var tempObj = {};
		for ( name in animationItem ) { // Animation
			if ( animationItem.hasOwnProperty( name ) ) {
				
				var baseCallbacks = {
					classbacks: [],
					callbacks: []
				};
				
				if ( animationItem[name].callbacks ) {
					animationItem[name].callbacks.forEach( function( callback ) {
						cb = callbackData( callback );
						baseCallbacks[cb.type+'s'].push( cb.item );
					});
					delete animationItem[name].callbacks;
				}
				
				for ( startTime in animationItem[name] ) { // Times
					tempObj = {
						name: name,
						el: el,
						classbacks: baseCallbacks.classbacks.slice(0),
						callbacks:  baseCallbacks.callbacks.slice(0)
					};
			
					if ( animationItem[name].hasOwnProperty( startTime ) ) {
						tempObj.startTime = parseFloat(startTime);
						if ( animationItem[name][startTime].length ) {
							
							animationItem[name][startTime].forEach( function( cback ) {
								var cb = callbackData( cback );
								tempObj[cb.type+'s'].push( cb.item );
							}.bind( this ) );
							
						}
					}
					returnArray.push( tempObj );
				}
			}
		}
	};

	
	
	
	
	if ( typeof animation === 'object' ) {
		parseJSON( animation );
	}
	try { // Is this JSON?
		var animations = JSON.parse( animation );
		parseJSON( animations );
	} catch(e) {
		//throw( e );
		// Split the string on " "
		// Pull out the time to act
		// Pull out the callbacks
		// Split the callbacks on ","
		var animations = animation.split(' ');
		
		animations.forEach( function( animationItem, index, anims ) {
			var times, name, callbackSplit, callback, classback;
			
			
			times = timesRegex.exec( animationItem )[1];
			name = animationItem.replace(timesRegex,'').replace( /\{.*?\}/ig, '' );
			genericCallbackRegex.lastIndex = 0;
			animationCallbacks = genericCallbackRegex.exec( animationItem );
			
			animationCallbacks = ( animationCallbacks ? animationCallbacks[1] : '' ).split(',');
			
			// Holds for "animation wide" callbacks.
			var baseCallbacks = {
				classbacks: [],
				callbacks: []
			};
			
			animationCallbacks.forEach( function( back ) {
				if ( back != "" ) {
					cb = callbackData( back );
					baseCallbacks[cb.type+'s'].push( cb.item );
				}
			}.bind( this ) );
			
			
			while ( ( timeArray = timeDataRegex.exec( times ) ) !== null ) {
				
				var time = timeArray[1] || timeArray[3]; // Either with call/classbacks or with out
				var dataBacks = timeArray[2] && timeArray[2].split(','); // time specific callbacks
				
				var tempObj = {
					name: name,
					el: el,
					startTime: parseFloat( time ),
					classbacks: baseCallbacks.classbacks.slice(0),
					callbacks:  baseCallbacks.callbacks.slice(0)
				};
				
				
				if ( dataBacks ) { // has a callback or classback
					dataBacks.forEach( function( cback ) { 
						var cb = callbackData( cback );
						tempObj[cb.type+'s'].push( cb.item );
					} );
				}
				returnArray.push( tempObj );
			}
			
			
		}.bind(this));		
	}
	return returnArray;
}
in_.dataParser.prototype.sortByAnimation = function() {
	var returnObject = {};
	var animationTimes = {};
	var timesRegex = /\[([\d\,]*)\]/ig;
	
	this.elementCache_.forEach( function( item, i, array ) {
		
		var animations = item.attributes.instepAnimations.split(' ');
		
		animations.forEach( function( animation, index, anims ) {
			times = timesRegex.exec( animation )[1].split(',');
			name = animation.replace(timesRegex,'');
			
			returnObject[name] = returnObject[name] || [];
			for ( var x = 0; x < times.length; x++ ) {
				returnObject[name].push({
					el: item.el,
					startTime: Number( times[x] )
				});
			}
			
			
		}.bind(this));		
		
	}.bind(this));
	
	return returnObject;
};


// We use start and end because the start time could fall between tick marks.
in_.dataParser.prototype.getAnimationsByTime = function( start, end ) {
	var animations = this.animationCache_;
	for( animation in animations ) {
		if ( animations.hasOwnProperty( animation ) && animations[animation] ) {
			
		}
	}
}



