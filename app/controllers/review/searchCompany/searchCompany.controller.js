'use strict';

angular.module('com.app').controller('ReviewSearchCompanyCtrl', function ($rootScope, api, ReviewService) {
  var vm = this;

  var reviewBC = api.breadCrumbMap.review;
  vm.breadCrumbArr = [reviewBC.root, reviewBC.searchCompany.root];

  vm.company = null

  vm.search = function (evt) {
    if (evt.keyCode === 13) {
      ReviewService.getCompanyList({}, vm.query).then(function (response) {
        if (response.data.success) {
          vm.company = response.data.entity.list[0];
        } else {
          toastr.error(response.data.message);
        }
      }).catch(function (err) {
        toastr.error(err.data);
      })
    }
  }

})