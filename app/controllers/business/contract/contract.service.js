'use strict';

angular.module('com.app').factory('ContractService', function ($http) {
	return {
		getContractLog: function (id, page) {
			return $http({
				url: '/api/v1/ahgz/log/page',
				method: 'GET',
				params: {
					target: id,
					page: page
				}
			});
		},

		getContractList: function (tableParams, searchName, type) {
			return $http({
				url: '/api/v1/ahgz/contract',
				params: {
          pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          order: tableParams.order,
					sampleName: searchName,
					type: type
        }
			})
		},

		validateProtocolId: function (id) {
			return $http.get('/api/v1/ahgz/contract/check/' + id);
		},

		// 含有文件，使用multipart/form-data，但是手动设置会报错，使用undefined可以自动填充当前的boundary
		createContract: function (data) {
			return $http({
				url: '/api/v1/ahgz/contract',
				method: 'POST',
				headers: {
					'Content-Type': undefined
				},
				data: data
			})
		},

		deleteAppendix: function (contractId, filename) {
			return $http({
				url: '/api/v1/ahgz/contract/' + contractId + '/appendix?filename=' + filename,
				method: 'DELETE'
			});
		},

		deleteContract: function (id) {
			return $http({
				url: '/api/v1/ahgz/contract/' + id,
				method: 'DELETE'
			})
		},

		getContractInfo: function (id) {
			return $http.get('/api/v1/ahgz/contract/' + id);
		},

		editContract: function (data) {
			return $http({
				url: '/api/v1/ahgz/contract/update',
				method: 'POST',
				headers: {
					'Content-Type': undefined
				},
				data: data
			})
		},


		/*
		 ****************************************** 合同评审 ****************************
		 */
		startCommentTask: function (data) {
			return $http({
				url: '/api/v1/ahgz/contract/process',
				method: 'POST',
				data: data
			});
		},

		getCommentList: function (id) {
			return $http({
				url: '/api/v1/ahgz/contract/process/comment',
				method: 'GET',
				params: {
					contract_id: id
				}
			});
		},

		recordComment: function (taskId, data) {
			return $http({
				url: '/api/v1/ahgz/contract/process/task/' + taskId,
				method: 'GET',
				params: data
			});
		},

		updateComment: function () {
			return $http.get('');
		},

		getUserTask: function (isHandle) {
			return $http({
				url: '/api/v1/ahgz/contract/process/task',
				params: {
					isHandle: isHandle
				}
			})
		}
	}
})
