// Polyfills
(function () {
	'use strict';
	
	// Function.Bind
	// https://gist.github.com/Daniel-Hug/5682738
	// https://gist.github.com/dsingleton/1312328
	Function.prototype.bind=(function(){}).bind||function(b){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");}function c(){}var a=[].slice,f=a.call(arguments,1),e=this,d=function(){return e.apply(this instanceof c?this:b||window,f.concat(a.call(arguments)));};c.prototype=this.prototype;d.prototype=new c();return d;};
	
	
	// Element.addEventListener
	// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
	if (!Event.prototype.preventDefault) {
		Event.prototype.preventDefault=function() {
			this.returnValue=false;
		};
	}
	if (!Event.prototype.stopPropagation) {
		Event.prototype.stopPropagation=function() {
			this.cancelBubble=true;
		};
	}
	if (!Element.prototype.addEventListener) {
		var eventListeners=[];
		
		var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
			var self=this;
			var wrapper=function(e) {
				e.target=e.srcElement;
				e.currentTarget=self;
				if (listener.handleEvent) {
					listener.handleEvent(e);
				} else {
					listener.call(self,e);
				}
			};
			if (type=="DOMContentLoaded") {
				var wrapper2=function(e) {
					if (document.readyState=="complete") {
						wrapper(e);
					}
				};
				document.attachEvent("onreadystatechange",wrapper2);
				eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});
				
				if (document.readyState=="complete") {
					var e=new Event();
					e.srcElement=window;
					wrapper2(e);
				}
			} else {
				this.attachEvent("on"+type,wrapper);
				eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
			}
		};
		var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
			var counter=0;
			while (counter<eventListeners.length) {
				var eventListener=eventListeners[counter];
				if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
					if (type=="DOMContentLoaded") {
						this.detachEvent("onreadystatechange",eventListener.wrapper);
					} else {
						this.detachEvent("on"+type,eventListener.wrapper);
					}
					break;
				}
				++counter;
			}
		};
		Element.prototype.addEventListener=addEventListener;
		Element.prototype.removeEventListener=removeEventListener;
		if (HTMLDocument) {
			HTMLDocument.prototype.addEventListener=addEventListener;
			HTMLDocument.prototype.removeEventListener=removeEventListener;
		}
		if (Window) {
			Window.prototype.addEventListener=addEventListener;
			Window.prototype.removeEventListener=removeEventListener;
		}
	}
	
	
	/********************************
	 * Array Functions
	 ********************************/
	
	// Array.forEach
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
	if (!Array.prototype.forEach)
	{
		Array.prototype.forEach = function(fun /*, thisArg */)
		{
			if (this === void 0 || this === null)
				throw new TypeError();
	
			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function")
				throw new TypeError();
	
			var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			for (var i = 0; i < len; i++)
			{
				if (i in t)
					fun.call(thisArg, t[i], i, t);
			}
		};
	}
	
	
	// Array.every
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
	if (!Array.prototype.every)
	{
		Array.prototype.every = function(fun /*, thisArg */)
		{
			
	
			if (this === void 0 || this === null)
				throw new TypeError();
	
			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== 'function')
					throw new TypeError();
	
			var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			for (var i = 0; i < len; i++)
			{
				if (i in t && !fun.call(thisArg, t[i], i, t))
					return false;
			}
	
			return true;
		};
	}
	
	
	// Array.some
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
	if (!Array.prototype.some)
	{
		Array.prototype.some = function(fun /*, thisArg */)
		{
	
			if (this === void 0 || this === null)
				throw new TypeError();
	
			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== 'function')
				throw new TypeError();
	
			var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			for (var i = 0; i < len; i++)
			{
				if (i in t && fun.call(thisArg, t[i], i, t))
					return true;
			}
	
			return false;
		};
	}
	
	
	
	
	/********************************
	 * DOM Functions
	 * https://github.com/inexorabletash/polyfill/blob/master/polyfill.js#L652
	 ********************************/
		
	// Selectors API Level 1 (http://www.w3.org/TR/selectors-api/)
  // http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
  if (!document.querySelectorAll) {
    document.querySelectorAll = function (selectors) {
      var style = document.createElement('style'), elements = [], element;
      document.documentElement.firstChild.appendChild(style);
      document._qsa = [];

      style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
      window.scrollBy(0, 0);
      style.parentNode.removeChild(style);

      while (document._qsa.length) {
        element = document._qsa.shift();
        element.style.removeAttribute('x-qsa');
        elements.push(element);
      }
      document._qsa = null;
      return elements;
    };
  }

  if (!document.querySelector) {
    document.querySelector = function (selectors) {
      var elements = document.querySelectorAll(selectors);
      return (elements.length) ? elements[0] : null;
    };
  }

  if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (classNames) {
      classNames = String(classNames).replace(/^|\s+/g, '.');
      return document.querySelectorAll(classNames);
    };
  }

  // Fix for IE8-'s Element.getBoundingClientRect()
  if ('TextRectangle' in window && !('width' in TextRectangle.prototype)) {
    Object.defineProperties(TextRectangle.prototype, {
      'width': { get: function() { return this.right - this.left; } },
      'height': { get: function() { return this.bottom - this.top; } }
    });
  }
	
	
	
	
	// ClassList PolyFill
	// https://github.com/remy/polyfills/blob/master/classList.js
	
	
	if (typeof window.Element !== "undefined" || !( "classList" in document.documentElement ) ) {
		
		var prototype = Array.prototype,
				push = prototype.push,
				splice = prototype.splice,
				join = prototype.join;
		
		var DOMTokenList = function (el) {
			this.el = el;
			// The className needs to be trimmed and split on whitespace
			// to retrieve a list of classes.
			var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
			for (var i = 0; i < classes.length; i++) {
				push.call(this, classes[i]);
			}
		};
		
		DOMTokenList.prototype = {
			add: function(token) {
				if(this.contains(token)) return;
				push.call(this, token);
				this.el.className = this.toString();
			},
			contains: function(token) {
				return this.el.className.indexOf(token) != -1;
			},
			item: function(index) {
				return this[index] || null;
			},
			remove: function(token) {
				if (!this.contains(token)) return;
				for (var i = 0; i < this.length; i++) {
					if (this[i] == token) break;
				}
				splice.call(this, i, 1);
				this.el.className = this.toString();
			},
			toString: function() {
				return join.call(this, ' ');
			},
			toggle: function(token) {
				if (!this.contains(token)) {
					this.add(token);
				} else {
					this.remove(token);
				}
		
				return this.contains(token);
			}
		};
		
		window.DOMTokenList = DOMTokenList;
		
		var defineElementGetter = function  (obj, prop, getter) {
				if (Object.defineProperty) {
						Object.defineProperty(obj, prop,{
								get : getter
						});
				} else {
						obj.__defineGetter__(prop, getter);
				}
		}
		
		defineElementGetter(Element.prototype, 'classList', function () {
			return new DOMTokenList(this);
		});
	}
	


// Adapted from https://gist.github.com/paulirish/1579671 which derived from 
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

// MIT license

	if (!Date.now)
		Date.now = function() { return new Date().getTime(); };
		
	var vendors = ['webkit', 'moz'];
	for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
			var vp = vendors[i];
			window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
			window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
																 || window[vp+'CancelRequestAnimationFrame']);
	}
	if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
			|| !window.requestAnimationFrame || !window.cancelAnimationFrame) {
			var lastTime = 0;
			window.requestAnimationFrame = function(callback) {
					var now = Date.now();
					var nextTime = Math.max(lastTime + 16, now);
					return setTimeout(function() { callback(lastTime = nextTime); },
														nextTime - now);
			};
			window.cancelAnimationFrame = clearTimeout;
	}

	

	
})();
	
	

