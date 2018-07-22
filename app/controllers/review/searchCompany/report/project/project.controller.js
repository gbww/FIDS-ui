'use strict';

angular.module('com.app').controller('ReviewSearchCompanyReportProjectCtrl', function ($stateParams, $filter, $uibModal, api, ReviewService, toastr, dialog) {
  var vm = this;

  vm.reportId = $stateParams.reportId

  var reviewBC = api.breadCrumbMap.review;
  var report = angular.copy(reviewBC.searchCompany.report.root)
  report.params = {projectId: $stateParams.projectId, reportId: $stateParams.reportId}
  vm.breadCrumbArr = [reviewBC.root, reviewBC.searchCompany.root, report, {name: vm.reportId}];



  vm.loading = true;
  vm.getProjectList = function () {
    vm.projects = {};
    ReviewService.getReportProjectList(vm.reportId).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        angular.forEach(response.data.entity.sort(function (a, b) {
          return a.projectName.split('.')[0] - b.projectName.split('.')[0]
        }), function (item) {
          if (!vm.projects[item.projectName]) vm.projects[item.projectName] = []
          vm.projects[item.projectName].push(angular.merge(item, {
            scoreList: [0, item.standardScore, '']
          }))
        })

        angular.forEach(vm.projects, function (val, key) {
          val.sort(function (a, b) {
            return a.numberRegulation.replace(/\*/g, '') - b.numberRegulation.replace(/\*/g, '')
          })
        })
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      toastr.error(err.data);
    })
  }
  vm.getProjectList()

  vm.showInfo = function (evt) {
    $(evt.target).tooltip('show')
  }

});
