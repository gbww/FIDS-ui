'use strict';

angular.module('com.app').controller('BusinessInspectionCtrl', function ($scope, $state, $uibModal, api, InspectionService) {
  var vm = this;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.inspection.root];

  vm.getInspectionItems = function () {
  	vm.loading = true;
  	InspectionService.getInspectionItems().then(function (response) {
  		vm.loading = false;
  		vm.inspections = response.data.inspections;
  	})
  }
  vm.getInspectionItems();

  vm.distribute = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/inspection/distribute/distribute.html',
      controller: 'DistributeEmployeeCtrl as vm',
    });

    modalInstance.result.then(function () {

    });
  }

  vm.record = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/inspection/record/record.html',
      controller: 'RecordInspectionCtrl as vm',
    });

    modalInstance.result.then(function () {

    });
  }

  // 单选、复选
  vm.itemChecked = [];
  vm.checkedItems = [];
  vm.checkAll = function () {
    if (vm.allChecked){
      vm.checkedItems = [];
      angular.forEach(vm.inspections, function (inspection, idx) {
        vm.checkedItems.push(inspection);
        vm.itemChecked[idx] = true;
      });
    } else {
      vm.checkedItems = [];
      angular.forEach(vm.inspections, function (inspection, idx) {
        vm.itemChecked[idx] = false;
      });
    }
  }

  vm.checkItem = function (event, idx, inspection) {
    if(event.target.checked){
      vm.checkedItems.push(inspection);
      vm.itemChecked[idx] = true;
      if(vm.checkedItems.length == vm.inspections.length){
        vm.allChecked = true;
      }
    } else {
      for (var i=0,len=vm.checkedItems.length; i<len; i++){
        if (inspection.name == vm.checkedItems[i].name) {
          vm.checkedItems.splice(i, 1);
          break;
        }
      };
      vm.itemChecked[idx] = false;
      vm.allChecked = false;
    }
  }

});
