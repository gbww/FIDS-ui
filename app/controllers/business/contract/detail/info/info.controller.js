'use strict';

angular.module('com.app').controller('ContractDetailInfoCtrl', function ($state, $stateParams, $scope, $q, toastr, ContractService, Upload) {
  var vm = this;
  vm.appendix = [];

  vm.getContractInfo = function () {
    vm.loading = true;
    ContractService.getContractInfo($stateParams.id).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.contract = response.data.entity.contract;
        if (vm.contract.reportCount) {
          vm.passReportCount = parseInt(vm.contract.reportCount.split(';')[0] || 0);
          vm.unpassReportCount = parseInt(vm.contract.reportCount.split(';')[1] || 0);
        } else {
          vm.passReportCount = 0;
          vm.unpassReportCount = 0;
        }
        vm.type = vm.contract.type;

        var appendix = vm.contract.appendix ? vm.contract.appendix.replace(/;$/, '').split(';') : [];
        angular.forEach(appendix, function (item) {
          vm.appendix.push(item);
        });
        vm.initAppendix = angular.copy(vm.appendix);

        vm.sampleArr = response.data.entity.sampleList;
        if (vm.sampleArr.length === 0) {
          vm.addSample();
        }
        angular.forEach(vm.sampleArr, function (sample) {
          if (sample.productDate) {
            sample.productDate = sample.productDate.split("'T'").join(' ').replace(/Z$/, '');
          }
        });
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

  vm.downloadFile = function (filepath) {
    var filename = filepath.substring(filepath.lastIndexOf('\\')+1);
    var link = document.createElement('a');
    link.href = '/api/v1/ahgz/contract/' + vm.contract.id + '/appendix?filename=' + filename;
    link.download = filename;
    link.click();
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
        appendix: null,
        reportCount: [(vm.passReportCount||0), (vm.unpassReportCount||0)].join(';')
      }),
      sampleList: sampleList
    };

    var deletedFiles = [], promiseArr = [];
    // 更新合同内容
    promiseArr.push(ContractService.editContract(vm.contract.id, contractData));
    // 添加附件
    angular.forEach(vm.files, function (file) {
      promiseArr.push(Upload.upload({
        url: 'api/v1/ahgz/contract/' + vm.contract.id + '/appendix',
        data: {
          file: file
        }
      }));
    });

    // 删除附件
    if (!angular.equals(vm.appendix, vm.initAppendix)) {
      angular.forEach(vm.initAppendix, function (filepath) {
        var filename = filepath.substring(filepath.lastIndexOf('\\')+1);
        if (vm.appendix.indexOf(filepath) === -1) {
          deletedFiles.push(filename);
        }
      });
    }

    angular.forEach(deletedFiles, function (file) {
      promiseArr.push(ContractService.deleteAppendix(vm.contract.id, file));
    });

  	$q.all(promiseArr).then(function (responses) {
  		if (responses[0].data.success) {
        $state.go('app.business.contract');
  			toastr.success('合同修改成功！');
  		} else {
  			toastr.error(responses[0].data.message);
  		}
  	}).catch(function (err) {
  		toastr.error(err.data);
  	})
  }

});
