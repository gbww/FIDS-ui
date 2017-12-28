'use strict';

angular.module('com.app').controller('ContractDetailCtrl', function ($scope, $state, api) {
  var vm = this;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.contract.root, businessBC.contract.detail];

  vm.goTab = function (tab) {
    if (tab == 'info') {
      $state.go('app.business.contract.detail.info');
    } else if (tab == 'comment') {
      $state.go('app.business.contract.detail.comment');
    } else if (tab == 'ci') {
      $state.go('app.business.contract.detail.ci');
    } else if (tab == 'log') {
      $state.go('app.business.contract.detail.log');
    }
  }

  $scope.$on('$stateChangeSuccess', function() {
    if ($state.includes('app.business.contract.detail.info')) {
      vm.tab = 'info';
    } else if ($state.includes('app.business.contract.detail.comment')) {
      vm.tab = 'comment';
    } else if ($state.includes('app.business.contract.detail.ci')) {
      vm.tab = 'ci';
    } else if ($state.includes('app.business.contract.detail.log')) {
      vm.tab = 'log';
    }
  })

});
