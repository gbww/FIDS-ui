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
			replaceReg: '@',
			replaceValue: '=',
			name: '@',
			className: '@',
			type: '@',
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
				if (initHide && scope.availArr && scope.availArr.length > 0) {
					$(event.target).next().removeClass('ng-hide');
				}
			}

			scope.$watch('scope.replaceValue', function () {
				if (scope.value) {
					var reg = new RegExp(scope.replaceReg);
					scope.model[scope.key] = scope.value.replace(reg, scope.replaceValue);
				}
			})

			scope.select = function (event, val) {
				scope.value = val;
				event.stopPropagation();
				if (scope.mode == 'append') {
					scope.model[scope.key] = (scope.model[scope.key] || '') + val;
				} else {
					if (scope.replaceValue) {
						var reg = new RegExp(scope.replaceReg);
						scope.model[scope.key] = val.replace(reg, scope.replaceValue);
					} else {
						scope.model[scope.key] = val;
					}
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
