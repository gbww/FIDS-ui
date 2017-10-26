'use strict';

angular.module('com.app').controller('LayoutMenuController', function LayoutMenuController($scope, $state) {
  var vm = this;

  vm.open = function (module) {
    $("#accordion").children('.panel').children('ul').collapse('hide');
    if (module == 'dashboard') {
      $state.go('app.dashboard');
    } else if (module == 'itemToCheck') {
      $state.go('app.itemToCheck');
    } else if (module == 'report') {
      $state.go('app.report');
    }
  }

  vm.highLightMenu = function(){
  	vm.isDashboardActive = $state.includes('app.dashboard');
    vm.isItemToCheckActive = $state.includes('app.itemToCheck');
    vm.isReportActive = $state.includes('app.report');

    vm.isCheckItemActive = $state.includes('app.checkItem');
    vm.isCheckItemListActive = $state.includes('app.checkItem.list');
    vm.isCheckItemManageActive = $state.includes('app.checkItem.manage');

    vm.isFileActive = $state.includes('app.file');
    vm.isTemplateActive = $state.includes('app.file.template');

    vm.isBusinessActive = $state.includes('app.business');
    vm.isBusinessContractActive = $state.includes('app.business.contract');
    vm.isBusinessSampleActive = $state.includes('app.business.sample');

    vm.isPrivilegeActive = $state.includes('app.privilege');
    vm.isPrivilegeCurrentUserActive = $state.includes('app.privilege.currentUser');
    vm.isPrivilegeOrganizationActive = $state.includes('app.privilege.organization');
    vm.isPrivilegeUserActive = $state.includes('app.privilege.user');
    vm.isPrivilegeRoleActive = $state.includes('app.privilege.role');

  }

  vm.highLightMenu();
  $scope.$on('$stateChangeSuccess', function() {
  	vm.highLightMenu();
  });
});
