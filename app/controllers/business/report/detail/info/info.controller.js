'use strict';

angular.module('com.app').controller('ReportDetailInfoCtrl', function ($scope, toastr, SampleService, templateMap) {
  var vm = this;

  $scope.$emit('refreshReport');
  $scope.$on('reportInfo', function (event, sample) {
  	vm.sample = sample;
  });

  vm.coverTypeArr = templateMap.coverType;
  vm.reportTypeArr = templateMap.reportType;

  vm.checkTypeArr = ['监督检验', '省级食品安全监', '委托检验', '发证检验'];
  vm.sampleWayArr = ['接样方式一'];
  vm.specificationModelArr = ['规格一'];
  vm.executeStandardArr = ['标准一', '标准二'];
  vm.processingTechnologyArr = ['等级一'];
  vm.closedStatusArr = ['状态一'];
  vm.sampleStatusArr = ['状态一'];
  vm.sampleNamesArr = ['zhangsan'];

  vm.ok = function (form) {
    if (form.$invalid) {
      vm.submitted = true;
      return;
    }

		SampleService.editSample(vm.sample).then(function (response) {
  		if (response.data.success) {
  			toastr.success('报告修改成功！');
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).catch(function (err) {
  		toastr.error(err.data);
  	})
  }

});
