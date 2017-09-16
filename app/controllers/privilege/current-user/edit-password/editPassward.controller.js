'use strict';

angular.module('com.app').controller('EditPasswordController', function ($uibModalInstance, api, toastr, PrivilegeService) {
  var vm = this;
  vm.user = api.userInfo;

  vm.submitted = false;
  vm.submit = function(myForm){
    vm.submitted = true;
    if(myForm.$invalid){
      return;
    }

    var data = {
      username: vm.user.username,
      oldPassword: vm.oldPassword,
      newPassword: vm.newPassword
    };

    PrivilegeService.editPassword(vm.user.organization.id, vm.user.id, data).then(function(response){
      $uibModalInstance.close();
    }).catch(function(e){
      if(e.status == 401){
        toastr.error("原始密码输入错误或会话已过期！");
      }else{
        dialog.alert('修改密码失败！');
      }
    });
  }

  vm.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  }
});
