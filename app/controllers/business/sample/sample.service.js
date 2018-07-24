'use strict';

angular.module('com.app').factory('SampleService', function ($http) {
	var baseUrl = '/api/v1/ahgz/receive';
	return {
		/**
		 *  抽样单相关
		 */
		getSampleList: function (tableParams, searchConditions, status) {
			return $http({
				url: baseUrl + '/sample',
				method: 'GET',
				params: {
          pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          order: tableParams.order,
          reportId: searchConditions.reportId,
          receiveSampleId: searchConditions.receiveSampleId,
          sampleName: searchConditions.sampleName,
          entrustedUnit: searchConditions.entrustedUnit,
          inspectedUnit: searchConditions.inspectedUnit,
          productionUnit: searchConditions.productionUnit,
          executeStandard: searchConditions.executeStandard,
					status: status
        }
			})
		},

		createSample: function (data) {
			return $http({
				url: baseUrl + '/sample',
				method: 'POST',
				data: data
			})
		},

		// 批量删除
		deleteSample: function (ids) {
			return $http({
				url: baseUrl + '/sample/delete',
				method: 'POST',
				data: ids
			})
		},

		getSampleInfo: function (id) {
			return $http.get(baseUrl + '/sample/' + id);
		},

		editSample: function (data) {
			return $http({
				url: baseUrl + '/sample',
				method: 'PUT',
				data: data
			})
		},

		uploadSampleAppendix: function (data) {
			return $http({
				url: baseUrl + '/attachment/upload',
				method: 'POST',
				headers: {
					'Content-Type': undefined
				},
				data: data
			})
		},

		deleteSampleAppendix: function (reportId) {
			return $http({
				url: baseUrl + '/attachment/delete?reportId=' + reportId,
				method: 'DELETE'
			})
		},


		
		/**
		 *  接样单检测项
		 */

		getSampleCiList: function (reportId) {
			return $http.get(baseUrl + '/sample/items/' + reportId);
		},

		getSampleCiInfo: function (id) {
			return $http.get(baseUrl + '/sample/items/item/' + id);
		},

		recordSampleCi: function (reportId, data) {
			return $http({
				url: baseUrl + '/sample/item/add/' + reportId,
				method: 'POST',
				data: data
			})
		},

		updateSampleCi: function (reportId, data) {
			return $http({
				url: baseUrl + '/sample/item/update/' + reportId,
				method: 'POST',
				data: data
			})
		},

		deleteSampleCi: function (reportId, data) {
			return $http({
				url: baseUrl + '/sample/items/' + reportId + '/delete',
				method: 'POST',
				data: data
			})
		},



		/**
		 *  样品类型管理
		 */
		getSampleManagerList: function (tableParams, searchConditions) {
			return $http({
				url: '/api/v1/ahgz/sampleManager/select',
				method: 'GET',
				params: {
          pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          order: tableParams.order,
          managerType: searchConditions.managerType,
				}
			})
		},

		addSampleManager: function (data) {
			return $http({
				url: '/api/v1/ahgz/sampleManager/add',
				method: 'POST',
				data: data
			});
		},


		updateSampleManager: function (data) {
			return $http({
				url: '/api/v1/ahgz/sampleManager/update',
				method: 'POST',
				data: data
			});
		},

		deleteSampleManager: function (ids) {
			return $http({
				url: '/api/v1/ahgz/sampleManager/update',
				method: 'POST',
				data: ids
			});
		},


	}
});
