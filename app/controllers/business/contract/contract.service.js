'use strict';

angular.module('com.app').factory('ContractService', function ($http) {
	return {
		getContractList: function (tableParams, searchName) {
			return $http({
				url: '/api/v1/ahgz/contract',
				params: {
          pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          orderBy: tableParams.orderBy,
          reverse: tableParams.reverse,
          sampleName: searchName
        }
			})
		},

		validateProtocolId: function (id) {
			return $http.get('/api/v1/ahgz/contract/check/' + id);
		},

		createContract: function (data) {
			return $http({
				url: '/api/v1/ahgz/contract',
				method: 'POST',
				data: data
			})
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

		editContract: function (id, data) {
			return $http({
				url: '/api/v1/ahgz/contract/' + id,
				method: 'PUT',
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

		getUserTask: function (userId, taskName, isHandle) {
			return $http({
				url: '/api/v1/ahgz/contract/process/task',
				params: {
					userId: userId,
					taskName: taskName,
					isHandle: isHandle
				}
			})
		}
	}
})
