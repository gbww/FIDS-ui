'use strict';

angular.module('com.app').controller('ContractCreateCtrl', function ($state, $timeout, api, toastr, ContractService) {
  var vm = this;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.contract.root, businessBC.contract.create];

  vm.storageConditionArr = ['常温', '冷冻', '冷藏'];
  vm.detectTypeArr = ['监督检验', '省级食品安全监', '委托检验', '发证检验'];
  vm.executeStandardArr = ['标准一', '标准二'];

  vm.contract = {
  	isUseStandard: '0',
  	isSubcontracting: '0',
  	isExpedited: '0',
  	isEvaluation: '0',
  	reportMethod: 'self',
  	reportCount: 1,
  	extra: null
  }

  vm.protocolIdValid = true;
  vm.validateProtocolId = function () {
    $timeout.cancel(vm.validTimeout);
    var id = vm.contract.protocolId;
    vm.validTimeout = $timeout(function () {
      vm.validating = true;
      ContractService.validateProtocolId(id).then(function (response) {
        vm.validating = false;
        if (response.data.success) {
          vm.protocolIdValid = !response.data.entity;
        }
      });
    }, 400)
  }

  vm.ok = function (form) {
    if (form.$invalid) {
      vm.submitted = true;
      return;
    }
  	var data = angular.merge({}, vm.contract, {
	  	isUseStandard: parseInt(vm.contract.isUseStandard),
	  	isSubcontracting: parseInt(vm.contract.isSubcontracting),
	  	isExpedited: parseInt(vm.contract.isExpedited),
	  	isEvaluation: parseInt(vm.contract.isEvaluation)
  	});

		ContractService.createContract(data).then(function (response) {
			if (response.data.success) {
				toastr.success('合同录入成功！');
				$state.go('app.business.contract');
			} else {
				toastr.error(response.data.message);
			}
		}).catch(function (err) {
			toastr.error(response.data.message);
		})
  }
});
