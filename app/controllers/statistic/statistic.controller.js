'use strict';

angular.module('com.app').controller('StatisticCtrl', function (api, $stateParams, $sce) {
  var vm = this;
  vm.breadCrumbArr = [api.breadCrumbMap.statistic.root, {name: $stateParams.name}];

  vm.height = parseFloat(window.getComputedStyle(document.querySelector('.pt-2')).height) - 50 + 'px'
  vm.style = {
    border: 0,
    width: '100%',
    minHeight: vm.height
  }

  vm.url = $sce.trustAsResourceUrl($stateParams.visitUrl);
})
