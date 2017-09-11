angular.module('com.app').directive('layoutMenu', function LayoutMenu() {
  return {
    restrict: 'EA',
    replace: true,
    scope: {},
    templateUrl: 'directive/layout-menu/menu.html',
    controller: 'LayoutMenuController as vm'
  };
});
