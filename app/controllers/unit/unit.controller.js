'use strict';

angular.module('com.app').controller('UnitCtrl', function ($uibModal, api, dialog, toastr, UnitService) {
  var vm = this;

  vm.breadCrumbArr = [api.breadCrumbMap.unit.root];

  vm.searchObject = {}

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    }
  }

  vm.units = [];
  vm.loading = true;
  vm.getUnitList = function (tableState) {
    var orderBy = tableState.sort.predicate;
    var reverse = tableState.sort.reverse ? 'desc' : 'asc';
    if (orderBy == 'unitName') {
      orderBy = 'unit_name'
    }
    var tableParams = {
      "order": orderBy ? [orderBy, reverse].join(' ') : null
    };

    UnitService.getUnitList(tableParams).then(function (response) {
    	vm.loading = false;
      if (response.data.success) {
        vm.units = response.data.entity;
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
  		vm.loading = false;
      toastr.error(err.data);
    });
  }


  vm.create = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/unit/create/create.html',
      controller: 'UnitCreateCtrl as vm'
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("单位创建成功！");
    })
  }

  vm.edit = function (unit) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/unit/edit/edit.html',
      controller: 'UnitEditCtrl as vm',
      resolve: {
        unit: function () { return angular.copy(unit); }
      }
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("单位信息修改成功！");
    })
  }

  vm.delete = function (unit) {
    var result = dialog.confirm('确认删除单位 ' + unit.unitName + ' ?');
    result.then(function (res) {
      if (res) {
        unitService.deleteUnit([unit.unitName]).then(function (response) {
          if (response.data.success) {
            vm.refreshTable('delete');
            toastr.success('单位删除成功！');
          } else {
            toastr.error(response.data.message);
          }
        }).catch(function (error) {
          toastr.error(error.data.message)
        });
      }
    })
  }

});
