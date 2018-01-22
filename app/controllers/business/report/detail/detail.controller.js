'use strict';

angular.module('com.app').controller('ReportDetailCtrl', function ($scope, $state, $stateParams, api) {
  var vm = this;
  var businessBC = api.breadCrumbMap.business;
  var report = angular.copy(businessBC.report.root);
  report.params = {
    status: $stateParams.status
  }
  vm.breadCrumbArr = [businessBC.root, report, businessBC.report.detail];

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
