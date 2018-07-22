'use strict';

angular.module('com.app').controller('ReviewCompanyReportProjectCtrl', function ($stateParams, $filter, $uibModal, api, ReviewService, toastr, dialog) {
  var vm = this;

  vm.reportId = $stateParams.reportId

  var reviewBC = api.breadCrumbMap.review;
  var report = angular.copy(reviewBC.company.report.root)
  report.params = {projectId: $stateParams.projectId, reportId: $stateParams.reportId}
  vm.breadCrumbArr = [reviewBC.root, reviewBC.company.root, report, {name: vm.reportId}];



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

  vm.changeScore = function (projectName, idx) {
    var item = vm.projects[projectName][idx];
    if (item.score === 0) {
      item.scoreLevel = '不符合'
    } else if (item.score === item.standardScore) {
      item.scoreLevel = '符合'
    } else {
      item.scoreLevel = '合理缺项'
    }
  }

  vm.showInfo = function (evt) {
    $(evt.target).tooltip('show')
  }

  vm.submit = function () {
    var res = [];
    angular.forEach(vm.projects, function (val, key) {
      res = res.concat(val.map(function (item) {
        if (item.score === '') {
          item.score = null
        }
        return item
      }))
    })
    ReviewService.editReportProject(res).then(function (response) {
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
