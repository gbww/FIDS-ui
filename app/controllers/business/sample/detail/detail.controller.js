'use strict';

angular.module('com.app').controller('SampleDetailCtrl', function ($rootScope, $scope, $state, $stateParams, api, toastr, SampleService) {
  var vm = this;


  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.sample.root, businessBC.sample.detail];

  $rootScope.loading = true;
  vm.getSampleInfo = function () {
    var sampleId = $stateParams.id;
    SampleService.getSampleInfo(sampleId).then(function (response) {
      $rootScope.loading = false;
      if (response.data.success) {
        $scope.$broadcast('sampleInfo', response.data.entity);
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      $rootScope.loading = false;
      toastr.error(err.data.message);
    });
  }

  $scope.$on('refreshSample', vm.getSampleInfo);


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
