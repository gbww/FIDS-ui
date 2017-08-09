'use strict';

angular.module('com.app').controller('DashboardCtrl', function (api) {
  var vm = this;

  vm.breadCrumbArr = [api.breadCrumbMap.dashboard.root];
});
