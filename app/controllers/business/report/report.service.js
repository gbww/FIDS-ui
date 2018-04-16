'use strict';

angular.module('com.app').factory('ReportService', function ($http) {
  var baseUrl = '/api/v1/ahgz/report';
	return {
    /** 
     * 所有：list/all
     * 编制：list/edit
     * 审核：list/examine
     * 批准：list/approve
     * 待打印：list/print
     * 已完成: list/finish
     * 有权限控制
    */
    getReportList: function (tableParams, searchConditions, reportStatus) {
      var appendix = '/list/all';
      if (reportStatus === 0) {
        appendix = '/list/edit';
      } else if (reportStatus === 1) {
        appendix = '/list/examine';
      } else if (reportStatus === 2) {
        appendix = '/list/approve';
      } else if (reportStatus === 3) {
        appendix = '/list/print';
      } else if (reportStatus === 4) {
        appendix = '/list/finish';
      }

			return $http({
				url: baseUrl + appendix,
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
					sampleType: searchConditions.sampleType,
					checkType: searchConditions.checkType,
					startTime: searchConditions.startTime,
					endTime: searchConditions.endTime
        }
			})
    },

    getReportInfo: function (receiveSampleId) {
      return $http.get(baseUrl + '/' + receiveSampleId);
    },

    getReportCi: function (receiveSampleId) {
      return $http.get(baseUrl + '/list/' + receiveSampleId);
    },

    
    // 更新报告：报告详情和模板，需要添加模板才能启动流程
    updateReport: function (data) {
      return $http({
        url: baseUrl + '/edit',
        method: 'POST',
        data: data
      })
    },


    // 指定报告对应模板，指定的时候启动流程
    bindReportTmpl: function (data) {
      return $http({
        url: baseUrl + '/template/bind',
        method: 'POST',
        data: data
      })
    },

    // 修改报告对应模板
    updateReportTmpl: function (id, data) {
      return $http({
        url: baseUrl + '/template/bind/' + id,
        method: 'PUT',
        params: data
      })
    },


    // 启动报告流程
    startProcess: function (receiveSampleId) {
      return $http({
        url: baseUrl + '/process',
        method: 'POST',
        params: {
          receiveSampleId: receiveSampleId
        }
      })
    },

    // 查看当前用户任务列表
    getUserTask: function (isHandle) {
      return $http({
        url: baseUrl + '/process',
        method: 'GET',
        params: {
          isHandle: isHandle
        }
      })
    },


    // 编制任务
    runEditTask: function (taskId, data) {
      return $http({
        url: baseUrl + '/process/task/edit/' + taskId,
        method: 'GET',
        params: data
      })
    },

    // 审核任务
    runExamineTask: function (taskId, data) {
      return $http({
        url: baseUrl + '/process/task/examine/' + taskId,
        method: 'GET',
        params: data
      })
    },


    // 批准任务
    runApproveTask: function (taskId, data) {
      return $http({
        url: baseUrl + '/process/task/approve/' + taskId,
        method: 'GET',
        params: data
      })
    },

    getReportHtml: function (receiveSampleId) {
      return $http.get(baseUrl + '/exportHtml?receiveSampleId=' + receiveSampleId);
    }

  }
});