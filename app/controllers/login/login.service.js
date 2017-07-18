'use strict';

angular.module('com.app').factory('LoginService', function LoginService($http, $cookies) {
	return{
    login: function(user){
      return $http({
        method: 'POST',
        url: '/apis/cmss.com/v1/login',
        data:{
          username:user.username,
          password:user.password
        }
      });
    },


    editPassword: function(user){
      return $http({
        method: 'PUT',
        url: '/apis/cmss.com/v1/user/'+user.username+'/password',
        data: {
          username:user.username,
          oldpassword:user.oldpassword,
          newpassword:user.newpassword
        }
      });
    }
	}
});
