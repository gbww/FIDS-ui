'use strict';

angular.module('com.app').controller('SampleDetailCtrl', function ($scope, $state, api) {
  var vm = this;
  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.sample.root, businessBC.sample.detail];

  vm.goTab = function (tab) {
    if (tab == 'info') {
      $state.go('app.business.sample.detail.info');
    } else if (tab == 'ci') {
      $state.go('app.business.sample.detail.ci');
    }
  }

  $scope.$on('$stateChangeSuccess', function() {
    if ($state.includes('app.business.sample.detail.info')) {
      vm.tab = 'info';
    } else if ($state.includes('app.business.sample.detail.ci')) {
      vm.tab = 'ci';
    }
  })

});
