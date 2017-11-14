'use strict';

angular.module('com.app').factory('SampleService', function ($http) {
	return {
		getSampleList: function (tableParams, searchConditions, status) {
			return $http({
				url: '/api/v1/ahgz/sample',
				params: {
          pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          receivesampleid: searchConditions.receivesampleid,
          entrustedunit: searchConditions.entrustedunit,
          sampletype: searchConditions.sampletype,
          checktype: searchConditions.checktype,
          startTime: searchConditions.startTime,
          endTime: searchConditions.endTime,
          status: status
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

		// 批量录入和更改(同一抽样单)
		updateSampleCi: function (sampleId, data) {
			return $http({
				url: '/api/v1/ahgz/sample/item/' + sampleId,
				method: 'POST',
				data: data
			})
		},

		batchRecordCiResult: function (data) {
			return $http({
				url: '/api/v1/ahgz/sample/item/result',
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
				url: '/api/v1/ahgz/sample/items/report/' + sampleId,
				method: 'GET',
				params: {
					templateFileName: name,
					type: 'excel'
				}
			});
		},

		previewReport: function(sampleId, name) {
			return $http({
				url: '/api/v1/ahgz/sample/items/report/' + sampleId,
				method: 'GET',
				params: {
					templateFileName: name,
					type: 'pdf'
				}
			});
		}

	}
});
