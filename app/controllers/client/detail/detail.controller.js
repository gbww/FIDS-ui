'use strict';

angular.module('com.app').controller('ClientDetailCtrl', function ($rootScope, $scope, $state, $stateParams, api, toastr, ContractService) {
  var vm = this;

  var clientBC = api.breadCrumbMap.client;
  vm.breadCrumbArr = [clientBC.root, clientBC.detail];

  vm.goTab = function (tab) {
    if (tab == 'link') {
      $state.go('app.client.detail.link');
    } else if (tab == 'schedule') {
      $state.go('app.client.detail.schedule');
    }
  }

  $scope.$on('$stateChangeSuccess', function() {
    if ($state.includes('app.client.detail.link')) {
      vm.tab = 'link';
    } else if ($state.includes('app.client.detail.schedule')) {
      vm.tab = 'schedule';
    }
  })

});
