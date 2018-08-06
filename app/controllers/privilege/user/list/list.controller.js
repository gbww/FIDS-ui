'use strict';

angular.module('com.app').controller('PrivilegeUserListCtrl', function ($rootScope, $uibModal, toastr, PrivilegeService, dialog) {
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

  vm.create = function () {
  	var modalInstance = $uibModal.open({
  		animation: true,
  		size: 'md',
  		backdrop: 'static',
  		templateUrl: 'controllers/privilege/user/list/create/create.html',
  		controller: 'PrivilegeUserCreateCtrl as vm',
      resolve: {
        organizations: ['$q', function ($q) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          PrivilegeService.getOrganizationList().then(function (response) {
            if (response.data.success) {
              deferred.resolve(response.data.entity);
            } else {
              $rootScope.loading = false;
              deferred.reject()
            }
          });
          return deferred.promise;
        }],
        roles: ['$q', function ($q) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          PrivilegeService.getRoleList().then(function (response) {
            if (response.data.success) {
              deferred.resolve(response.data.entity);
            } else {
              $rootScope.loading = false;
              deferred.reject()
            }
          })
          return deferred.promise;
        }]
      }
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
      templateUrl: 'controllers/privilege/user/list/edit/edit.html',
      controller: 'PrivilegeUserEditCtrl as vm',
      resolve: {
        user: function () { return user; }
      }
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("用户信息修改成功！");
    })
  }

  vm.assignRole = function (user) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/privilege/user/list/assign-role/assignRole.html',
      controller: 'PrivilegeUserAssignRoleCtrl as vm',
      resolve: {
        roles: ['$q', function ($q) {
          var deferred = $q.defer();
          PrivilegeService.getRoleList().then(function (response) {
            if (response.data.success) {
              deferred.resolve(response.data.entity);
            } else {
              deferred.reject()
            }
          }).catch(function () {
            deferred.reject()
          })
          return deferred.promise;
        }],
        user: function () { return user; }
      }
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("用户角色更改成功！");
    })
  }

  vm.delete = function (user) {
    var result = dialog.confirm('确认删除用户 ' + user.username + ' ?');
    result.then(function (res) {
      if (res) {
        PrivilegeService.deleteUser(user.organization.id, user.id).then(function (response) {
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
