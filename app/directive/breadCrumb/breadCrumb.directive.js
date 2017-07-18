'use strict';

angular.module('com.app').directive('breadCrumb', ['$state', function ($state) {
	return {
		restrict: 'EA',
		replace: true,
		scope: {
			linkData: '='
		},
		templateUrl: 'directive/breadCrumb/breadCrumb.html',
		link: function (scope, element) {
			scope.go = function (url, params) {
				if (params) {
					$state.go(url, params);
				} else {
					$state.go(url);
				}
			}
		}
	}
}]);
