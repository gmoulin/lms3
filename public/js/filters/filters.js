'use strict';

angular.module('lms.filters', [])
	.filter('group', function(){
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
	})
	.filter('urlify', function(){
		return function( text ){
			if( angular.isString( text ) ){
				return text.replace(/ /g, '_');
			}

			return null;
		};
	})
	.filter('timeDistance', function () {
		// poor man's i18n
		var LESS_THAN = 'less than'
			, ABOUT = 'about'
			, ALMOST = 'almost'
			, OVER = 'over'
			, A = 'a'
			, MINUTE = ['minute', 'minutes']
			, HOUR = ['hour', 'hours']
			, DAY = ['day','days']
			, MONTH = ['month','months']
			, YEAR = ['year','years']
		;

		return function( toTime, fromTime ){
			var out = toTime;
			toTime = new Date( toTime );
			if( !angular.isDefined( fromTime ) ){
				fromTime = new Date();
			} else if( !angular.isDate( fromTime ) ){
				fromTime = new Date( fromTime );
			}

			if( !isNaN( toTime ) && !isNaN( fromTime ) ){
				var distance = Math.abs(fromTime - toTime)
					, distanceInMinutes = Math.round(Math.abs(distance / 60000.0))
					, distanceInSeconds = Math.round(Math.abs(distance / 1000.0))
				;

				if( distanceInMinutes <= 1 ){
					if( distanceInMinutes === 0 ){
						out = LESS_THAN + ' ' + A + ' ' + MINUTE[0];
					} else {
						out = distanceInMinutes + ' ' + MINUTE[0];
					}

				} else if( distanceInMinutes >= 2 && distanceInMinutes <= 45 ){
					out = distanceInMinutes + ' ' + MINUTE[1];

				} else if( distanceInMinutes >= 46 && distanceInMinutes <= 1440 ){
					var hours = Math.max(Math.round(distanceInMinutes/60.0),1);
					out = ABOUT + ' ' + hours + ' ' + HOUR[(hours <= 1 ? 0 : 1)];

				} else if( distanceInMinutes >= 1441 && distanceInMinutes <= 43200 ){
					var days = Math.max(Math.round(distanceInMinutes/1440.0),1);
					out =  days + ' ' + DAY[(days <= 1 ? 0 : 1)];

				} else if( distanceInMinutes > 43201 && distanceInMinutes <= 86400 ){
					var aboutMonths = Math.max(Math.round(distanceInMinutes/43200.0),1);
					out = ABOUT + ' ' + aboutMonths + ' ' + MONTH[(aboutMonths <= 1 ? 0 : 1)];

				} else if( distanceInMinutes > 86401 && distanceInMinutes <= 525600 ){
					var months = Math.max(Math.round(distanceInMinutes/43200.0),1);
					out = months + ' ' + MONTH[(months <= 1 ? 0 : 1)];

				} else {
					var isLeapYear = function( year ){
						return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
					};

					var fromYear = fromTime.getFullYear();
					if( fromTime.getMonth() >= 2 ){
						fromYear += 1;
					}

					var toYear = toTime.getFullYear();
					if( toTime.getMonth() < 2 ){
						toYear -= 1;
					}

					var minutesWithLeapOffset = distanceInMinutes;
					if( fromYear > toYear ){
						var leapYears = 0;
						for( var i = fromYear; i <= toYear; i++ ){
							if( isLeapYear(i) ){
								leapYears++;
							}
						}
						minutesWithLeapOffset = distanceInMinutes - (leapYears * 1440);
					}

					var remainder = minutesWithLeapOffset % 525600
						, years = Math.floor(minutesWithLeapOffset / 525600)
					;
					if( remainder < 131400 ){
						out = ABOUT + ' ' + years + ' ' + YEAR[(years <= 1 ? 0 : 1)];

					} else if( remainder < 394200 ){
						out = OVER + ' ' + years + ' ' + YEAR[(years <= 1 ? 0 : 1)];

					} else {
						out = ALMOST + ' ' + years + ' ' + YEAR[(years <= 1 ? 0 : 1)];
					}
				}
			}
			return out;
		};
	})
;
