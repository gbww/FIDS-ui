'use strict';

angular.module('com.app').controller('SelectContractCtrl', function ($scope, $uibModalInstance, ContractService, toastr) {
  var vm = this;

	vm.searchObject = {}

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'reset') {
      vm.searchObject.reset = true;
    }
  }

  vm.loading = true;
  vm.contracts = [];
  vm.getContractList = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
  	ContractService.getContractList(tableParams, vm.query).then(function (response) {
      vm.loading = false;
      var tempContracts = [];
  		if (response.data.success) {
        angular.forEach(response.data.entity.list, function (item) {
          tempContracts.push(item.contract);
        });

        vm.contracts = tempContracts;
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
    vm.refreshTable('reset')
  }
  vm.eventSearch=function(e){
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
      vm.search()
    }
  }

  vm.ok = function (id) {
  	$uibModalInstance.close(id);
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
