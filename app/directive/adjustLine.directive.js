'use strict';

angular.module('com.app').directive('adjustLine', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {},
    template: '<div class="adjust-line"></div>',
    link: function (scope, element, attrs) {
      var $parent = $(element).parent();
      var $next = $(element).parent().next();

      function addEvent(target, type, handler) {
        if (target.addEventListener) {
          target.addEventListener(type, handler, false);
        } else {
          target.attachEvent('on' + type, function (event) {
            return handler.call(target, event);
          });
        }
      }

      var mousedownHandler = function (event) {
        event.stopPropagation();
        scope.drag = true;
        scope.initWidth = $parent.width();
        scope.initNextWidth = $next.width();
        scope.initX = event.clientX;
      };

      var mouseoverHandler = function (event) {
        if (scope.drag) {
          var offsetX = event.clientX - scope.initX;
          if (scope.initWidth + offsetX < 10 || scope.initNextWidth - offsetX < 10) {
            return;
          }
          $parent.width(scope.initWidth + offsetX + 'px');
          $next.width(scope.initNextWidth - offsetX + 'px');
        }
      };

      var mouseupHandler = function () {
        scope.drag = false;
      };

      addEvent(element[0], 'mousedown', mousedownHandler);
      addEvent(document, 'mousemove', mouseoverHandler);
      addEvent(document, 'mouseup', mouseupHandler);
    }
  }
});
