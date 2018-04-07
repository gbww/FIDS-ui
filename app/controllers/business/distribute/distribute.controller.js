'use strict';

angular.module('com.app').controller('CheckItemDistributeCtrl', function ($scope, $state, api) {
  var vm = this;
  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.distribute.root];

  vm.goTab = function (tab) {
    if (tab == 'sample') {
      $state.go('app.business.distribute.sample');
    } else if (tab == 'list') {
      $state.go('app.business.distribute.list');
    }
  }

  $scope.$on('$stateChangeSuccess', function() {
    if ($state.includes('app.business.distribute.sample')) {
      vm.tab = 'sample';
    } else if ($state.includes('app.business.distribute.list')) {
      vm.tab = 'list';
    }
  })

});
