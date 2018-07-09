'use strict';

angular.module('com.app').factory('ReviewService', function ($http) {
  var baseUrl = "/api/v1/ahgz/company";
  return {
    getCompanyList: function (tableParams, searchName) {
			return $http({
				url: baseUrl + '/info/select/cominfors',
				method: 'GET',
				params: {
					pageSize: tableParams.pageSize,
          pageCount: tableParams.pageNum,
          name: searchName
				}
			});
		},

		createCompany: function (data) {
			return $http({
				url: baseUrl + '/info/add',
				method: 'POST',
				data: data
			});
		},

		deleteCompany: function (id) {
			return $http({
				url: baseUrl + '/info/delete/' + id,
        method: 'DELETE'
			});
		},

		editCompany: function (data) {
			return $http({
				url: baseUrl + '/info/update',
				method: 'PUT',
				data: data
			});
		},

		getCompanyInfo: function (id) {
			return $http({
				url: baseUrl + '/info/select/' + id,
				method: 'GET'
			})
    },
    
    getScaleList: function () {
      return $http.get(baseUrl + '/scale/selectAll')
    },
    getVarietyList: function () {
      return $http.get(baseUrl + '/variety/format/selectAll')
    },
    getProjectList: function () {
      return $http.get(baseUrl + '/project/detail/select/comType')
    },
    lanuchReview: function (id) {
      return $http({
        url: baseUrl + '/review/report/add',
        method: 'POST',
        params: {
          companyId: id
        }
      })
    },


    // 现场评估人
    getReviewerList: function (reportId) {
      return $http.get(baseUrl + '/commentuser/selectByReviewReportId/' + reportId)
    },
    addReviewers: function (data) {
      return $http({
        url: baseUrl + '/commentuser/add/batch',
        method: 'POST',
        data: data
      })
    },
    deleteReviewers: function (ids) {
      return $http({
        url: baseUrl + '/commentuser/batchDelete',
        method: 'DELETE',
        data: ids
      })
    },
    editReviewer: function (data) {
      return $http({
        url: baseUrl + '/commentuser/update',
        method: 'PUT',
        data: data
      })
    },

    // 报告相关
    getReportList: function (tableParams, companyId, searchName) {
			return $http({
				url: baseUrl + '/review/report/selectByCompanyId/' + companyId,
				method: 'GET',
				params: {
					pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          name: searchName
				}
			});
    },
    getReportInfo: function (reportId) {
      return $http.get(baseUrl + '/review/report/selectById/' + reportId)
    },
    deleteReport: function (id) {
      return $http.delete(baseUrl + '/review/report/delete/' + id)
    },
    editReport: function (data) {
      return $http({
        url: baseUrl + '/review/report/update',
        method: 'PUT',
        data: data
      })
    },

    // 报告项目
    getReportProjectList: function (reportId) {
      return $http.get(baseUrl + '/project/review/select/' + reportId)
    },
    editReportProject: function (data) {
      return $http({
        url: baseUrl + '/project/review/update',
        method: 'PUT',
        data: data
      })
    }

  }
})