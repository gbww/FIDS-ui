'use strict';

angular.module('com.app').directive('customSelect', [function () {
	return {
		restrict: 'EA',
		replace: true,
		scope: {
			model: '=',
			key: '@',
			availArr: '=',
			name: '@'
		},
		templateUrl: 'directive/custom-select/customSelect.html',
		link: function (scope, element) {
			scope.show = false;

			scope.showPanel = function (event) {
				event.stopPropagation();
				scope.show = !scope.show;
			}

			scope.select = function (event, val) {
				event.stopPropagation();
				scope.model[scope.key] = val;
				scope.show = false;
			}

			$(document).click(function () {
				scope.show = false;
				scope.$apply();
			})
		}
	}
}]);
