'use strict';

angular.module('com.app').factory('ReviewService', function ($http) {
  var baseUrl = "/api/v1/ahgz/company/commentuser";
  var companyBaseUrl = "/api/v1/ahgz/company/nfor";
  return {
    getCompanyList: function (tableParams, searchName) {
      return $http.get('')
			return $http({
				url: companyBaseUrl + '/select/infors',
				method: 'GET',
				params: {
					pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          name: searchName
				}
			});
		},

		createCompany: function (data) {
			return $http({
				url: companyBaseUrl + '/add',
				method: 'POST',
				data: data
			});
		},

		deleteCompany: function (id) {
			return $http({
				url: companyBaseUrl + '/delete' + id,
				method: 'DELETE'
			});
		},

		editCompany: function (data) {
			return $http({
				url: companyBaseUrl + '/update',
				method: 'PUT',
				data: data
			});
		},

		getCompanyInfo: function (id) {
			return $http({
				url: companyBaseUrl + '/select/' + id,
				method: 'GET'
			})
    },
    
    getScaleList: function () {
      return $http.get('')
    },
    getVarietyList: function () {
      return $http.get('')
    },
    getProjectList: function () {
      return $http.get('')
    },


    // 现场评估人
    getReviewerList: function (reportId) {
      return $http.get('')
    },
    addReviewer: function (data) {
      return $http({
        url: '',
        method: 'POST',
        data: data
      })
    },
    deleteReviewer: function (id) {
      return $http.delete('')
    },
    editReviewer: function (data) {
      return $http({
        url: '',
        method: 'PUT',
        data: data
      })
    },

    // 报告相关
    getReportList: function (companyId) {
      return $http.get('')
    },
    addReport: function (data) {
      return $http({
        url: '',
        method: 'POST',
        data: data
      })
    },
    deleteReport: function (id) {
      return $http.delete('')
    },
    editReport: function (data) {
      return $http({
        url: '',
        method: 'PUT',
        data: data
      })
    },

    // 报告项目
    getReportProjectList: function (reportId) {
      return $http.get('')
    },
    editReportProject: function (reportId, projectId, data) {
      return $http({
        url: '',
        method: 'PUT',
        data: data
      })
    }

  }
})