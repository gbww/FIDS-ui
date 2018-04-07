'use strict';

angular.module('com.app').factory('QuotationService', function ($http) {
	var baseUrl = '/api/v1/ahgz';
	return {
		getQuotationList: function (tableParams, searchName) {
			return $http({
				url: baseUrl + '/client/select',
				method: 'GET',
				params: {
          pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          order: tableParams.order
				}
			})
    }
  }
});