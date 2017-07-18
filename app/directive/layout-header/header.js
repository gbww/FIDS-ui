'use strict';

angular.module('com.app').controller('LayoutHeaderController', function($state, $cookies) {
  var vm = this;
  vm.currentUser = $cookies.get('username') || 'anno';

  vm.logout = function () {
    $cookies.remove('token');
    $cookies.remove('username');
    $state.go("login");
  };


});
