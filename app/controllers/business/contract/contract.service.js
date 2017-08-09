'use strict';

angular.module('com.app').factory('ContractService', function ($http) {
	return {
		getContractList: function () {
			return $http.get('/mock/data.json');
		},

		getContractInfo: function () {
			return $http.get('/mock/data.json');
		}
	}
})
