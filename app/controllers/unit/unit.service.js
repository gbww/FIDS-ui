'use strict';

angular.module('com.app').factory('UnitService', function ($http) {
	var baseUrl = '/api/v1/ahgz/gzunit';
	return {
		getUnitList: function (tableParams) {
			return $http({
				url: baseUrl + '/select',
				method: 'GET',
				params: {
          order: tableParams.order
				}
			})
		},

		addUnit: function (data) {
			return $http({
				url: baseUrl + '/add',
				method: 'POST',
				data: data
			})
		},

		updateUnit: function (data) {
			return $http({
				url: baseUrl + '/update',
				method: 'POST',
				data: data
			})
		},

		deleteUnit: function (ids) {
			return $http({
				url: baseUrl + '/delete',
				method: 'POST',
				data: ids
			})
    }
  }
});