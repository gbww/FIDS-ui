'use strict';

angular.module('com.app').controller('ReviewCompanyReportProjectCtrl', function ($stateParams, $uibModal, api, ReviewService, toastr, dialog) {
  var vm = this;

  vm.reportId = $stateParams.reportId

  var reviewBC = api.breadCrumbMap.review;
  var report = angular.copy(reviewBC.company.report.root)
  report.params = {projectId: $stateParams.projectId, reportId: $stateParams.reportId}
  vm.breadCrumbArr = [reviewBC.root, reviewBC.company.root, report, {name: vm.reportId}];



  vm.projects = [];
  vm.loading = true;
  vm.getProjectList = function () {
    ReviewService.getReportProjectList(vm.reportId).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.projects = response.data.entity;
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    })
  }
  vm.getProjectList()

  vm.showInfo = function (evt) {
    $(evt.target).tooltip('show')
  }

  vm.submit = function () {
    ReviewService.editReportProject(vm.projects).then(function (response) {
      if (response.data.success) {
        toastr.success('报告 ' + vm.reportId + ' 项目更新成功');
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      toastr.error(err.data);
    })
  }

  // vm.edit = function (item) {
  //   var modalInstance = $uibModal.open({
  //     animation: true,
  //     size: 'md',
  //     backdrop: 'static',
  //     templateUrl: 'controllers/review/company/report/project/edit/edit.html',
  //     controller: 'CompanyReportProjectEditCtrl as vm',
  //     resolve: {
  //       project: function () {return angular.copy(item);},
  //     }
  //   });

  //   modalInstance.result.then(function () {
  //     vm.refreshTable();
  //     toastr.success("报告修改成功！");
  //   })
  // }


});
