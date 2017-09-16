'use strict';

angular.module('com.app').controller('CheckItemCtrl', function ($scope, $state, $uibModal, api, CheckItemService, toastr, dialog) {
  var vm = this;


  vm.goTab = function (tab) {
    if (tab == 'list') {
      $state.go('app.business.checkItem.list');
    } else if (tab == 'manage') {
      $state.go('app.business.checkItem.manage');
    }
  }

  var businessBC = api.breadCrumbMap.business;

  $scope.$on('$stateChangeSuccess', function() {
    if ($state.includes('app.business.checkItem.list')) {
      vm.tab = 'list';
      vm.breadCrumbArr = [businessBC.root, businessBC.checkItem.root, businessBC.checkItem.list];
    } else if ($state.includes('app.business.checkItem.manage')) {
      vm.tab = 'manage';
      vm.breadCrumbArr = [businessBC.root, businessBC.checkItem.root, businessBC.checkItem.manage];
    }
  })

});
