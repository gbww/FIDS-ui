'use strict';

angular.module('com.app').factory('TemplateService', function ($http) {
	return {
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

		filterTemplate: function (filter, value) {
			var data = {};
			if (filter == 'type') {
				data = {type: value}
			} else if (filter == 'category') {
				data = {category: value}
			}
			return $http({
				url: '/api/v1/ahgz/templates',
				method: 'GET',
				params: data
			});
		},

		recordTemplateItem: function (template) {
			return $http({
				url: '/api/v1/ahgz/template',
				method: 'POST',
				data: template
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
