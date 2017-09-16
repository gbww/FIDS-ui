'use strict';

angular.module('com.app').controller('LayoutMenuController', function LayoutMenuController($scope, $state) {
  var vm = this;

  vm.highLightMenu = function(){
  	vm.isDashboardActive = $state.includes('app.dashboard');


    vm.isCheckItemActive = $state.includes('app.checkItem');
    vm.isCheckItemListActive = $state.includes('app.checkItem.list');
    vm.isCheckItemManageActive = $state.includes('app.checkItem.manage');

    vm.isBusinessActive = $state.includes('app.business');
    vm.isBusinessContractActive = $state.includes('app.business.contract');
    vm.isBusinessCheckItemActive = $state.includes('app.business.checkItem');
    vm.isBusinessSampleActive = $state.includes('app.business.sample');
    vm.isBusinessInspectionActive = $state.includes('app.business.inspection');

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
