'use strict';

angular.module('com.app').controller('ReviewCompanyReportCtrl', function ($state, $stateParams, $uibModal, api, ReviewService, toastr, dialog) {
  var vm = this;
  vm.companyId = $stateParams.companyId

  var reviewBC = api.breadCrumbMap.review;
  vm.breadCrumbArr = [reviewBC.root, reviewBC.company.root, reviewBC.company.report.root];


  vm.searchObject = {
    companyId: $stateParams.companyId,
    searchKeywords: ''
  }

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    }
  }

  vm.reports = [];
  vm.loading = true;
  vm.getReportList = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
    ReviewService.getReportList(tableParams, vm.companyId, vm.searchObject.searchKeywords).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.reports = response.data.entity.list;
        vm.total = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;
      } else {
        vm.total = 0;
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    })
  }

  vm.search=function(){
    vm.searchObject.searchKeywords = vm.query;
  }
  vm.eventSearch=function(e){
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
      vm.searchObject.searchKeywords = vm.query;
    }
  }


  // 创建完成之后进入该报告项目列表页
  vm.create = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      backdrop: 'static',
      templateUrl: 'controllers/review/company/addReviewer/addReviewer.html',
      controller: 'ProjectReviewerCtrl as vm',
      resolve: {
        reportId: function () {return null},
        reviewers: function () {return null}
      }
    })
    modalInstance.result.then(function (reportId) {
      if (reportId) {
        $state.go('app.review.company.report.project', {companyId: vm.companyId, reportId: reportId})
      }
    })
  }

  vm.edit = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/review/company/report/edit/edit.html',
      controller: 'ReviewCompanyReportEditCtrl as vm',
      resolve: {
        report: function () {return angular.copy(item);},
      }
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("报告修改成功！");
    })
  }

  vm.editReviewer = function (reportId) {
    ReviewService.getReviewerList(reportId).then(function (response) {
      if (response.data.success) {
        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          backdrop: 'static',
          templateUrl: 'controllers/review/company/addReviewer/addReviewer.html',
          controller: 'ProjectReviewerCtrl as vm',
          resolve: {
            reportId: function () {return reportId},
            reviewers: function () {return response.data.entity},
          }
        })
        modalInstance.result.then(function () {
          $state.go('app.review.company.report.project', {companyId: vm.companyId, reportId: response.data})
        })
      } else {
        toastr.error(response.data.message)
      }
    }).catch(function (err) {
      toastr.error(err.data)
    })
  }

  vm.delete = function (report) {
    var result = dialog.confirm('确认删除报告 ' + report.reviewReportId + ' ?');
    result.then(function (res) {
      if (res) {
        ReviewService.deleteReport(report.reviewReportId).then(function (response) {
          if (response.data.success) {
            vm.refreshTable('delete');
            toastr.success('报告删除成功！');
          } else {
            toastr.error(response.data.message);
          }
        }).catch(function (error) {
          toastr.error(error.data.message)
        });
      }
    })
  }


});
