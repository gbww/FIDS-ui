'use strict';

angular.module('com.app').controller('PrivilegeUserTypeCreateCtrl', function ($rootScope, $uibModalInstance, PrivilegeService, toastr) {
  var vm = this;
	$rootScope.loading = false;
	vm.step = 0;
	vm.userTypeArr = ['编制人', '审核人', '批准人'];
	vm.searchObject = {}

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    } else if (flag === 'reset') {
      vm.searchObject.reset = true
    }
  }

  vm.users = [];
  vm.loading = true;
  vm.getUserList = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
    PrivilegeService.getUserList(tableParams, vm.query).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.users = response.data.entity.list;
        vm.total = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;
      } else {
        vm.total = 0;
        toastr.error(response.data.message);
      }
    }).catch(function (error) {
      vm.loading = false;
      toastr.error(error.data.message);
    });
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

	vm.user = {};
  vm.ok = function () {
  	var data = {
  		userId: vm.selectedUser.id,
  		name: vm.selectedUser.name,
      type: vm.user.type
  	}
  	PrivilegeService.createUserType(data).then(function (response) {
  		if (response.data.success) {
		  	$uibModalInstance.close();
  		} else {
  			toastr.error(response.data.message);
  		}
  	})
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
	}
	
	vm.next = function () {
		vm.step = 1;
		$('.modal-dialog').removeClass('modal-lg').addClass('modal-md');
	}
	vm.preview = function () {
		vm.step = 0;
		$('.modal-dialog').removeClass('modal-md').addClass('modal-lg');
	}
});
