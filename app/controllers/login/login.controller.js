'use strict';

angular.module('com.app').controller('LoginController', function LoginController($rootScope, $state, $cookies, LoginService) {
  var vm = this;
  $rootScope.loading = false;
  $cookies.remove("token");
  $cookies.remove('username');

  vm.user={
    username:'',
    password:''
  }
  vm.user.username = $cookies.get("preservedUsername");
  vm.user.password = $cookies.get("preservedPassword");
  if(vm.user.username && vm.user.username != ""){
    vm.isPreserved = true;
  }else{
    vm.isPreserved = false;
  }

  vm.submitted = false;
  vm.logining=false;
  vm.login = function () {
    if(!vm.user.username || !vm.user.password){
      return;
    }
    vm.submitted = true;
    vm.logining = true;

    if(vm.isPreserved){
      $cookies.put("preservedUsername", vm.user.username);
      $cookies.put("preservedPassword", vm.user.password);
    }else{
      $cookies.remove("preservedUsername");
      $cookies.remove("preservedPassword");
    }

    vm.logining=true;
    LoginService.login(vm.user).then(function (response) {
      if (response.data.success) {
        var data = response.data.entity;
        $cookies.put("token", data.access_token);
        $cookies.put('username',vm.user.username);

        $state.go("app.dashboard");
      } else {
        vm.logining=false;
        vm.error=true;
      }
    }).catch(function (response) {
      vm.logining=false;
      vm.error=true;
    })
  }
});
