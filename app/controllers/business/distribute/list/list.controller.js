'use strict';

angular.module('com.app').controller('CheckItemDistributeListCtrl', function ($rootScope, $uibModal, $timeout, toastr, CiDistributeService, PrivilegeService) {
  var vm = this;

  vm.searchObject = {}
  vm.searchConditions = {
    reportId: ''
  }

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'toggle') {
      vm.searchObject.toggle = true;
    }
  }

  vm.status = 0;
  vm.ciLoading = true;
  vm.getCiList = function (tableState) {
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
  	CiDistributeService.getUndistributeCi(tableParams, vm.searchObject, vm.status).then(function (response) {
      vm.ciLoading = false;
      if (response.data.success) {
        vm.checkItems = response.data.entity.list || [];
        vm.total = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;
      } else {
        vm.total = 0;
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
  		vm.loading = false;
      toastr.error(err.data);
  	})
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

  vm.searchStatus = function (filter) {
    if (vm.status != filter) {
      vm.status = filter;
      vm.refreshTable('toggle');
    }
  }

  vm.back = function () {
    vm.advance = false;
    angular.merge(vm.searchConditions, {
      reportId: null,
      name: null,
      method: null
    });
  }

  vm.search = function () {
    vm.searchObject = angular.copy(vm.searchConditions);
  }

  vm.reset = function () {
    angular.merge(vm.searchConditions, {
      reportId: null,
      name: null,
      method: null
    });
  }

  vm.distribute = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/distribute/act/act.html',
      controller: 'CiDistributeActionCtrl as vm',
      resolve: {
        sampleId: function () {return item.receiveSampleId;},
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
        vm.refreshTable();
      }, 500)
    });
  }

  vm.batchDistribute = function () {
    if (vm.selectedItems.length === 0) {
      toastr.warning('请选择检测项！');
      return;
    }

    var testRoom = '', testUser = '', sampleId = '';
    for (var i=0,len=vm.selectedItems.length; i<len; i++) {
      if (i == 0) {
        sampleId = vm.selectedItems[i].receiveSampleId;
        // testRoom = vm.selectedItems[i].testRoom;
        // testUser = vm.selectedItems[i].testUser;
      } else if (sampleId !== vm.selectedItems[i].receiveSampleId) {
        toastr.error('请确认所选检测项属于同一抽样单！');
        return;
      // } else if (testRoom !== vm.selectedItems[i].testRoom || testUser !== vm.selectedItems[i].testUser) {
      //   toastr.error('请确认所选检测项分配的检测室检测人员为同一人！');
      //   return;
      }
    }

    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/distribute/act/act.html',
      controller: 'CiDistributeActionCtrl as vm',
      resolve: {
        sampleId: function () {return sampleId;},
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
        vm.selectedItems.push(item);
        vm.itemSelected[idx] = true;
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
      if(vm.selectedItems.length == vm.checkItems.length){
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
