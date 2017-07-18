'use strict';

angular.module('com.app').directive('pageScroll', function () {
	return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    scope: {},
    template: '<div ng-transclude></div>',
    link: function(scope, element, attrs){
    	scope.pageCount = $($(element).children(".section")).length;
    	scope.pageIndex = 1;
    	scope.flag = false;
    	$($(element).children().first()).addClass("active");

    	scope.initLayout = function () {
	    	scope.clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
	    	$($(element).children(".section")).height(scope.clientHeight + 'px');
            $(element).css({'top': scope.clientHeight * (scope.pageIndex - 1) * (-1) + 'px'})
    	}

    	scope.initLayout();
			$(window).resize(function(){
				scope.initLayout();
				scope.$apply();
			});

    	$(element).on('mousewheel', function (event) {
    		if (scope.flag) return;
    		scope.flag = true;;
    		event = event.originalEvent;
    		event.delta = (event.wheelDelta) ? event.wheelDelta/120 : -(event.detail || 0)/3;
    		var initTop = parseInt($(element).css("top"));

    		if (event.delta < 0) { // 向下
    			if (scope.pageIndex >= scope.pageCount) {
    				scope.flag = false;
    				return;
    			}
    			$(element).animate({"top": initTop + (-1)*scope.clientHeight + 'px'}, function () {
    				scope.flag = false;
    			});
    			scope.pageIndex += 1;
    			$($(element).children(".section")).removeClass("active");
    			$($(element).children(".section")[scope.pageIndex - 1]).addClass("active");
    		} else { // 向上
    			if (scope.pageIndex <= 1) {
    				scope.flag = false;
    				return;
    			}
    			$(element).animate({"top": initTop + scope.clientHeight + 'px'}, function () {
    				scope.flag = false;
    			});
    			scope.pageIndex -= 1;
    			$($(element).children(".section")).removeClass("active");
    			$($(element).children(".section")[scope.pageIndex - 1]).addClass("active");
    		}
    	})
    }
  }
});
