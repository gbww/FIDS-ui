'use strict';

angular.module('com.app').controller('ContractDetailInfoCtrl', function ($state, $stateParams, $scope, toastr, ContractService) {
  var vm = this;

  vm.getContractInfo = function () {
    vm.loading = true;
    ContractService.getContractInfo($stateParams.id).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.contract = response.data.entity;
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    });
  }
  vm.getContractInfo();

  vm.storageConditionArr = ['常温', '冷冻', '冷藏'];
  vm.detectTypeArr = ['委托检验', '发证检验', '其他'];
  vm.executeStandardArr = ['GB/T 23587-2009'];

  vm.taskCategoryArr = ['监督抽检', '投诉举报', '风险监测'];
  vm.sampleTypeArr = ['普通食品&工业加工食品', '餐饮加工食品', '食品相关产品', '食用农产品', '其他'];

  vm.productTypeArr = ['种植业产品', '畜牧业产品', '渔业产品', '加工产品', '其他'];
  vm.authCategoryArr = ['绿色食品认证', '有机食品认证', '无公害食品认证'];
  vm.authTypeArr = ['首次认证', '再次认证', '其他'];
  vm.enterpriseFileArr = ['现场审查意见', '现场调查报告', '其他'];

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

  	ContractService.editContract(vm.contract.id, data).then(function (response) {
  		if (response.data.success) {
        $state.go('app.business.contract');
  			toastr.success('合同修改成功！');
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).catch(function (err) {
  		toastr.error(err.data);
  	})
  }

});
