'use strict';

angular.module('com.app').factory('ClientService', function ($http) {
	var baseUrl = '/api/v1/ahgz';
	return {
		getClientList: function (tableParams, searchName) {
			return $http({
				url: baseUrl + '/client/select',
				method: 'GET',
				params: {
          pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          order: tableParams.order
				}
			})
		},

		addClient: function (data) {
			return $http({
				url: baseUrl + '/client/add',
				method: 'POST',
				data: data
			})
		},

		updateClient: function (data) {
			return $http({
				url: baseUrl + '/client/update',
				method: 'PUT',
				data: data
			})
		},

		deleteClient: function (data) {
			return $http({
				url: baseUrl + '/client/delete',
				method: 'POST',
				data: data
			})
		},


		// 客户联系人

		getClientLinkList: function (tableParams, clientId) {
			return $http({
				url: baseUrl + '/clientlinkman/select',
				method: 'GET',
				params: {
          order: tableParams.order,
          clientNum: clientId
				}
			})
		},

		addClientLink: function (data) {
			return $http({
				url: baseUrl + '/clientlinkman/add',
				method: 'POST',
				data: data
			})
		},

		updateClientLink: function (data) {
			return $http({
				url: baseUrl + '/clientlinkman/update',
				method: 'PUT',
				data: data
			})
		},

		deleteClientLink: function (data) {
			return $http({
				url: baseUrl + '/clientlinkman/delete',
				method: 'POST',
				data: data
			})
		},


		// 日程
		getClientScheduleList: function (clientId) {
			return $http({
				url: baseUrl + '/clientscheduler/select',
				method: 'GET',
				params: {
          clientNum: clientId,
					order: 'created_at asc'
				}
			})
		},

		addClientSchedule: function (data) {
			return $http({
				url: baseUrl + '/clientscheduler/add',
				method: 'POST',
				data: data
			})
		},

		updateClientSchedule: function (data) {
			return $http({
				url: baseUrl + '/clientscheduler/update',
				method: 'PUT',
				data: data
			})
		},

		deleteClientSchedule: function (data) {
			return $http({
				url: baseUrl + '/clientscheduler/delete',
				method: 'POST',
				data: data
			})
		},

		// 日程报告
		getScheduleReportList: function (scheduleId) {
			return $http({
				url: baseUrl + '/schedulerreport/select',
				method: 'GET',
				params: {
					schedulerId: scheduleId
				}
			})
		},

		addScheduleReport: function (data) {
			return $http({
				url: baseUrl + '/schedulerreport/add',
				method: 'POST',
				data: data
			})
		},

		updateScheduleReport: function (data) {
			return $http({
				url: baseUrl + '/schedulerreport/update',
				method: 'PUT',
				data: data
			})
		},

		deleteScheduleReport: function (data) {
			return $http({
				url: baseUrl + '/schedulerreport/delete',
				method: 'POST',
				data: data
			})
		}
	}
})
