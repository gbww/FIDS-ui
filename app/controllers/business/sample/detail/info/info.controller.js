'use strict';

angular.module('com.app').controller('SampleDetailInfoCtrl', function ($state, $stateParams, $scope, $uibModal, toastr, SampleService) {
  var vm = this;
  vm.status = $stateParams.status;

  vm.getSampleInfo = function () {
    vm.loading = true;
    SampleService.getSampleInfo($stateParams.id).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.sample = response.data.entity;
        vm.initSample = angular.copy(vm.sample);
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    });
  };
  vm.getSampleInfo();


  vm.checkTypeArr = ['监督检验', '委托检验', '发证检验', '认证检验', '省级抽检', '风险监测'];
  vm.sampleLinkArr = ['流通环节', '餐饮环节', '生产环节'];

  vm.sampleLxArr = ['食用农产品', '工业加工食品', '餐饮加工食品', '保健食品', '食品添加剂', '食品相关产品', '其他'];
  vm.packageClassifyArr = ['预包装', '散装'];

  vm.sampleWayArr = ['随机抽样', '掷骰抽样'];
  vm.specificationModelArr = ['计量称重', '散装', 'kg/袋', 'g/袋', 'ml/瓶', 'L/瓶', 'L/桶', 'g/盒', 'kg/盒', 'ml/盒', 'L/盒'];
  vm.executeStandardArr = ['GB/T 23587-2009'];
  vm.processingTechnologyArr = ['合格品', '优等品', '一等品', '二等品', '三等品', '四等品', ];
  vm.closedStatusArr = ['封样完好', '封样破损'];
  vm.sampleStatusArr = ['固体', '液体', '半固体', '气体', '完好、新鲜、无异味', '腐烂、有异味'];
  vm.sampleBasenumberArr = ['瓶', '袋', 'g', 'kg', 'L', 'ml'];
  vm.saveWayArr = ['常温', '冷冻', '冷藏'];
  vm.sampleNamesArr = ['鲍仕峰 陶云飞', '杨洋 李振凡', '张磊 徐斌'];
  vm.responsiblePersonArr = [];
  vm.receiveUserArr = [];

  vm.changeContract = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      backdrop: 'static',
      templateUrl: 'controllers/business/sample/create/select-contract/selectContract.html',
      controller: 'SelectContractCtrl as vm'
    });

    modalInstance.result.then(function (res) {
      vm.sample.protocolId = res;
    })
  }

  vm.deleteAppendix = function () {
    delete vm.sample.appendix;
  }
  vm.file = null;
  vm.addFile = function (event) {
    vm.file = event.target.files[0];
    vm.deleteAppendix();
  }
  vm.deleteFile = function () {
    vm.file = null;
  }

  vm.downloadFile = function (filepath) {
    var filename = filepath.substring(filepath.lastIndexOf('/')+1);
    var link = document.createElement('a');
    link.href = '/api/v1/ahgz/receive/attachment/download?path=' + filepath;
    link.download = filename;
    link.click();
  };

  vm.ok = function (form) {
    if (form.$invalid) {
      vm.submitted = true;
      return;
    }


    if (vm.file) {
      var formData = new FormData();
      formData.append('file', vm.file);
      formData.append('reportId', vm.sample.reportId);
      SampleService.uploadSampleAppendix(formData).catch(function (err) {
        toastr.error(err.data);
      })
    } else if (vm.initSample.appendix) {
      SampleService.deleteSampleAppendix(vm.sample.reportId).catch(function (err) {
        toastr.error(err.data);
      })
    }

    if (!angular.equals(vm.sample, vm.initSample)) {
      SampleService.editSample(vm.sample).then(function (response) {
        if (response.data.success) {
          $state.go('app.business.sample', {status: vm.status});
          toastr.success('接样单修改成功！');
        } else {
          toastr.error(response.data.message);
        }
      }).catch(function (err) {
        toastr.error(err.data);
      })
    }
  }

});
