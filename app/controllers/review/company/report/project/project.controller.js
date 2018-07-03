'use strict';

angular.module('com.app').controller('ReviewCompanyReportProjectCtrl', function ($stateParams, $uibModal, api, ReviewService, toastr, dialog) {
  var vm = this;

  vm.reportId = $stateParams.reportId

  var reviewBC = api.breadCrumbMap.review;
  var report = angular.copy(reviewBC.company.report.root)
  report.params = {projectId: $stateParams.projectId, reportId: $stateParams.reportId}
  vm.breadCrumbArr = [reviewBC.root, reviewBC.company.root, report, reviewBC.company.report.project];


  vm.searchObject = {
    searchKeywords: ''
  }

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
  }

  vm.projects = [];
  vm.loading = true;
  vm.getProjectList = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
    ReviewService.getReportProjectList(tableParams, vm.searchObject.searchKeywords).then(function (response) {
      vm.loading = false;
      vm.projects = [
        {
          id: 1, companyId: 'companyId', comType: 'type', reviewReportId: 'reportId', projectId: 'projectId',
          projectName: 'projectName', score: 7, scoreLevel: 'level', remark: 'remark', advise: 'advise'
        }
      ]
      vm.total = 1;
      tableState.pagination.numberOfPages = 1;
      // if (response.data.success) {
      //   vm.reports = response.data.entity.list;
      //   vm.total = response.data.entity.total;
      //   tableState.pagination.numberOfPages = response.data.entity.pages;
      // } else {
      //   vm.total = 0;
      //   toastr.error(response.data.message);
      // }
    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    })
  }


  vm.edit = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/review/company/report/project/edit/edit.html',
      controller: 'CompanyReportProjectEditCtrl as vm',
      resolve: {
        project: function () {return angular.copy(item);},
      }
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("报告修改成功！");
    })
  }


});
