'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.when('', '/dashboard');
  $urlRouterProvider.when('/', '/dashboard');
  $urlRouterProvider.otherwise('/notFound');

  // 所有模块的入口路由，login和welcome页面除外
  $stateProvider.state('app', {
    template: '<layout-menu></layout-menu><div class="main-wrapper"><layout-header></layout-header><div class="main" ui-view></div></div>',
    resolve: {
      data: ['$q', '$cookies', function ($q, $cookies) {
        var deferred = $q.defer();
        deferred.resolve('');
        return deferred.promise;
      }]
    }
  });

});
