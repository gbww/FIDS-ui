
'use strict';

angular.module('com.app').controller('PrivilegeUserCategoryCtrl', function ($rootScope, $uibModal, toastr, PrivilegeService, dialog) {
  var vm = this;

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
  vm.getUserType = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
    PrivilegeService.getUserType(tableParams, vm.query).then(function (response) {
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

  vm.create = function () {
  	var modalInstance = $uibModal.open({
  		animation: true,
  		size: 'lg',
  		backdrop: 'static',
  		templateUrl: 'controllers/privilege/user/category/create/create.html',
  		controller: 'PrivilegeUserTypeCreateCtrl as vm'
  	});

  	modalInstance.result.then(function () {
      vm.refreshTable();
		  toastr.success("用户创建成功！");
  	})
  }

  vm.edit = function (user) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/privilege/user/category/edit/edit.html',
      controller: 'PrivilegeUserTypeEditCtrl as vm',
      resolve: {
        user: function () { return user; }
      }
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("用户类型修改成功！");
    })
  }


  vm.delete = function (user) {
    var result = dialog.confirm('确认删除用户 "' + user.name + '" 的类型?');
    result.then(function (res) {
      if (res) {
        PrivilegeService.deleteUserType([user.id]).then(function (response) {
          if (response.data.success) {
            vm.refreshTable('delete');
            toastr.success('用户删除成功！');
          } else {
            toastr.error(response.data.message);
          }
        }).catch(function (error) {
          toastr.error(error.data.message)
        });
      }
    })
  }
})