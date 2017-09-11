'use strict';

angular.module('com.app').factory('DashboardService', function ($http) {
	return {
		getJudgeContractList: function () {
			return $http.get('/mock/data/contract_to_judge.json');
		},

		getContractInfo: function () {
			return $http.get('/mock/data/contract.json');
		}
	}
})
