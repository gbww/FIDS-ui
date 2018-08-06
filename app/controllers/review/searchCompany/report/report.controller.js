'use strict';

angular.module('com.app').controller('ReviewSearchCompanyReportCtrl', function ($state, $stateParams, $uibModal, api, ReviewService, toastr, dialog) {
  var vm = this;
  vm.companyId = $stateParams.companyId

  var reviewBC = api.breadCrumbMap.review;
  vm.breadCrumbArr = [reviewBC.root, reviewBC.searchCompany.root, reviewBC.searchCompany.report.root];


  vm.searchObject = {
    companyId: $stateParams.companyId,
    searchKeywords: ''
  }

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    } else if (flag === 'reset') {
      vm.searchObject.reset = true
    }
  }

  vm.reports = [];
  vm.loading = true;
  vm.getReportList = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
    ReviewService.getReportList(tableParams, vm.companyId, vm.query).then(function (response) {
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
    vm.refreshTable('reset')
  }
  vm.eventSearch=function(e){
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
      vm.search()
    }
  }

  vm.editReviewer = function (reportId) {
    ReviewService.getReviewerList(reportId).then(function (response) {
      if (response.data.success) {
        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          backdrop: 'static',
          templateUrl: 'controllers/review/searchCompany/report/reviewer/reviewer.html',
          controller: 'ReviewerCtrl as vm',
          resolve: {
            reviewers: function () {return response.data.entity},
          }
        })
      } else {
        toastr.error(response.data.message)
      }
    }).catch(function (err) {
      toastr.error(err.data)
    })
  }

});
