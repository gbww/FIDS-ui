'use strict';

angular.module('com.app').factory('CiResultRecordService', function ($http) {
	var baseUrl = '/api/v1/ahgz/receive';
  return {
    // 获取检测人员的检测项sample集合
		getUserSample: function (tableParams, searchObject) {
			return $http({
				url: baseUrl + '/sampleItem/sample',
				params: {
          pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          order: tableParams.order,
					reportId: searchObject.reportId,
					receiveSampleId: searchObject.receiveSampleId
        }
			})
    },
    
    // 获取检测人员的检测项列表任务
		getUserCi: function (tableParams, status, searchObject) {
			var params = {
        pageSize: tableParams.pageSize,
        pageNum: tableParams.pageNum,
				order: tableParams.order,
				status: status,
				reportId: searchObject.reportId,
				receiveSampleId: searchObject.receiveSampleId,
				sampleName: searchObject.sampleName,
				name: searchObject.name,
				method: searchObject.method,
			}
			if (status === 1) {
				params.receiveStatus = -1
			}
			return $http({
				url: baseUrl + '/sampleItem',
				params: params
			})
    },
    
    // 批量录入检测项结果
    batchRecordCiResult: function (data) {
			return $http({
				url: baseUrl + '/sample/item/result',
				method: 'POST',
				data: data
			})
		},

		batchDistribute: function (data) {
			return $http({
				url: baseUrl + '/sample/item/result/finish',
				method: 'POST',
				data: data
			})
		}
  }
})