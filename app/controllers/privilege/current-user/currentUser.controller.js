'use strict';

angular.module('com.app').controller('PrivilegeCurrentUserCtrl', function ($rootScope, $uibModal, $timeout, api, toastr, PrivilegeService, Upload, dialog) {
  var vm = this;

  var privilegeBC = api.breadCrumbMap.privilege;
  vm.breadCrumbArr = [privilegeBC.root, privilegeBC.currentUser.root];

  vm.user = null;
  vm.getUserInfo = function () {
    $rootScope.loading = true;
  	PrivilegeService.getCurrentUserInfo().then(function (response) {
  		if (response.data.success) {
  			vm.user = response.data.entity;
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).then(function () {
      return PrivilegeService.downloadUserSign(vm.user.id)
  	}).then(function (response) {
      $rootScope.loading = false;
  		vm.user.hasSign = response.data !== null;
      if (vm.user.hasSign) {
        vm.userSignImage = "data:image/png;base64," + response.data;
      }
  	}).catch(function (err) {
      $rootScope.loading = false;
  		toastr.error(err.data);
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
    $timeout(function() {
      if (!/^image\/.*$/.test(vm.image.type)) {
        toastr.error('请上传图片！');
        return;
      }
      if (vm.image.size / 1024 / 1024 >= 4) {
        toastr.error('图片过大，请上传4MB以内的图片');
        return;
      }
    	Upload.upload({
        url: '/api/v1/user/sign/upload',
        data: {
          file: vm.image
        }
      }).then(function(response){
        if (response.data.success) {
          vm.getUserInfo();
          toastr.success('电子签名上传成功！');
        } else {
          toastr.error(response.data.message);
        }
      }).catch(function (err) {
        toastr.error(err.data);
      });
    }, 100)
  }

  vm.download = function () {
  	PrivilegeService.downloadUserSign(vm.user.id).then(function (response) {
      vm.userSignImage = "data:image/png;base64," + response.data;
  	});
  }

});
