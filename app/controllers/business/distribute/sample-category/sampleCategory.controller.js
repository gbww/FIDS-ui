'use strict';

angular.module('com.app').controller('CheckItemDistributeSampleCtrl', function ($rootScope, $timeout, $uibModal, CiDistributeService, SampleService, toastr) {
  var vm = this;

  vm.searchObject = {}

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    } else if (flag == 'toggle') {
      vm.searchObject.toggle = true;
    }
  }

  vm.searchConditions = {
    reportId: null,
    sampleName: null,
    entrustedUnit: null,
    inspectedUnit: null,
    productionUnit: null,
    receiveSampleId: null,
    executeStandard: null
  };
  vm.reportIdArr = [], vm.sampleNameArr = [], vm.entrustedUnitArr = [], vm.inspectedUnitArr = [],
  vm.productionUnitArr = [], vm.sampleIdArr = [], vm.exeStandardArr =[];

  vm.status = 5;
  vm.samples = [];
  vm.loading = true;
  vm.ciLoading = true;
  vm.getSampleList = function (tableState) {

    var orderBy = tableState.sort.predicate;
    var reverse = tableState.sort.reverse ? 'desc' : 'asc';
    if (orderBy == 'reportId') {
      orderBy = 'report_id';
    } else if (orderBy == 'createdAt') {
      orderBy = 'created_at';
    }

    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
      "order": orderBy ? [orderBy, reverse].join(' ') : null
    }
  	CiDistributeService.getUndistributeSamples(tableParams, vm.searchObject).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.samples = response.data.entity.list;
        vm.total = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;

        if (vm.samples.length > 0) {
          vm.selectedSample = vm.samples[0];
          vm.getSampleCi();
        } else {
          vm.ciLoading = false;
          vm.checkItems = [];
        }
        angular.forEach(vm.samples, function (item) {
          if (vm.reportIdArr.indexOf(item.reportId) == -1) {
            vm.reportIdArr.push(item.reportId);
          }
          if (vm.sampleIdArr.indexOf(item.receiveSampleId) == -1) {
            vm.sampleIdArr.push(item.receiveSampleId);
          }
          if (item.sampleName && vm.sampleNameArr.indexOf(item.sampleName) == -1) {
            vm.sampleNameArr.push(item.sampleName);
          }
          if (item.entrustedUnit && vm.entrustedUnitArr.indexOf(item.entrustedUnit) == -1) {
            vm.entrustedUnitArr.push(item.entrustedUnit);
          }
          if (item.inspectedUnit && vm.inspectedUnitArr.indexOf(item.inspectedUnit) == -1) {
            vm.inspectedUnitArr.push(item.inspectedUnit);
          }
          if (item.productionUnit && vm.productionUnitArr.indexOf(item.productionUnit) == -1) {
            vm.productionUnitArr.push(item.productionUnit);
          }
          if (item.executeStandard && vm.exeStandardArr.indexOf(item.executeStandard) == -1) {
            vm.exeStandardArr.push(item.executeStandard);
          }
        })
      } else {
        vm.total = 0;
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
  		vm.loading = false;
      toastr.error(err.data);
  	})
  }

  vm.back = function () {
    vm.advance = false;
    angular.merge(vm.searchConditions, {
      sampleName: null,
      entrustedUnit: null,
      inspectedUnit: null,
      productionUnit: null,
      receiveSampleId: null,
      executeStandard: null
    });
  }

  vm.reset = function () {
    angular.merge(vm.searchConditions, {
      reportId: null,
      sampleName: null,
      entrustedUnit: null,
      inspectedUnit: null,
      productionUnit: null,
      receiveSampleId: null,
      executeStandard: null
    });

  }

  vm.search=function(){
    vm.searchObject = angular.copy(vm.searchConditions);
  }

  vm.eventSearch=function(e){
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
      vm.search();
    }
  }

  vm.selectSample = function (sample) {
    if (angular.equals(vm.selectedSample, sample)) {
      return;
    }
    vm.selectedSample = sample;
    vm.getSampleCi();
  }


  vm.checkItems = [];
  vm.getSampleCi = function () {
    vm.ciLoading = true;
    vm.finishCount = 0;
    SampleService.getSampleCiList(vm.selectedSample.reportId).then(function (response) {
      vm.ciLoading = false;
      if (response.data.success) {
        angular.forEach(response.data.entity, function (item) {
          if (item.status === 2) {
            vm.finishCount += 1;
          }
        })
        vm.checkItems = response.data.entity;
      } else {
        toastr.error(response.data.message);
      }
    })
  }

  vm.distribute = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/distribute/act/act.html',
      controller: 'CiDistributeActionCtrl as vm',
      resolve: {
        reportId: function () {return vm.selectedSample.reportId;},
        checkItems: function () {return [item];},
        departments: ['$q', 'PrivilegeService', function ($q, PrivilegeService) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          PrivilegeService.getOrganizationList().then(function (response) {
            if (response.data.success) {
              deferred.resolve(response.data.entity);
            } else {
              deferred.reject();
              toastr.error(response.data.message);
            }
          }).catch(function (err) {
            deferred.reject();
            toastr.error(err.data);
          });
          return deferred.promise;
        }]
      }
    });

    modalInstance.result.then(function (res) {
      $timeout(function () {
        toastr.success('检测项分配成功！');
        vm.getSampleCi();
      }, 500)
    });
  }

  vm.batchDistribute = function () {
    if (vm.selectedItems.length === 0) {
      toastr.warning('请选择检测项！');
      return;
    }

    var testRoom = '', testUser = '';
    for (var i=0,len=vm.selectedItems.length; i<len; i++) {
      // if (i == 0) {
      //   testRoom = vm.selectedItems[i].testRoom;
      //   testUser = vm.selectedItems[i].testUser;
      // } else if (testRoom !== vm.selectedItems[i].testRoom || testUser !== vm.selectedItems[i].testUser) {
      //   toastr.error('请确认所选检测项分配的检测室检测人员为同一人！');
      //   return;
      // }
    }

    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/distribute/act/act.html',
      controller: 'CiDistributeActionCtrl as vm',
      resolve: {
        reportId: function () {return vm.selectedSample.reportId;},
        checkItems: function () {return angular.copy(vm.selectedItems);},
        departments: ['$q', 'PrivilegeService', function ($q, PrivilegeService) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          PrivilegeService.getOrganizationList().then(function (response) {
            if (response.data.success) {
              deferred.resolve(response.data.entity);
            } else {
              deferred.reject();
              toastr.error(response.data.message);
            }
          }).catch(function (err) {
            deferred.reject();
            toastr.error(err.data);
          });
          return deferred.promise;
        }]
      }
    });

    modalInstance.result.then(function () {
      vm.itemSelected = [], vm.selectedItems = [], vm.allSelected = false;
      toastr.success('检测项分配成功！');
      vm.getSampleCi();
    });
  }

  // 单选、复选
  vm.itemSelected = [];
  vm.selectedItems = [];
  vm.selectAll = function () {
    if (vm.allSelected){
      vm.selectedItems = [];
      angular.forEach(vm.checkItems, function (item, idx) {
        if (item.status !== 2) {
          vm.selectedItems.push(item);
          vm.itemSelected[idx] = true;
        }
      });
    } else {
      vm.selectedItems = [];
      angular.forEach(vm.checkItems, function (item, idx) {
        vm.itemSelected[idx] = false;
      });
    }
  }

  vm.selectItem = function (event, idx, item) {
    if(event.target.checked){
      vm.selectedItems.push(item);
      vm.itemSelected[idx] = true;
      if(vm.selectedItems.length == vm.checkItems.length - vm.finishCount){
        vm.allSelected = true;
      }
    } else {
      for (var i=0,len=vm.selectedItems.length; i<len; i++){
        if (item.name == vm.selectedItems[i].name) {
          vm.selectedItems.splice(i, 1);
          break;
        }
      };
      vm.itemSelected[idx] = false;
      vm.allSelected = false;
    }
  }
});
