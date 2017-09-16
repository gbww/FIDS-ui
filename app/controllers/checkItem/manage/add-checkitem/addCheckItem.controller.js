'use strict';

angular.module('com.app').controller('CustomAddCatalogCiCtrl', function ($scope, $uibModalInstance, CheckItemService, toastr) {
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

  // 单选、复选
  vm.itemChecked = [];
  vm.checkedItems = [];
  vm.checkAll = function () {
    if (vm.allChecked){
      vm.checkedItems = [];
      angular.forEach(vm.checkItems, function (checkItem, idx) {
        vm.checkedItems.push(checkItem.id);
        vm.itemChecked[idx] = true;
      });
    } else {
      vm.checkedItems = [];
      angular.forEach(vm.checkItems, function (checkItem, idx) {
        vm.itemChecked[idx] = false;
      });
    }
  }

  vm.checkItem = function (event, idx, id) {
    if(event.target.checked){
      vm.checkedItems.push(id);
      vm.itemChecked[idx] = true;
      if(vm.checkedItems.length == vm.checkItems.length){
        vm.allChecked = true;
      }
    } else {
      for (var i=0,len=vm.checkedItems.length; i<len; i++){
        if (id == vm.checkedItems[i]) {
          vm.checkedItems.splice(i, 1);
          break;
        }
      };
      vm.itemChecked[idx] = false;
      vm.allChecked = false;
    }
  }

  vm.ok = function () {
  	$uibModalInstance.close(vm.checkedItems);
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
