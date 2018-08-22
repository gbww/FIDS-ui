'use strict';

angular.module('com.app').factory('FrTemplateService', function ($http) {
	return {
		getTemplateList: function (tableParams, searchName) {
			return $http({
				url: '/api/v1/ahgz/template/frs',
				method: 'GET',
				params: {
					pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          name: searchName
				}
			});
		},

		deleteTemplate: function (id) {
			return $http({
				url: '/api/v1/ahgz/template/fr/' + id,
				method: 'DELETE'
			});
		},
		
	}
});
