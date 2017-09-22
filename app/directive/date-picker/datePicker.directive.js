angular.module('com.app')
  .directive("datepicker", function () {
    return {
      restrict: "A",
      require: "ngModel",
      link: function (scope, elem, attrs, ngModelCtrl) {
        // ngModelCtrl.$render = function () {
        //   elem.html(ngModelCtrl.$viewValue || '');
        // }
        var updateModel = function () {
          scope.$apply(function () {
            ngModelCtrl.$setViewValue(elem.val());
          });
        };
        $(elem).datetimepicker({
          useCurrent: false,
          format: 'YYYY-MM-DD hh:mm:ss'
        });
        $(elem).on("dp.change",function (e) {
          updateModel();
        });
      }
    }
  });
