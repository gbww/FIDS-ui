'use strict';

angular.module('com.app').directive('customSelect', [function () {
	return {
		restrict: 'EA',
		replace: true,
		scope: {
			model: '=',
			mode: '@',
			key: '@',
			availArr: '=',
			name: '@',
			className: '@',
			placeholder: '@'
		},
		templateUrl: 'directive/custom-select/customSelect.html',
		link: function (scope, element) {
			scope.show = false;
			if (!scope.className) {
				scope.className = 'input';
			}

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
				if (scope.mode == 'append') {
					scope.model[scope.key] = scope.model[scope.key] + val;
				} else {
					scope.model[scope.key] = val;
				}
				$(event.target).parents('ul').addClass('ng-hide');
			}

			$(document).click(function () {
				$('.select-wrapper').find('ul').addClass('ng-hide');
				scope.$apply();
			})
		}
	}
}]);
