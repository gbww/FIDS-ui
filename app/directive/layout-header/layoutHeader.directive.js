angular.module('com.app').directive('layoutHeader', function LayoutHeader() {
  return {
    restrict: 'EA',
    replace: true,
    scope: {},
    templateUrl: 'directive/layout-header/header.html',
    controller: 'LayoutHeaderController as vm'
  };
});
