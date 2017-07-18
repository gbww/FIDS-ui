'use strict';

angular.module('com.app').controller('AppLayoutController', function AppLayoutController($rootScope, $scope, $state, $cookies, HttpPendingRequestsService, dialog) {
  var vm = this;

  $scope.$on('responseError', function (event, type, data) {
    $rootScope.loading = false;
    if (type === '401') {
      $state.go('login');
      return;
    }

  });


  // 跳转时，取消之前所有penging请求
  // $scope.$on('$stateChangeStart', function(){
  //   HttpPendingRequestsService.cancelAll();
  // });


  // 未登录
  $scope.$on('$stateChangeSuccess', function(event, toState){
    if (toState.name == 'welcome') return;
    if(!$cookies.get('token')){
      $state.go('login');
    }
 });

});
