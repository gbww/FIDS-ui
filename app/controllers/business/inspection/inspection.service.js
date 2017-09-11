'use strict';

angular.module('com.app').factory('InspectionService', function ($http) {
	return {
		getInspectionItems: function () {
			return $http.get('/mock/data/inspection.json');
		}
	}
})
