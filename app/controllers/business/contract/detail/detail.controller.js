'use strict';

angular.module('com.app').controller('ContractDetailCtrl', function ($rootScope, $scope, $state, $stateParams, api, toastr, ContractService) {
  var vm = this;


  var businessBC = api.breadCrumbMap.business;
  var detail = angular.copy(businessBC.contract.detail);

  vm.breadCrumbArr = [businessBC.root, businessBC.contract.root, detail];

  $rootScope.loading = true;
  vm.getContractInfo = function () {
    var contractId = $stateParams.id;
    ContractService.getContractInfo(contractId).then(function (response) {
      $rootScope.loading = false;
      if (response.data.success) {
        $scope.$broadcast('contractInfo', response.data.entity);
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      $rootScope.loading = false;
      toastr.error(err.data.message);
    });
  }

  $scope.$on('refreshContract', vm.getContractInfo);


  vm.goTab = function (tab) {
    if (tab == 'info') {
      $state.go('app.business.contract.detail.info');
    } else if (tab == 'comment') {
      $state.go('app.business.contract.detail.comment');
    } else if (tab == 'ci') {
      $state.go('app.business.contract.detail.ci');
    } else if (tab == 'sample') {
      $state.go('app.business.contract.detail.sample');
    }
  }

  $scope.$on('$stateChangeSuccess', function() {
    if ($state.includes('app.business.contract.detail.info')) {
      vm.tab = 'info';
    } else if ($state.includes('app.business.contract.detail.comment')) {
      vm.tab = 'comment';
    } else if ($state.includes('app.business.contract.detail.ci')) {
      vm.tab = 'ci';
    } else if ($state.includes('app.business.contract.detail.sample')) {
      vm.tab = 'sample';
    }
  })

});
