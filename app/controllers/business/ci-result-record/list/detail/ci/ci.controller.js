'use strict';

angular.module('com.app').controller('CiSampleDetailCiCtrl', function ($stateParams, CheckItemService, SampleService, toastr) {
  var vm = this;

  vm.getSampleCi = function () {
    vm.ciLoading = true;
    SampleService.getSampleCiList(vm.sample.receiveSampleId).then(function (response) {
      vm.ciLoading = false;
      if (response.data.success) {
        vm.checkItems = response.data.entity;
      } else {
        toastr.error(response.data.message);
      }
    })
  }

  vm.getSampleInfo = function () {
    vm.ciLoading = true;
    SampleService.getSampleInfo($stateParams.id).then(function (response) {
      if (response.data.success) {
        vm.sample = response.data.entity;
        vm.getSampleCi();
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      toastr.error(err.data);
    });
  };
  vm.getSampleInfo();
});
