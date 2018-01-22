'use strict';

angular.module('com.app').controller('CiSampleDetailCtrl', function ($scope, $state, $stateParams, api) {
  var vm = this;
  var businessBC = api.breadCrumbMap.business;
  var itemToCheck = angular.copy(businessBC.itemToCheck.root);
  itemToCheck.params = {
    status: $stateParams.status
  };
  vm.breadCrumbArr = [businessBC.root, itemToCheck, businessBC.itemToCheck.detail];

  vm.goTab = function (tab) {
    if (tab == 'info') {
      $state.go('app.business.itemToCheck.detail.info');
    } else if (tab == 'ci') {
      $state.go('app.business.itemToCheck.detail.ci');
    }
  }

  $scope.$on('$stateChangeSuccess', function() {
    if ($state.includes('app.business.itemToCheck.detail.info')) {
      vm.tab = 'info';
    } else if ($state.includes('app.business.itemToCheck.detail.ci')) {
      vm.tab = 'ci';
    }
  })

});
