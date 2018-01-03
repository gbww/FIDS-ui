'use strict';

angular.module('com.app').controller('ContractDetailInfoCtrl', function ($state, $stateParams, $scope, toastr, ContractService) {
  var vm = this;
  vm.appendix = [];

  vm.getContractInfo = function () {
    vm.loading = true;
    ContractService.getContractInfo($stateParams.id).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.contract = response.data.entity.contract;
        var appendix = vm.contract.appendix ? vm.contract.appendix.replace(/;$/, '').split(';') : [];
        angular.forEach(appendix, function (item) {
          vm.appendix.push(item);
        })
        vm.sampleArr = response.data.entity.sampleList;
        if (vm.sampleArr.length === 0) {
          vm.addSample();
        }
        vm.type = vm.contract.type;
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

  vm.addSample = function () {
    vm.sampleArr.push({name: '', specificationQuantity: '', executeStandard: '', detectBy: '', processTechnology: '', qualityLevel: '', productDate: '', storageTime: '', sampleShape: '', storageCondition: '', processDemand: ''});
  }
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
    });
  }
  vm.deleteFile = function (idx) {
    vm.files.splice(idx, 1);
  }
  vm.deleteAppendix = function (idx) {
    vm.appendix.splice(idx, 1);
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
