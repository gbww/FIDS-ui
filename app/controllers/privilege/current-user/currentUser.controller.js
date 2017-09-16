'use strict';

angular.module('com.app').controller('PrivilegeCurrentUserCtrl', function ($uibModal, api, toastr, PrivilegeService, Upload, dialog) {
  var vm = this;

  var privilegeBC = api.breadCrumbMap.privilege;
  vm.breadCrumbArr = [privilegeBC.root, privilegeBC.currentUser.root];

  vm.user = null;
  vm.getUserInfo = function () {
  	PrivilegeService.getCurrentUserInfo().then(function (response) {
  		if (response.data.success) {
  			vm.user = response.data.entity;
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).then(function () {
  		return PrivilegeService.getUserSign(vm.user.id);
  	}).then(function (response) {
  		vm.user.sign = response.data.entity;
  	}).catch(function (err) {
  		toastr.error(err.data.message);
  	});
  }

  vm.getUserInfo();

  vm.edit = function (user) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/privilege/user/edit/edit.html',
      controller: 'PrivilegeUserEditCtrl as vm',
      resolve: {
        user: function () { return vm.user; }
      }
    });

    modalInstance.result.then(function () {
    	vm.getUserInfo();
      toastr.success("用户信息修改成功！");
    })
  }

  vm.editPassword = function(){
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'controllers/privilege/current-user/edit-password/editPassword.html',
      controller: 'EditPasswordController',
      controllerAs: 'vm',
      backdrop: 'static',
      size: 'md'
    });

    modalInstance.result.then(function () {
    	toastr.success('密码修改成功！');
    })
  }

  vm.upload = function () {
  	Upload.upload({
      url: '/api/user/sign/upload',
      data: {
        image: vm.image
      }
    }).then(function(){
    });
  }

  vm.download = function () {
  	PrivilegeService.downloadUserSign(vm.user.id).then(function (response) {

  	});
  }

});
