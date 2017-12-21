'use strict';

angular.module('com.app').controller('ContractCreateCtrl', function ($state, $stateParams, $timeout, api, toastr, ContractService) {
  var vm = this;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.contract.root, businessBC.contract.create];
  vm.type = $stateParams.type;

  vm.storageConditionArr = ['常温', '冷冻', '冷藏'];
  vm.detectTypeArr = ['委托检验', '发证检验', '其他'];
  vm.executeStandardArr = ['GB/T 23587-2009'];

  vm.taskCategoryArr = ['监督抽检', '投诉举报', '风险监测'];
  vm.sampleTypeArr = ['普通食品&工业加工食品', '餐饮加工食品', '食品相关产品', '食用农产品', '其他'];

  vm.productTypeArr = ['种植业产品', '畜牧业产品', '渔业产品', '加工产品', '其他'];
  vm.authCategoryArr = ['绿色食品认证', '有机食品认证', '无公害食品认证'];
  vm.authTypeArr = ['首次认证', '再次认证', '其他'];
  vm.enterpriseFileArr = ['现场审查意见', '现场调查报告', '其他'];

  vm.contract = {
    type: vm.type,
    isSubcontracting: '0',
    extra: null,
    passReportCount: 1,
    unpassReportCount: 0
  }

  if (vm.type === 'enterprise') {
    vm.contract = angular.merge({}, vm.contract, {
      isUseStandard: '0',
      isExpedited: '0',
      isEvaluation: '0',
      reportMethod: 'self'
    })
  } else if (vm.type === 'government') {
    vm.contract = angular.merge({}, vm.contract, {
      isSeparateSettlement: '0'
    });
  } else {
    vm.contract = angular.merge({}, vm.contract);
  }


  vm.sampleArr = [];
  vm.addSample = function () {
    vm.sampleArr.push({name: null, specificationQuantity: null, executeStandard: null, detectBy: null, processTechnology: null, qualityLevel: null, produceDate: null, storageTime: null, sampleShape: null, storageCondition: null, processDemand: null});
  }
  vm.addSample();
  vm.deleteSample = function (idx) {
    vm.sampleArr.splice(idx, 1);
    if (vm.sampleArr.length === 0) {
      vm.addSample();
    }
  }

  vm.files = [];
  vm.addFile = function (event) {
    angular.forEach(event.target.files, function (item) {
      vm.files.push(item);
    })
  };
  vm.deleteFile = function (idx) {
    vm.files.splice(idx, 1);
  }

  vm.ok = function (form) {
    if (form.$invalid) {
      vm.submitted = true;
      return;
    }

    angular.forEach(vm.sampleArr, function (sample, idx) {
      if (!sample.name || !sample.executeStandard) {
        vm.sampleArr.splice(idx, 1);
      }
    });

  	var contractData = {
      contract: angular.merge({}, vm.contract, {
        isUseStandard: parseInt(vm.contract.isUseStandard),
        isSubcontracting: parseInt(vm.contract.isSubcontracting),
        isExpedited: parseInt(vm.contract.isExpedited),
        isEvaluation: parseInt(vm.contract.isEvaluation),
      }),
      sampleList: vm.sampleArr
    };

		ContractService.createContract(contractData, vm.files).then(function (response) {
			if (response.data.success) {
				toastr.success('合同录入成功！');
				$state.go('app.business.contract');
			} else {
				toastr.error(response.data.message);
			}
		}).catch(function (err) {
			toastr.error(err.data.message);
		});
  }
});
