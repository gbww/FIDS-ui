angular.module('com.app').directive('draggableModal', ['$document', function($document) {
  return {
    restrict: 'EA',
    replace: true,
    // scope: {},
    link: function (scope, element, attrs) {
      var ele = $(element).parents('.modal-dialog')
      var dragBar = ele.find('.modal-header')
      

      var startX = 0, startY = 0, x = 0, y = 0;
      dragBar.css({
          cursor: 'move'
      });

      dragBar.on('mousedown', function(event) {
          // Prevent default dragging of selected content
          event.preventDefault();
          startX = event.pageX - x;
          startY = event.pageY - y;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
          y = event.pageY - startY;
          x = event.pageX - startX;
          ele.css({
          top: y + 'px',
          left:  x + 'px'
          });
      }

      function mouseup() {
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
      }
    }
  };
}]);