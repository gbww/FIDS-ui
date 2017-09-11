'use strict';

angular.module('com.app').factory('LoginService', function LoginService($http, $cookies) {
	return{
    login: function(user){
      return $http({
        method: 'POST',
        url: '/api/user/login',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'username=' + user.username + '&password=' + user.password
      });
    }
	}
});
