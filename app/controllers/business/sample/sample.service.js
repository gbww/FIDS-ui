'use strict';

angular.module('com.app').factory('SampleService', function ($http) {
	return {
		getSampleList: function (tableParams, searchName, status) {
			return $http({
				url: '/api/v1/ahgz/sample',
				params: {
          pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          receivesampleid: searchName,
          status: status || '5'
        }
			})
		},

		createSample: function (data) {
			return $http({
				url: '/api/v1/ahgz/sample',
				method: 'POST',
				data: data
			})
		},

		// 批量删除
		deleteSample: function (ids) {
			return $http({
				url: '/api/v1/ahgz/sample/delete',
				method: 'POST',
				data: ids
			})
		},

		getSampleInfo: function (id) {
			return $http.get('/api/v1/ahgz/sample/' + id);
		},

		editSample: function (data) {
			return $http({
				url: '/api/v1/ahgz/sample',
				method: 'PUT',
				data: data
			})
		},

		setReportStatus: function (id, status) {
			return $http({
				url: '/api/v1/ahgz/sample/status/' + id,
				method: 'PUT',
				data: {
					status: status
				}
			})
		},

		// 接样单检测项

		getSampleCiList: function (sampleId) {
			return $http.get('/api/v1/ahgz/sample/items/' + sampleId);
		},

		getSampleCiInfo: function (id) {
			return $http.get('/api/v1/ahgz/sample/items/item/' + id);
		},

		// 批量录入和更改
		updateSampleCi: function (sampleId, data) {
			return $http({
				url: '/api/v1/ahgz/sample/item/' + sampleId,
				method: 'POST',
				data: data
			})
		},

		deleteSampleCi: function (sampleId, data) {
			return $http({
				url: '/api/v1/ahgz/sample/items/' + sampleId + '/delete',
				method: 'POST',
				data: data
			})
		},

		// 获取检测人员的检测项列表任务
		getUserCi: function (tableParams, status) {
			return $http({
				url: '/api/v1/ahgz/sampleItem',
				params: {
          pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          status: status
        }
			})
		},

		exportFile: function (sampleId, name) {
			return $http({
				url: '/api/v1/ahgz/sample/items/excel/' + sampleId,
				method: 'GET',
				params: {
					templateFileName: name
				}
			});
		}


	}
});
