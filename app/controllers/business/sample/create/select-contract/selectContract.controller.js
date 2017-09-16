'use strict';

angular.module('com.app').controller('SelectContractCtrl', function ($scope, $uibModalInstance, ContractService, toastr) {
  var vm = this;

	vm.searchObject = {
    searchKeywords: ''
  }

  vm.refreshTable = function () {
    vm.searchObject.timestamp = new Date();
  }

  vm.loading = true;
  vm.contracts = [];
  vm.getContractList = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
  	ContractService.getContractList(tableParams, vm.searchObject.searchKeywords).then(function (response) {
  		vm.loading = false;
  		if (response.data.success) {
        vm.contracts = response.data.entity.list;
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

  vm.ok = function (id) {
  	$uibModalInstance.close(id);
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
