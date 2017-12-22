'use strict';

angular.module('com.app').controller('ReportDetailCtrl', function ($rootScope, $scope, $state, $stateParams, api, toastr, SampleService, PrivilegeService) {
  var vm = this;

  var reportBC = api.breadCrumbMap.report;
  vm.breadCrumbArr = [reportBC.root, reportBC.detail];

  $rootScope.loading = true;
  vm.getSampleInfo = function () {
    var sampleId = $stateParams.id;
    SampleService.getSampleInfo(sampleId).then(function (response) {
      if (response.data.success) {
        vm.sample = response.data.entity || [];
      } else {
        toastr.error(response.data.message);
      }
      return PrivilegeService.getUserList();
    }).then(function (response) {
      $rootScope.loading = false;
      var res = [];
      angular.forEach(response.data.entity.list, function (user) {
        res.push(user.name);
      });
      vm.users = res;
    }).catch(function (err) {
      $rootScope.loading = false;
      toastr.error(err.data);
    });
  }
  vm.getSampleInfo();


  // var userInfo = api.userInfo;

  // $scope.$on('reportInfo', function (event, sample) {
  // 	vm.sample = sample;
  //   if (vm.sample.reportStatus == 0) {
  //     vm.sample.drawUser = userInfo.name;
  //   } else if (vm.sample.reportStatus == 1){
  //     vm.sample.examineUser = userInfo.name;
  //   } else if (vm.sample.reportStatus == 2){
  //     vm.sample.approvalUser = userInfo.name;
  //   } else {
  //     vm.sample.drawUser = userInfo.name;
  //   }
  // });

  vm.checkTypeArr = ['监督检验', '委托检验', '发证检验', '认证检验', '省级抽检', '风险监测'];
  vm.sampleLinkArr = ['流通环节', '餐饮环节', '生产环节'];
  vm.sampleWayArr = ['随机抽样', '掷骰抽样'];
  vm.specificationModelArr = ['计量称重', '散装', 'kg/袋', 'g/袋', 'ml/瓶', 'L/瓶', 'L/桶', 'g/盒', 'kg/盒', 'ml/盒', 'L/盒'];
  vm.executeStandardArr = ['GB/T 23587-2009'];
  vm.processingTechnologyArr = ['合格品', '优等品', '一等品', '二等品', '三等品', '四等品', ];
  vm.closedStatusArr = ['封样完好', '封样破损'];
  vm.sampleStatusArr = ['固体', '液体', '半固体', '气体', '完好、新鲜、无异味', '腐烂、有异味'];
  vm.sampleBasenumberArr = ['瓶', '袋', 'g', 'kg', 'L', 'ml'];
  vm.saveWayArr = ['常温', '冷冻', '冷藏'];
  vm.sampleNamesArr = ['鲍仕峰 陶云飞', '杨洋 李振凡', '张磊 徐斌'];
  vm.responsiblePersonArr = [];
  vm.receiveUserArr = [];
  vm.subpackageArr = ['农标中心'];

  vm.ok = function (form) {
    // 在待编辑状态确认必须选择审核人
    if (vm.sample.reportStatus === 0 && !vm.sample.examineUser) {
      vm.examineUserError = true;
      return;
    }
    // 在待审核状态确认必须选择批准人
    if (vm.sample.reportStatus === 1 && !vm.sample.approvalUser) {
      vm.approveUserError = true;
      return;
    }
    if (form.$invalid) {
      vm.submitted = true;
      return;
    }
    var data = angular.copy(vm.sample);
    data.reportStatus += 1;

		SampleService.editSample(data).then(function (response) {
  		if (response.data.success) {
  			toastr.success('报告修改成功！');
        $state.go('app.report');
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).catch(function (err) {
  		toastr.error(err.data);
  	})
  }

  vm.reset = function (form, action) {
    if (form.$invalid) {
      vm.submitted = true;
      return;
    }
    var reportStatus = vm.sample.reportStatus;
    if (action == 'unpass') {
      reportStatus = 0;
    } else if (action == 'unapprove') {
      reportStatus = 1;
    }
    SampleService.editSample(angular.merge({}, vm.sample, {reportStatus: reportStatus})).then(function (response) {
      if (response.data.success) {
        toastr.success('报告已驳回！');
        $state.go('app.report');
      } else {
        toastr.error(response.data.message);
      }
    })
  }

});
