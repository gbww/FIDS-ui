'use strict';

angular.module('com.app').controller('CheckItemListCtrl', function ($uibModal, CheckItemService, toastr, dialog) {
  var vm = this;

  vm.searchObject = {
    searchKeywords: ''
  }

  vm.refreshTable = function () {
    vm.searchObject.timestamp = new Date();
  }

  vm.loading = true;
  vm.checkItems = [];
  vm.getCheckItemList = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
    CheckItemService.getCheckItemList(tableState, vm.searchObject.searchKeywords).then(function (response) {
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
      toastr.error(err.data.message);
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
      templateUrl: 'controllers/business/checkItem/list/add-checkitem/addCheckitem.html',
      controller: 'BusinessAddCheckItemCtrl as vm'
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
      templateUrl: 'controllers/business/checkItem/list/edit-checkitem/editCheckitem.html',
      controller: 'BusinessEditCheckItemCtrl as vm',
      resolve: {
        checkItem: function () {return item;}
      }
    });

    modalInstance.result.then(function (res) {
      vm.refreshTable();
      toastr.success('检测项修改成功！');
    });
  }

  vm.deleteCheckItem = function (checkItem, idx) {
    var result = dialog.confirm('确认删除检测项 ' + checkItem.name + ' ?');
    result.then(function (res) {
      if (res) {
        CheckItemService.deleteCheckItem(checkItem.id).then(function (response) {
          if (response.data.success) {
            vm.refreshTable();
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

});
