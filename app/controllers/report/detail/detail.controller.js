'use strict';

angular.module('com.app').controller('ReportDetailCtrl', function ($rootScope, $scope, $state, $stateParams, api, toastr, SampleService) {
  var vm = this;

  var reportBC = api.breadCrumbMap.report;
  vm.breadCrumbArr = [reportBC.root, reportBC.detail];

  $rootScope.loading = true;
  vm.getSampleInfo = function () {
    var sampleId = $stateParams.id;
    SampleService.getSampleInfo(sampleId).then(function (response) {
      $rootScope.loading = false;
      if (response.data.success) {
        $scope.$broadcast('reportInfo', response.data.entity);
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      $rootScope.loading = false;
      toastr.error(err.data);
    });
  }

  $scope.$on('refreshReport', vm.getSampleInfo);


  vm.goTab = function (tab) {
    if (tab == 'info') {
      $state.go('app.report.detail.info');
    } else if (tab == 'ci') {
      $state.go('app.report.detail.ci');
    }
  }

  $scope.$on('$stateChangeSuccess', function() {
    if ($state.includes('app.report.detail.info')) {
      vm.tab = 'info';
    } else if ($state.includes('app.report.detail.ci')) {
      vm.tab = 'ci';
    }
  })
});
