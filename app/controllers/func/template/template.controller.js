'use strict';

angular.module('com.app').controller('TemplateListCtrl', function ($uibModal, api, TemplateService, toastr) {
  var vm = this;

  var funcBC = api.breadCrumbMap.func;
  vm.breadCrumbArr = [funcBC.root, funcBC.template];

  vm.getTemplateList = function () {
  	TemplateService.getTemplateList().then(function (response) {

  	})
  }

  vm.upload = function () {
		var modalInstance = $uibModal.open({
  		animation: true,
  		size: 'md',
  		backdrop: 'static',
  		templateUrl: 'controllers/func/template/upload/upload.html',
  		controller: 'TemplateUploadCtrl as vm'
  	});

  	modalInstance.result.then(function () {
		  toastr.success("模板上传成功！");
  	})
  }


});
