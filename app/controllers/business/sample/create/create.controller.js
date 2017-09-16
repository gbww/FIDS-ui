'use strict';

angular.module('com.app').controller('SampleCreateCtrl', function ($state, $uibModal, api, toastr, SampleService) {
  var vm = this;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.sample.root, businessBC.sample.create];

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
    drawUser: null,
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

  vm.ok = function () {
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
        toastr.error(err.data.message);
    });
  }
});
