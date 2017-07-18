'use strict';

angular.module('com.app').factory('tokenService', function tokenService($cookies){
	return{
  		request: function(config){
  			if($cookies.getObject('token')){
  				//config.headers['X-Auth-token'] = $cookies.getObject('token').id;
  			}
  			return config;
  		}
	}
}).factory('HttpPendingRequestsService', function($q){
	var cancelPromises = [];
	return{
		newTimeout: function(){
			var cancelPromise = $q.defer();
			cancelPromises.push(cancelPromise);
			return cancelPromise.promise;
		},

		cancelAll: function(){
			angular.forEach(cancelPromises, function(cancelPromise){
				cancelPromise.promise.isGloballyCancelled = true;
				cancelPromise.resolve();
			});
			cancelPromises.length = 0;
		}
	}
});;
