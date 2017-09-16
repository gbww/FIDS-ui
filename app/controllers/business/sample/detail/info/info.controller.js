'use strict';

angular.module('com.app').controller('SampleDetailInfoCtrl', function ($scope, toastr, SampleService) {
  var vm = this;

  $scope.$emit('refreshSample');
  $scope.$on('sampleInfo', function (event, sample) {
  	vm.sample = sample;
  });

  vm.ok = function () {
    var data = angular.merge({}, vm.sample, {
        sampleCirculateDate: vm.sample.sampleCirculateDate ? new Date(vm.sample.sampleCirculateDate).toLocaleString() : null,
        sampleDate: vm.sample.sampleDate ? new Date(vm.sample.sampleDate).toLocaleString() : null,
        receiveDate: vm.sample.receiveDate ? new Date(vm.sample.receiveDate).toLocaleString() : null,
        arrangeFinishDate: vm.sample.arrangeFinishDate ? new Date(vm.sample.arrangeFinishDate).toLocaleString() : null,
        finishDate: vm.sample.finishDate ? new Date(vm.sample.finishDate).toLocaleString() : null
    });

		SampleService.editSample(data).then(function (response) {
  		if (response.data.success) {
  			toastr.success('接样单修改成功！');
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).catch(function (err) {
  		toastr.error(err.data.message);
  	})
  }

});
