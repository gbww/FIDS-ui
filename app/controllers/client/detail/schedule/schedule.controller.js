'use strict';

angular.module('com.app').controller('ClientDetailScheduleCtrl', function ($stateParams, $uibModal, dialog, toastr, ClientService) {
  var vm = this;

  vm.schedules = [];
  vm.loading = true;
  vm.getScheduleList = function () {
    ClientService.getClientScheduleList($stateParams.id).then(function (response) {
    	vm.loading = false;
      if (response.data.success) {
        vm.schedules = response.data.entity || [];
        angular.forEach(vm.schedules, function (schedule) {
          if (vm.show[schedule.id]) {
            vm.getReport(schedule, true);
          }
        })
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
  		vm.loading = false;
      toastr.error(err.data);
    });
  }
  vm.getScheduleList();

  vm.show = [];
  vm.getReport = function (schedule, flag) {
    vm.reportLoading = true;
    ClientService.getScheduleReportList(schedule.id).then(function (response) {
      vm.reportLoading = false;
      if (!flag) {
        vm.show[schedule.id] = !vm.show[schedule.id];
      }
      schedule.reports = response.data.entity || [];
    });
  }

  vm.create = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/client/detail/schedule/create-schedule/create.html',
      controller: 'ClientScheduleCreateCtrl as vm',
      resolve: {
        clientId: function () {return $stateParams.id}
      }
    });

    modalInstance.result.then(function () {
      vm.getScheduleList();
      toastr.success("日程创建成功！");
    })
  }

  vm.edit = function (schedule) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/client/detail/schedule/edit-schedule/edit.html',
      controller: 'ClientScheduleEditCtrl as vm',
      resolve: {
        schedule: function () { return angular.copy(schedule); }
      }
    });

    modalInstance.result.then(function () {
      vm.getScheduleList();
      toastr.success("日程修改成功！");
    })
  }

  vm.delete = function (schedule) {
    var result = dialog.confirm('确认删除日程 ' + schedule.schedulerName + ' ?');
    result.then(function (res) {
      if (res) {
        ClientService.deleteClientSchedule([schedule.id]).then(function (response) {
          if (response.data.success) {
            vm.getScheduleList();
            toastr.success('日程删除成功！');
          } else {
            toastr.error(response.data.message);
          }
        }).catch(function (error) {
          toastr.error(error.data.message)
        });
      }
    })
  }

  vm.createReport = function (schedule) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/client/detail/schedule/create-report/create.html',
      controller: 'ClientReportCreateCtrl as vm',
      resolve: {
        scheduleId: function () {return schedule.id;}
      }
    });

    modalInstance.result.then(function () {
      vm.getReport(schedule);
      toastr.success("日程汇报添加成功！");
    });
  }

  vm.editReport = function (schedule, report) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/client/detail/schedule/edit-report/edit.html',
      controller: 'ClientReportEditCtrl as vm',
      resolve: {
        report: function () { return angular.copy(report); }
      }
    });

    modalInstance.result.then(function () {
      vm.getReport(schedule);
      toastr.success("日程汇报修改成功！");
    });
  }

  vm.deleteReport = function (schedule, reportId) {
    var result = dialog.confirm('确认删除日程汇报?');
    result.then(function (res) {
      if (res) {
        ClientService.deleteScheduleReport([reportId]).then(function (response) {
          if (response.data.success) {
            vm.getReport(schedule);
            toastr.success('日程汇报删除成功！');
          } else {
            toastr.error(response.data.message);
          }
        }).catch(function (error) {
          toastr.error(error.data.message)
        });
      }
    });
  }

});
