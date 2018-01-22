'use strict';

angular.module('com.app').controller('CiSampleDetailInfoCtrl', function ($stateParams, toastr, SampleService) {
  var vm = this;

  vm.getSampleInfo = function () {
    vm.loading = true;
    SampleService.getSampleInfo($stateParams.id).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.sample = response.data.entity;
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    });
  };
  vm.getSampleInfo();


});
