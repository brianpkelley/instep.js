/**
 * Auto Run function on load
 */

in_.domReady( window, function() {
	var vidsOnPage = document.querySelectorAll('video');
	
	var i;
	
	for ( i = 0; i < vidsOnPage.length; i++ ) {
		if ( document.querySelector( '[data-instep="'+ vidsOnPage[i].id+'"]') ) {
			new instepjs( vidsOnPage[i].id );
		}
	}
	
});