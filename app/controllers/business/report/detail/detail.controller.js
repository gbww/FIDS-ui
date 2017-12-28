'use strict';

angular.module('com.app').controller('ReportDetailCtrl', function ($scope, $state, api) {
  var vm = this;
  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.report.root, businessBC.report.detail];

  vm.goTab = function (tab) {
    if (tab == 'info') {
      $state.go('app.business.report.detail.info');
    } else if (tab == 'ci') {
      $state.go('app.business.report.detail.ci');
    }
  }

  $scope.$on('$stateChangeSuccess', function() {
    if ($state.includes('app.business.report.detail.info')) {
      vm.tab = 'info';
    } else if ($state.includes('app.business.report.detail.ci')) {
      vm.tab = 'ci';
    }
  })

});
