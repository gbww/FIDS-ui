'use strict';

angular.module('com.app').controller('DBCheckItemListCtrl', function ($uibModal, api, CheckItemService, toastr, Upload, dialog) {
  var vm = this;

  var checkItemBC = api.breadCrumbMap.checkItem;
  vm.breadCrumbArr = [checkItemBC.root, checkItemBC.list];

  vm.searchObject = {
    searchKeywords: ''
  }

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    }
  }

  vm.checkItems = [];
  vm.getCheckItemList = function (tableState) {
    vm.loading = true;
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
    CheckItemService.getCheckItemList(tableParams, vm.searchObject.searchKeywords).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.checkItems = response.data.entity.list;
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
    vm.searchObject.searchKeywords = vm.query;
  }
  vm.eventSearch=function(e){
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
      vm.searchObject.searchKeywords = vm.query;
    }
  }

  vm.addCheckItem = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/checkItem/list/add-checkitem/addCheckitem.html',
      controller: 'DBAddCheckItemCtrl as vm'
    });

    modalInstance.result.then(function (res) {
      vm.refreshTable();
      toastr.success('检测项添加成功！');
    });
  }

  vm.editCheckItem = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/checkItem/list/edit-checkitem/editCheckitem.html',
      controller: 'DBEditCheckItemCtrl as vm',
      resolve: {
        checkItem: function () {return item;}
      }
    });

    modalInstance.result.then(function (res) {
      vm.refreshTable();
      toastr.success('检测项修改成功！');
    });
  }

  vm.deleteCheckItem = function (checkItem) {
    var result = dialog.confirm('确认删除检测项 ' + checkItem.name + ' ?');
    result.then(function (res) {
      if (res) {
        CheckItemService.deleteCheckItem(checkItem.id).then(function (response) {
          if (response.data.success) {
            vm.refreshTable('delete');
            toastr.success('检测项删除成功！');
          } else {
            toastr.error(response.data.message);
          }
        }).catch(function (error) {
          toastr.error(error.data.message)
        });
      }
    })
  }

  vm.importFile = function (event) {
    var file = event.target.files[0];
    if (!/\.xlsx?$/.test(file.name)) {
      toastr.error('请选择excel文件！');
      return;
    }
    Upload.upload({
      url: '/api/v1/ahgz/checkitemscatalog/import',
      data: {
        file: event.target.files[0]
      }
    }).then(function (response) {
      if (response.data.success) {
        toastr.success('导入成功！');
        vm.refreshTable();
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      toastr.error(err.data);
    });
  }

});
