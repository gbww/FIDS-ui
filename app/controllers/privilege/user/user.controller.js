'use strict';

angular.module('com.app').controller('PrivilegeUserCtrl', function ($state, $scope, api) {
  var vm = this;

  var privilegeBC = api.breadCrumbMap.privilege;
  vm.breadCrumbArr = [privilegeBC.root, privilegeBC.user.root];

  vm.goTab = function (tab) {
    if (tab == 'category') {
      $state.go('app.privilege.user.category');
    } else if (tab == 'list') {
      $state.go('app.privilege.user.list');
    }
  }

  $scope.$on('$stateChangeSuccess', function() {
    if ($state.includes('app.privilege.user.list')) {
      vm.tab = 'list';
    } else if ($state.includes('app.privilege.user.category')) {
      vm.tab = 'category';
    }
  })

})
