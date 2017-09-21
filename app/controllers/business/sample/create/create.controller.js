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
    receiveSampleId: null,
    reportId: null,
    reportPageNumber: 1,
    sampleType: 'food',
    checkType: '监督检验',
    reportLayout: 'singleVersion',
    coverLayout: 'test',

    entrustedUnit: null,
    entrustedUnitAddress: null,
    entrustedUser: null,
    entrustedUserPhone: null,
    entrustedUserEmail: null,

    inspectedUnit: null,
    inspectedUnitAddress: null,
    inspectedUser: null,
    inspectedUserPhone: null,
    inspectedUserEmail: null,

    sampleAddress: null,
    sampleName: null,
    sampleLink: null,
    sampleTrademark: null,
    sampleReportId: null,
    sampleCirculate: null,
    sampleCirculateDate: null,
    sampleDate: null,
    sampleWay: null,
    specificationModel: null,
    executeStandard: 'test',
    sampleNames: null,
    processingTechnology: null,
    closedStatus: null,
    sampleNumber: null,
    sampleStatus: null,
    sampleBasenumber: null,
    saveWay: null,
    productionUnit: null,
    productionAddress: null,
    productionUser: null,
    productionPhone: null,
    cost: null,
    remarks: null,
    dataRemarks: null,
    responsiblePerson: null,
    sampleHolder: null,
    receiveUser: null,
    receiveDate: null,
    arrangeFinishDate: null,
    finishDate: null,
    protocolId: null,
    subpackage: null,
    result: null,
    determine: null,
    approvalUser: null,
    examineUser: null,
    drawUser: api.userInfo.username,
    principalInspector: null,
    status: 0,
    createdAt: null
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
    var data = angular.merge({}, vm.sample, {
        sampleCirculateDate: vm.sample.sampleCirculateDate ? new Date(vm.sample.sampleCirculateDate).toLocaleString() : null,
        sampleDate: vm.sample.sampleDate ? new Date(vm.sample.sampleDate).toLocaleString() : null,
        receiveDate: vm.sample.receiveDate ? new Date(vm.sample.receiveDate).toLocaleString() : null,
        arrangeFinishDate: vm.sample.arrangeFinishDate ? new Date(vm.sample.arrangeFinishDate).toLocaleString() : null,
        finishDate: vm.sample.finishDate ? new Date(vm.sample.finishDate).toLocaleString() : null
    });
    SampleService.createSample(data).then(function (response) {
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
