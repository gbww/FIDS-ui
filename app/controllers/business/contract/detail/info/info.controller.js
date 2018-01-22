'use strict';

angular.module('com.app').controller('ContractDetailInfoCtrl', function ($rootScope, $state, $stateParams, $scope, $q, toastr, ContractService) {
  var vm = this;
  vm.status = $stateParams.status;
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
        vm.initSampleArr = angular.copy(vm.sampleArr);
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
  };
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
  };
  vm.deleteSample = function (idx) {
    vm.sampleArr.splice(idx, 1);
    if (vm.sampleArr.length === 0) {
      vm.addSample();
    }
  };

  vm.downloadFile = function (filepath) {
    var filename = filepath.substring(filepath.lastIndexOf('\\')+1);
    var link = document.createElement('a');
    link.href = '/api/v1/ahgz/contract/' + vm.contract.id + '/appendix?filename=' + filename;
    link.download = filename;
    link.click();
  };

  vm.files = [];
  vm.addFile = function (event) {
    angular.forEach(event.target.files, function (item) {
      vm.files.push(item);
    });
  };
  vm.deleteFile = function (idx) {
    vm.files.splice(idx, 1);
  };
  vm.deleteAppendix = function (idx) {
    vm.appendix.splice(idx, 1);
  };

  vm.sampleHasChanged = function (sample) {
    if (sample.productDate) {
      sample.productDate = sample.productDate.split(' ')[0] + '\'T\'' + sample.productDate.split(' ')[1] + 'Z';
    }
    for (var i=0,len=vm.initSampleArr.length; i<len; i++) {
      if (vm.initSampleArr[i].id === sample.id && !angular.equals(sample, vm.initSampleArr[i])) {
        return true;
      }
    }
    return false;
  }
  vm.handleSample = function (sample) {
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
    return sample;
  }

  vm.ok = function (form) {
    if (form.$invalid) {
      vm.submitted = true;
      return;
    }

    var existSampleIds = [], addedSampleList = [], modifiedSampleList = [];  
    var sampleList = angular.copy(vm.sampleArr);
    angular.forEach(sampleList, function (sample, idx) {
      if (!sample.name || !sample.executeStandard) {
        vm.sampleArr.splice(idx, 1);
      } else {
        if (sample.id) {
          existSampleIds.push(sample.id);
          if (vm.sampleHasChanged(angular.copy(sample))) {
            modifiedSampleList.push(vm.handleSample(sample));
          }
        } else {
          addedSampleList.push(vm.handleSample(sample));
        }
      	      	
      }
    });

    // 删除的sample
    var deletedSampleIds = [];
    if (!angular.equals(vm.initSampleArr, sampleList)) {
      angular.forEach(vm.initSampleArr, function (sample) {
        if (existSampleIds.indexOf(sample.id) === -1) {
          deletedSampleIds.push(sample.id);
        }
      });
    }

    var contractData = {
      contract: angular.merge({}, vm.contract, {
        isUseStandard: parseInt(vm.contract.isUseStandard),
        isSubcontracting: parseInt(vm.contract.isSubcontracting),
        isExpedited: parseInt(vm.contract.isExpedited),
        isEvaluation: parseInt(vm.contract.isEvaluation),
        appendix: null,
        reportCount: [(vm.passReportCount||0), (vm.unpassReportCount||0)].join(';')
      })
    };
    if (modifiedSampleList.length > 0 || addedSampleList.length > 0) {
      contractData.sampleList = modifiedSampleList.concat(addedSampleList);
    }

    var deletedFiles = [];
    if (!angular.equals(vm.appendix, vm.initAppendix)) {
      angular.forEach(vm.initAppendix, function (filepath) {
        var filename = filepath.substring(filepath.lastIndexOf('\\')+1);
        if (vm.appendix.indexOf(filepath) === -1) {
          deletedFiles.push(filename);
        }
      });
    }

    var formData = new FormData();
    formData.append('id', vm.contract.id);
    formData.append('contractSample', JSON.stringify(contractData));
    if (deletedSampleIds.length > 0) {
      formData.append('deleteSampleIdList', deletedSampleIds.join(';'));
    }
    if (deletedFiles.length > 0) {
      formData.append('deleteFileNameList', deletedFiles.join(';'));
    }
    angular.forEach(vm.files, function (file) {
      formData.append('files', file);
    });

    $rootScope.loading = true;  
    ContractService.editContract(formData).then(function (response) {
      $rootScope.loading = false;  
  		if (response.data.success) {
        $state.go('app.business.contract', {type: vm.type, status: vm.status});
  			toastr.success('合同修改成功！');
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).catch(function (err) {
      $rootScope.loading = false;  
  		toastr.error(err.data);
  	});
  }

});