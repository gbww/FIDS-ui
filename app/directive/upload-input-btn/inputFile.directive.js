angular.module('com.app').directive('customFileBtn', function($document) {
  return{
    restrict: 'EA',
    link: function (scope, element) {
      element.on('click', function(){
        $($document).find(".select-file").click();
      });
    }
  }
}).directive('customFileChange', function() {
  return{
    restrict: 'EA',
    scope: {
      addFile: '&customFileChange',
    },
    link: function (scope, element) {
      var changeHandler = scope.$eval(scope.addFile);
      element.on('change', changeHandler);
    }
  }
});
