'use strict';

angular.module('com.app').factory('DashboardService', function ($http) {
	return {
		getAllCi: function (startTime, endTime) {
			return $http({
				url: '/api/v1/ahgz/receive/sample/items/countByDepartment',
				method: 'GET',
				params: {
					startTime: startTime,
					endTime: endTime
				}
			});
		},

		getContractInfo: function () {
			return $http.get('/mock/data/contract.json');
		}
	}
})
