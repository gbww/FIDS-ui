'use strict';

angular.module('com.app').controller('DashboardCtrl', function ($state, $timeout, api, DashboardService) {
  var vm = this;

  vm.breadCrumbArr = [api.breadCrumbMap.dashboard.root];

  vm.judgeContracts = [];
  vm.getJudgeContractList = function () {
  	vm.judgeLoading = true;
  	DashboardService.getJudgeContractList().then(function (response) {
  		$timeout(function () {
		  	vm.judgeLoading = false;
	  		vm.judgeContracts = response.data.contractList;
  		}, 1000);
  	})
  }
  vm.getJudgeContractList();
  vm.goContract = function (id) {
    $state.go('app.business.contract.detail', {type: 'edit', id: '123456', tab: 'judgement'});
  }

  vm.samples = [];
  vm.getSampleList = function () {
  	vm.samples = [];
  }
});
