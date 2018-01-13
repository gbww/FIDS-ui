'use strict';

angular.module('com.app').controller('CiResultRecordCtrl', function ($scope, $state, api) {
  var vm = this;
  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.itemToCheck.root];

  vm.goTab = function (tab) {
    if (tab == 'sample') {
      $state.go('app.business.itemToCheck.sample');
    } else if (tab == 'list') {
      $state.go('app.business.itemToCheck.list');
    }
  }

  $scope.$on('$stateChangeSuccess', function() {
    if ($state.includes('app.business.itemToCheck.sample')) {
      vm.tab = 'sample';
    } else if ($state.includes('app.business.itemToCheck.list')) {
      vm.tab = 'list';
    }
  })

});
