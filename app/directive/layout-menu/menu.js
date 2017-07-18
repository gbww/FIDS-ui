'use strict';

angular.module('com.app').controller('LayoutMenuController', function LayoutMenuController($scope, $state) {
  var vm = this;

  vm.highLightMenu = function(){
  	vm.isDashboardActive = $state.includes('app.dashboard');
    vm.isManageActive = $state.includes('app.manage');
    vm.isManageChild1Active = $state.includes('app.manage.child1');
    vm.isManageChild2Active = $state.includes('app.manage.child2');
  }

  vm.highLightMenu();
  $scope.$on('$stateChangeSuccess', function() {
    if (sessionStorage.getItem('navbarStatus') === 'narrow') {
      $(".navbar-items").find("ul").hide();
    }
  	vm.highLightMenu();
  });
});
