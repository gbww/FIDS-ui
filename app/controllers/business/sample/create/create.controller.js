'use strict';

angular.module('com.app').controller('SampleCreateCtrl', function ($state, $uibModal, api, toastr, SampleService) {
  var vm = this;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.sample.root, businessBC.sample.create];

  vm.checkTypeArr = ['监督检验', '省级食品安全监', '委托检验', '发证检验'];
  vm.sampleLinkArr = ['流通环节', '餐饮环节', '生产环节'];
  vm.sampleCirculateArr = ['生产日期', '加工日期', '购进日期', '消毒日期'];
  vm.sampleWayArr = ['接样方式一'];
  vm.specificationModelArr = ['规格一'];
  vm.executeStandardArr = ['标准一', '标准二'];
  vm.processingTechnologyArr = ['等级一'];
  vm.closedStatusArr = ['状态一'];
  vm.sampleStatusArr = ['状态一'];
  vm.sampleBasenumberArr = ['基数一'];
  vm.saveWayArr = ['常温', '冷冻', '冷藏'];
  vm.sampleNamesArr = ['zhangsan'];
  vm.responsiblePersonArr = ['lisi'];
  vm.receiveUserArr = ['wangwu'];
  vm.subpackageArr = ['分包一'];

  vm.sample = {
    reportPageNumber: 1,
    sampleType: 'food',
    reportLayout: 'singleVersion',
    coverLayout: 'test',
    sampleNumber: 1,
    drawUser: api.userInfo.username,
    status: 0,
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
