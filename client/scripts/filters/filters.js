'use strict';

var lmsFilters = angular.module('lms.filters', []);

lmsFilters.filter('group', function(){
	return function(items, groupItems){
		if( items ){
			var byGroup = []
				, i, l
			;

			for( i = 0, l = items.length; i < l; i += groupItems ){
				if( i + groupItems > l ){
					byGroup.push( items.slice(i) );
				} else {
					byGroup.push( items.slice(i, i + groupItems) );
				}
			}

			return byGroup;
		}

		return null;
	};
});

lmsFilters.filter('urlify', function(){
	return function( text ){
		if( angular.isString( text ) ){
			return text.replace(/ /g, '_');
		}

		return null;
	};
});
