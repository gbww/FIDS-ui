'use strict';

angular.module('com.app').controller('SampleCreateCtrl', function ($rootScope, $state, $cookies, $uibModal, api, toastr, SampleService) {
  var vm = this;

  vm.clonedReportId = $cookies.get('clonedReportId');

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.sample.root, businessBC.sample.create];

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

  var initSample = {
    sampleType: '食品',
    sampleCirculate: '生产日期',
    status: 0
  }
  // 抽样单
  vm.sample = angular.copy(initSample);

  // 样品管理（留样和检样）
  vm.sampleManager = {
    managerType: '检样'
  }

  // sample和sampleManage相同字段有: sampleName receiveDate zhibaoqi sampleCirculateDate 

  vm.paste = function () {
    $rootScope.loading = true;
    SampleService.getSampleInfo(vm.clonedReportId).then(function (response) {
      $rootScope.loading = false;
      if (response.data.success) {
        vm.sample = response.data.entity
        delete vm.sample.reportId;
        delete vm.sample.receiveSampleId;
        delete vm.sample.status;
        delete vm.sample.reportStatus;
        delete vm.sample.drawUser;
        delete vm.sample.examineUser;
        delete vm.sample.approva;
        delete vm.sample.reportProcessId;
        delete vm.sample.devices;
        delete vm.sample.appendix;
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      $rootScope.loading = false;
      toastr.error(err.data);
    })
  }

  vm.reset = function () {
    vm.sample = angular.copy(initSample);
  }

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

  vm.ok = function (form) {
    if (form.$invalid) {
      vm.submitted = true;
      return;
    }
    
    vm.sampleManager = {
      reportId: vm.sample.reportId,
      sampleName: vm.sample.sampleName,
      sampleCirculateDate: vm.sample.sampleCirculateDate,
      receiveDate: vm.sample.receiveDate,
    }
    // TODO: 留样管理


    SampleService.createSample(vm.sample).then(function (response) {
       if (response.data.success) {
            toastr.success('接样单录入成功！');
            $state.go('app.business.sample');
        } else {
            toastr.error(response.data.message);
        }
    }).catch(function (err) {
        toastr.error(err.data);
    });
  }
});
