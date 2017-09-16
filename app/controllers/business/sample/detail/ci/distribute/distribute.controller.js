'use strict';

angular.module('com.app').controller('CiDistributeCtrl', function ($scope, $uibModalInstance, SampleService, sampleId, checkItem) {
  var vm = this;
  vm.checkItem = checkItem;

  vm.departments = ['检测一部', '检测二部', '检测三部'];
  vm.users = ['张三', '李四'];

  vm.ok = function () {
  	var data = angular.merge({}, vm.checkItem, {
  		testRoom: vm.checkItem.testRoom,
  		testUser: vm.checkItem.testUser
  	});
  	SampleService.updateSampleCi(sampleId, [data]).then(function (response) {
  		if (response.data.success) {
        SampleService.setReportStatus(sampleId, 1);
		  	$uibModalInstance.close(vm.checkItem);
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).catch(function (err) {
  		toastr.error(err.data.message);
  	})
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
