'use strict';

angular.module('com.app').factory('CiDistributeService', function ($http) {
  var baseUrl = '/api/v1/ahgz/receive';
  return {
    getUndistributeSamples: function (tableParams, searchConditions) {
			return $http({
				url: baseUrl + '/sample/listForDistribute',
				method: 'GET',
				params: {
          pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          order: tableParams.order,
          reportId: searchConditions.reportId,
          sampleName: searchConditions.sampleName,
          entrustedUnit: searchConditions.entrustedUnit,
          inspectedUnit: searchConditions.inspectedUnit,
          productionUnit: searchConditions.productionUnit,
          receiveSampleId: searchConditions.receiveSampleId,
          executeStandard: searchConditions.executeStandard
        }
			})
    },
    
    getUndistributeCi: function (tableParams, searchConditions, status) {
      var params = {
        pageSize: tableParams.pageSize,
        pageNum: tableParams.pageNum,
        order: tableParams.order,
        name: searchConditions.name,
        method: searchConditions.method,
        reportId: searchConditions.reportId,
        status: status
      }
      if (status === 0) params.assign = false
			return $http({
				url: baseUrl + '/sample/items/assign',
				method: 'GET',
				params: params
			})
    },
    
		distributeSampleCi: function (data) {
			return $http({
				url: baseUrl + '/sample/item/distribute',
				method: 'POST',
				data: data
			})
		},
  }
})