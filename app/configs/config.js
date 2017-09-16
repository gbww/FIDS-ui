'use strict';

// 这里只能注入constant和各种Provider。本阶段主要用于通过Provider对各种服务进行配置。
angular.module('com.app').config(function($httpProvider, stConfig) {
  // 禁止IE请求从缓存拿数据
  $httpProvider.defaults.headers.get = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }

  // smart-table
  stConfig.pagination.itemsByPage = 10;
  stConfig.sort.skipNatural = true;

  $httpProvider.interceptors.push(['$rootScope', '$cookies', '$q', 'HttpPendingRequestsService', function($rootScope, $cookies, $q, HttpPendingRequestsService){
  	return {
  		// 给请求头加上timeout属性，用以取消request
  		request: function (config) {
  			config = config || {};

        if (config.timeout === undefined && !config.noCancelOnRouteChange) {
          config.timeout = HttpPendingRequestsService.newTimeout();
        }

        if($cookies.get('token')){
          config.headers['Authorization'] = 'bearer ' + $cookies.get('token');
        }
  			return config;
  		},

	    responseError: function (response) {
        // 如果是被取消导致
        if(response.config && response.config.timeout && response.config.timeout.isGloballyCancelled){
          $rootScope.loading = false;
          return $q.defer().promise;
        }

	      // 如果服务器返回了401 unauthorized，那么就表示需要登录
	      if(response.status == 401){
          if (response.config.url.indexOf('login') !== -1) {
            return $q.reject(response);
          }

          // 如果修改密码返回401(说明输入原始密码错误)，不返回登录页
          if((/\w+\/password$/).test(response.config.url)){
            return $q.reject(response);
          }

		      $rootScope.$broadcast('responseError', '401', response.data);
          return $q.defer().promise;
	      }

	      return $q.reject(response);
	    }
  	};
  }]);

});
