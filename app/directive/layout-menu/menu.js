'use strict';

angular.module('com.app').controller('LayoutMenuController', function LayoutMenuController($scope, $state, $stateParams, TemplateService) {
  var vm = this;
  vm.frTemplates = []

  angular.forEach(vm.frTemplates, function (template) {
    vm['is' + template.name + 'Active'] = ($stateParams.name === template.name && $stateParams.visitUrl)
  })

  vm.createDropmenu = function () {
    TemplateService.getFrTemplates().then(function (response) {
			if (response.data.success) {
        vm.frTemplates = response.data.entity.list
        angular.forEach(vm.frTemplates, function (template) {
          vm['is' + template.name + 'Active'] = ($stateParams.name === template.name && $stateParams.visitUrl)
        })
			}
		}).catch(function () {
		});
  }

  vm.open = function (module) {
    $("#accordion").children('.panel').children('ul').collapse('hide');
    if (module == 'dashboard') {
      $state.go('app.dashboard');
    } else if (module == 'client') {
      $state.go('app.client');
    } else if (module == 'unit') {
      $state.go('app.unit');
    } else if (module == 'device') {
      $state.go('app.device');
    } else if (module == 'quotation') {
      $state.go('app.quotation')
    }
  }

  vm.highLightMenu = function(){
  	vm.isDashboardActive = $state.includes('app.dashboard');
    vm.isItemToCheckActive = $state.includes('app.itemToCheck');
    vm.isClientActive = $state.includes('app.client');
    vm.isUnitActive = $state.includes('app.unit');
    vm.isDeviceActive = $state.includes('app.device');

    vm.isCheckItemActive = $state.includes('app.checkItem');
    vm.isCheckItemListActive = $state.includes('app.checkItem.list');
    vm.isCheckItemManageActive = $state.includes('app.checkItem.manage');

    vm.isFileActive = $state.includes('app.file');
    vm.isTemplateActive = $state.includes('app.file.template');
    vm.isFrTemplateActive = $state.includes('app.file.frtemplate');

    vm.isStatisticActive = $state.includes('app.statistic')
    vm.isQuotationActive = $state.includes('app.quotation')

    vm.isReviewActive = $state.includes('app.review');
    vm.isCompanyActive = $state.includes('app.review.company');
    vm.isSearchCompanyActive = $state.includes('app.review.searchCompany');
    vm.isProjectActive = $state.includes('app.review.project');

    vm.isBusinessActive = $state.includes('app.business');
    vm.isBusinessContractActive = $state.includes('app.business.contract');
    vm.isBusinessSampleActive = $state.includes('app.business.sample');
    vm.isBusinessDistributeActive = $state.includes('app.business.distribute');
    vm.isBusinessItemToCheckActive = $state.includes('app.business.itemToCheck');
    vm.isBusinessReportActive = $state.includes('app.business.report');

    vm.isPrivilegeActive = $state.includes('app.privilege');
    vm.isPrivilegeCurrentUserActive = $state.includes('app.privilege.currentUser');
    vm.isPrivilegeOrganizationActive = $state.includes('app.privilege.organization');
    vm.isPrivilegeUserActive = $state.includes('app.privilege.user');
    vm.isPrivilegeRoleActive = $state.includes('app.privilege.role');

  }

  vm.highLightMenu();
  $scope.$on('$stateChangeSuccess', function() {
  	vm.highLightMenu();
    angular.forEach(vm.frTemplates, function (template) {
      vm['is' + template.name + 'Active'] = ($stateParams.name === template.name && $stateParams.visitUrl)
    })
  });
});
