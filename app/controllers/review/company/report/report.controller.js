'use strict';

angular.module('com.app').controller('ReviewCompanyReportCtrl', function ($stateParams, $uibModal, api, ReviewService, toastr, dialog) {
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
    ReviewService.getReportList(tableParams, vm.searchObject.searchKeywords).then(function (response) {
      vm.loading = false;
      vm.reports = [
        {
          reviewReportId: 1, companyId: 1, evaluateProductType: 'type', evaluateStage: 'stage', evaluateSketch: 'sketch',
          checkDate: new Date(), endDate: new Date(), companyRepresent: 'represent', reviewResult: 'result',
          score: 8, fastResult: 'fastResult', fuheUser: 'fuheUser', pizhunUser: 'pizhunUser', reportStatus: 'reportStatus'
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
    // ReviewService.getReportId(item.id).then(function (response) {
    //   if (response.data.success) {
        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          backdrop: 'static',
          templateUrl: 'controllers/review/company/addReviewer/addReviewer.html',
          controller: 'ProjectReviewerCtrl as vm',
          resolve: {
            // reportId: function () {return response.data},
            reportId: function () {return '123'},
          }
        })
        modalInstance.result.then(function () {
          $state.go('app.review.company.report.project', {companyId: company.id, reportId: '123'})
        })
    //   } else {
    //     toastr.error(response.data.message)
    //   }
    // }).catch(function (err) {
    //   toastr.error(err.data)
    // })
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
