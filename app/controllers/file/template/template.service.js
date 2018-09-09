'use strict';

angular.module('com.app').factory('TemplateService', function ($http) {
	return {
		getFrTemplates: function () {
			return $http.get('/api/v1/ahgz/templates/fr')
		},
		getTemplateList: function (tableParams, searchName) {
			return $http({
				url: '/api/v1/ahgz/templates',
				method: 'GET',
				params: {
					pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          name: searchName
				}
			});
		},

		filterTemplate: function () {
			return $http({
				url: '/api/v1/ahgz/templates',
				method: 'GET'
			});
		},

		recordTemplateItem: function (template) {
			return $http({
				url: '/api/v1/ahgz/template',
				method: 'POST',
				data: template
			});
		},

		deleteTemplate: function (id) {
			return $http({
				url: '/api/v1/ahgz/template/' + id,
				method: 'DELETE'
			});
		},

		editTemplate: function (template) {
			return $http({
				url: '/api/v1/ahgz/template',
				method: 'PUT',
				data: template
			});
		},

		getTemplateInfo: function (name) {
			return $http({
				url: '/api/v1/ahgz/template',
				method: 'GET',
				params: {
					name: name
				}
			})
		}
	}
});
