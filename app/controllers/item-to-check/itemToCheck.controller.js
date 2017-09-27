'use strict';

angular.module('com.app').controller('ItemToCheckCtrl', function ($uibModal, api, SampleService, toastr) {
  var vm = this;

  vm.breadCrumbArr = [api.breadCrumbMap.itemToCheck.root];

  vm.searchObject = {
    searchKeywords: ''
  }

  vm.refreshTable = function () {
    vm.searchObject.timestamp = new Date();
  }

  vm.status = '1';
  vm.checkItems = [];
  vm.loading = true;
  vm.getCheckItemList = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
  	SampleService.getUserCi(tableParams, parseInt(vm.status)).then(function (response) {
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

  vm.searchStatus = function (filter) {
    if (vm.status != filter) {
      vm.status = filter;
      vm.refreshTable();
    }
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

  vm.recordResult = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/item-to-check/edit/edit.html',
      controller: 'RecordCiResultCtrl as vm',
      resolve: {
        checkItem: function () {return item;}
      }
    });

    modalInstance.result.then(function () {
      toastr.success('检测项结果录入成功！');
      vm.refreshTable();
    });
  }

});
