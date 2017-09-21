'use strict';

angular.module('com.app').factory('TemplateService', function ($http) {
	return {
		recordTemplateItem: function (template) {
			return $http({
				url: '/api/v1/ahgz/template',
				method: 'POST',
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
