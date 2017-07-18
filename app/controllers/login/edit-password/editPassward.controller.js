'use strict';

angular.module('com.app').controller('EditPasswordController', function EditPasswordController( $q, $cookies, $state,dialog, LoginService,PrivilegeService) {
  var vm = this;
  vm.user={
    username:'',
    newpassword:'',
    oldpassword:''
  };
  vm.user.username = $cookies.get('username');
  vm.submitted = false;
  vm.submit = function(){
  	vm.submitted = true;
/*  	if(myForm.$invalid){
  		return;
  	}*/
    LoginService.editPassword(vm.user).then(function(){
      dialog.alert('密码修改成功！');
      $state.go('login');
    })
  }
});
