'use strict';

angular.module('com.app').controller('CiResultListCtrl', function ($stateParams, $uibModal, CiResultRecordService, toastr) {
  var vm = this;

  vm.query = {
    reportId: $stateParams.reportId || null,
    receiveSampleId: $stateParams.receiveSampleId || null
  };
  vm.searchObject = {};

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag === 'toggle') {
      vm.searchObject.toggle = true;
    }
  };

  vm.status = parseInt($stateParams.status) ||1;
  vm.checkItems = [];
  vm.loading = true;
  vm.getCheckItemList = function (tableState) {
    var orderBy = tableState.sort.predicate;
    var reverse = tableState.sort.reverse ? 'desc' : 'asc';
    if (orderBy === 'reportId') {
      orderBy = 'report_id';
    } else if (orderBy === 'receiveSampleId') {
      orderBy = 'receive_sample_id';
    } else if (orderBy === 'testRoom') {
      orderBy = 'test_room';
    } else if (orderBy === 'testUser') {
      orderBy = 'test_user';
    } else if (orderBy === 'updatedAt') {
      orderBy = 'updated_at';
    }

    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
      "order": orderBy ? [orderBy, reverse].join(' ') : null
    }

  	CiResultRecordService.getUserCi(tableParams, vm.status, vm.query).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.checkItems = response.data.entity.list;
        vm.total = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;
        if (tableState.pagination.start > vm.total) {
          tableState.pagination.start = 0;
        }
      } else {
        vm.total = 0;
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
  		vm.loading = false;
      toastr.error(err.data);
  	})
  }

  vm.searchStatus = function (filter) {
    if (vm.status != filter) {
      vm.status = filter;
      vm.refreshTable('toggle');
    }
  }

  vm.search=function(){
    vm.refreshTable();
  }
  vm.eventSearch=function(e){
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
      vm.refreshTable();
    }
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
        departments: ['$rootScope', '$q', 'PrivilegeService', function ($rootScope, $q, PrivilegeService) {
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

  vm.recordResult = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/ci-result-record/edit/edit.html',
      controller: 'RecordCiResultCtrl as vm',
      resolve: {
        checkItems: function () {return [item];},
        units: ['$rootScope', '$q', 'UnitService', function ($rootScope, $q, UnitService) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          UnitService.getUnitList().then(function (response) {
            $rootScope.loading = false;
            if (response.data.success) {
              var res = [];
              angular.forEach(response.data.entity, function (item) {
                res.push(item.unitName);
              })
              deferred.resolve(res);
            } else {
              deferred.resolve([]);
            }
          }).catch(function () {
            $rootScope.loading = false;
            deferred.resolve([]);
          });
          return deferred.promise;
        }],
      }
    });

    modalInstance.result.then(function () {
      toastr.success('检测项结果录入成功！');
      vm.refreshTable();
    });
  }

  vm.batch = function () {
    if (vm.selectedItems.length === 0) {
      toastr.warning('请选择检测项！');
      return;
    }

    var val = '';
    for (var i=0,len=vm.selectedItems.length; i<len; i++) {
      if (i == 0) {
        val = vm.selectedItems[i].standardValue;
      } else if (val !== vm.selectedItems[i].standardValue) {
        toastr.error('请确认所选检测项标准值相同或相等！');
        return;
      }
    }

    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/ci-result-record/edit/edit.html',
      controller: 'RecordCiResultCtrl as vm',
      resolve: {
        checkItems: function () {return angular.copy(vm.selectedItems);}
      }
    });

    modalInstance.result.then(function () {
      vm.itemSelected = [], vm.selectedItems = [], vm.allSelected = false;
      toastr.success('检测项结果录入成功！');
      vm.refreshTable();
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
