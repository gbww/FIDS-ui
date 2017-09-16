'use strict';

angular.module('com.app').config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.when('', '/login');
  $urlRouterProvider.when('/', '/dashboard');
  $urlRouterProvider.otherwise('/notFound');

  // 所有模块的入口路由，login和welcome页面除外
  $stateProvider.state('app', {
    template: '<layout-menu></layout-menu><div class="main-wrapper"><layout-header></layout-header><div class="main" ui-view></div></div>',
    resolve: {
      // 当前登录用户信息
      userInfo: ['$state', '$q', 'PrivilegeService', 'api', function ($state, $q, PrivilegeService, api) {
        var deferred = $q.defer();
        PrivilegeService.getCurrentUserInfo().success(function (response) {
          if (response.success) {
            var userObject = {
              "id": response.entity.id,
              "username": response.entity.username,
              "organization": {
                "id": response.entity.organizationId,
                "name": response.entity.organization.name,
                "type": response.entity.organization.type
              },
              "role": {
                "roleIdentity": response.entity.role.roleIdentity
              }
            };
            api.userInfo = userObject;
            deferred.resolve(response.entity);
          } else {
            api.userInfo = {};
            deferred.resolve([]);
          }
        }).error(function (error) {
          $state.go('login');
          deferred.reject();
        });
        return deferred.promise;
      }],
      // 登录用户所拥有的权限项
      permissionArr: ['$state', '$q', '$cookies', 'PrivilegeService', 'api', function ($state, $q, $cookies, PrivilegeService, api) {
        var deferred = $q.defer();
        PrivilegeService.getUserPrivileges().then(function (response) {
          api.permissionArr = response.data.entity;
          deferred.resolve('');
        }).catch(function () {
          $state.go('login');
          api.permissionArr = [];
          deferred.reject();
        })
        return deferred.promise;
      }]
    }
  });

});
