'use strict';

angular.module('com.app').controller('ContractCreateCtrl', function ($state, $stateParams, $timeout, api, toastr, ContractService) {
  var vm = this;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.contract.root, businessBC.contract.create];
  vm.type = $stateParams.type;

  vm.storageConditionArr = ['常温', '冷冻', '冷藏'];
  vm.detectTypeArr = ['委托检验', '发证检验', '其他'];
  vm.executeStandardArr = ['GB/T 23587-2009', '其他'];

  vm.taskCategoryArr = ['监督抽检', '投诉举报', '风险监测'];
  vm.sampleTypeArr = ['普通食品&工业加工食品', '餐饮加工食品', '食品相关产品', '食用农产品', '其他'];

  vm.productTypeArr = ['种植业产品', '畜牧业产品', '渔业产品', '加工产品', '其他'];
  vm.authCategoryArr = ['绿色食品认证', '有机食品认证', '无公害食品认证'];
  vm.authTypeArr = ['首次认证', '再次认证', '其他'];
  vm.enterpriseFileArr = ['现场审查意见', '现场调查报告', '其他'];

  vm.passReportCount = 1;
  vm.unpassReportCount = 0;
  vm.contract = {
    type: vm.type,
    isSubcontracting: '0',
    extra: null
  }

  if (vm.type === 'enterprise') {
    vm.contract = angular.merge({}, vm.contract, {
      isUseStandard: '0',
      isExpedited: '0',
      isEvaluation: '0',
      reportMethod: 'self'
    });
  } else if (vm.type === 'government') {
    vm.contract = angular.merge({}, vm.contract, {
      isSeparateSettlement: '0'
    });
  } else {
    vm.contract = angular.merge({}, vm.contract, {
      isUseStandard: '0',
      isExpedited: '0',
      isEvaluation: '0',
    });
  }


  vm.sampleArr = [];
  vm.addSample = function () {
    vm.sampleArr.push({name: '', specificationQuantity: '', executeStandard: '', detectBy: '', processTechnology: '', qualityLevel: '', productDate: '', storageTime: '', sampleShape: '', storageCondition: '', processDemand: ''});
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
    });
  }
  vm.deleteFile = function (idx) {
    vm.files.splice(idx, 1);
  }

  vm.ok = function (form) {
    if (form.$invalid) {
      vm.submitted = true;
      return;
    }

		var sampleList = angular.copy(vm.sampleArr);
    angular.forEach(sampleList, function (sample, idx) {
      if (!sample.name || !sample.executeStandard) {
        vm.sampleArr.splice(idx, 1);
      } else {
      	if (!sample.specificationQuantity) delete sample.specificationQuantity;
      	if (!sample.detectBy) delete sample.detectBy;
      	if (!sample.processTechnology) delete sample.processTechnology;
      	if (!sample.qualityLevel) delete sample.qualityLevel;
      	if (!sample.productDate) {
          delete sample.productDate;
        } else {
          sample.productDate = sample.productDate.split(' ')[0] + '\'T\'' + sample.productDate.split(' ')[1] + 'Z';
        }
      	if (!sample.storageTime) delete sample.storageTime;
      	if (!sample.sampleShape) delete sample.sampleShape;
      	if (!sample.storageCondition) delete sample.storageCondition;
      	if (!sample.processDemand) delete sample.processDemand;      	
      }
    });

  	var contractData = {
      contract: angular.merge({}, vm.contract, {
        isUseStandard: parseInt(vm.contract.isUseStandard),
        isSubcontracting: parseInt(vm.contract.isSubcontracting),
        isExpedited: parseInt(vm.contract.isExpedited),
        isEvaluation: parseInt(vm.contract.isEvaluation),
        reportCount: [(vm.passReportCount||0), (vm.unpassReportCount||0)].join(';'),
        acceptanceDate: vm.contract.acceptanceDate ? (vm.contract.acceptanceDate.split(' ')[0] + '\'T\'' + vm.contract.acceptanceDate.split(' ')[1] + 'Z') : null,
        inspectionDate: vm.contract.inspectionDate ? (vm.contract.inspectionDate.split(' ')[0] + '\'T\'' + vm.contract.inspectionDate.split(' ')[1] + 'Z') : null,
        signDate: vm.contract.signDate ? (vm.contract.signDate.split(' ')[0] + '\'T\'' + vm.contract.signDate.split(' ')[1] + 'Z') : null,
        contractTerm: vm.contract.contractTerm ? (vm.contract.contractTerm.split(' ')[0] + '\'T\'' + vm.contract.contractTerm.split(' ')[1] + 'Z') : null,
        inspectTime: vm.contract.inspectTime ? (vm.contract.inspectTime.split(' ')[0] + '\'T\'' + vm.contract.inspectTime.split(' ')[1] + 'Z') : null,
        expireTime: vm.contract.expireTime ? (vm.contract.expireTime.split(' ')[0] + '\'T\'' + vm.contract.expireTime.split(' ')[1] + 'Z') : null,
        contractSignTime: vm.contract.contractSignTime ? (vm.contract.contractSignTime.split(' ')[0] + '\'T\'' + vm.contract.contractSignTime.split(' ')[1] + 'Z') : null
      }),
      sampleList: sampleList
    };
    var formData = new FormData();
    formData.append('contractSample', JSON.stringify(contractData));
    angular.forEach(vm.files, function (file) {
      formData.append('files', file);
    });

		ContractService.createContract(formData).then(function (response) {
			if (response.data.success) {
				toastr.success('合同 ' + response.data.entity + ' 录入成功！');
				$state.go('app.business.contract');
			} else {
				toastr.error(response.data.message);
			}
		}).catch(function (err) {
			toastr.error(err.data.message);
		});
  }
});
