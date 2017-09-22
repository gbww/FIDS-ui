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

			scope.togglePanel = function (event) {
				event.stopPropagation();
				event.preventDefault();
				var initHide = $(event.target).next().hasClass('ng-hide');
				$('.select-wrapper').find('ul').addClass('ng-hide');
				if (initHide) {
					$(event.target).next().removeClass('ng-hide');
				}
			}

			scope.select = function (event, val) {
				event.stopPropagation();
				scope.model[scope.key] = val;
				$(event.target).parents('ul').addClass('ng-hide');
			}

			$(document).click(function () {
				$('.select-wrapper').find('ul').addClass('ng-hide');
				scope.$apply();
			})
		}
	}
}]);
