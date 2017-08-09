'use strict';

angular.module('com.app').controller('BusinessContractCtrl', function ($scope, $state, $uibModal, api, ContractService) {
  var vm = this;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.contract.root];

  vm.getContractList = function () {
  	vm.loading = true;
  	vm.contracts = [];
  	ContractService.getContractList().then(function (response) {
  		vm.loading = false;
		  vm.contracts = response.data.contractList;
  	}).catch(function (error) {
  		vm.loading = false;
  	})
  }

  vm.getContractList();

  vm.create = function () {
  	$state.go('app.business.contract.detail', {type: 'create'});
  }

  vm.goDetail = function (id) {
  	$state.go('app.business.contract.detail', {type: 'edit', id: id});
  }

  // 发起评审
  vm.judge = function (id) {
  	var modalInstance = $uibModal.open({
  		animation: true,
  		size: 'md',
  		backdrop: 'static',
  		templateUrl: 'controllers/business/contract/judge/judge.html',
  		controller: 'ContractJudgeCtrl as vm'
  	})
  }

});
