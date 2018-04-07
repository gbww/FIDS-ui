'use strict';

angular.module('com.app').controller('SampleCreateCtrl', function ($rootScope, $state, $cookies, $uibModal, api, toastr, SampleService) {
  var vm = this;

  // vm.loading = true;
  // PrivilegeService.getUserList().then(function (response) {
  //   vm.loading = false;
  //   if (response.data.success) {
  //     var res = [];
  //     angular.forEach(response.data.entity.list, function (user) {
  //       res.push(user.name);
  //     });
  //     vm.users = res;
  //   } else {
  //     toastr.error(response.data.message);
  //   }
  // }).catch(function (err) {
  //   toastr.error(err.data);
  //   vm.loading = false;
  // });

  vm.clonedSampleId = $cookies.get('clonedSampleId');

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.sample.root, businessBC.sample.create];

  vm.checkTypeArr = ['监督检验', '委托检验', '发证检验', '认证检验', '省级抽检', '风险监测'];
  vm.sampleLinkArr = ['流通环节', '餐饮环节', '生产环节'];
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
  vm.subpackageArr = ['农标中心'];

  var initSample = {
    sampleType: '食品',
    status: 0
  }
  vm.sample = angular.copy(initSample);

  vm.paste = function () {
    $rootScope.loading = true;
    SampleService.getSampleInfo(vm.clonedSampleId).then(function (response) {
      $rootScope.loading = false;
      if (response.data.success) {
        vm.sample = angular.merge(response.data.entity, {reportId: null, receiveSampleId: null});
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
