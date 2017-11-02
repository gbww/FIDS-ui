'use strict';

angular.module('com.app').controller('TemplateListCtrl', function ($uibModal, api, TemplateService, toastr, dialog) {
  var vm = this;

  var funcBC = api.breadCrumbMap.func;
  vm.breadCrumbArr = [funcBC.root, funcBC.template];

  vm.searchObject = {
    searchKeywords: ''
  }

  vm.refreshTable = function () {
    vm.searchObject.timestamp = new Date();
  }

  vm.templates = [];
  vm.getTemplateList = function (tableState) {
    vm.loading = true;
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
    TemplateService.getTemplateList(tableParams, vm.searchObject.searchKeywords).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.templates = response.data.entity.list;
        vm.total = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;
      } else {
        vm.total = 0;
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    })
  }

  vm.search=function(){
    vm.searchObject.searchKeywords = vm.query;
  }
  vm.eventSearch=function(e){
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
      vm.searchObject.searchKeywords = vm.query;
    }
  }

  vm.upload = function () {
		var modalInstance = $uibModal.open({
  		animation: true,
  		size: 'md',
  		backdrop: 'static',
  		templateUrl: 'controllers/file/template/upload/upload.html',
  		controller: 'TemplateUploadCtrl as vm'
  	});

  	modalInstance.result.then(function () {
      vm.refreshTable();
		  toastr.success("模板上传成功！");
  	})
  }

  vm.edit = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/file/template/edit/edit.html',
      controller: 'TemplateEditCtrl as vm',
      resolve: {
        template: function () {return angular.copy(item);}
      }
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("模板修改成功！");
    })
  }

  vm.delete = function (template) {
    var result = dialog.confirm('确认删除模板 ' + template.name + ' ?');
    result.then(function (res) {
      if (res) {
        TemplateService.deleteTemplate(template.id).then(function (response) {
          if (response.data.success) {
            vm.refreshTable();
            toastr.success('模板删除成功！');
          } else {
            toastr.error(response.data.message);
          }
        }).catch(function (error) {
          toastr.error(error.data.message)
        });
      }
    })
  }

  vm.showTutorial = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      templateUrl: 'controllers/file/template/tutorial/tutorial.html',
      controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        $scope.cancel = function () {
          $uibModalInstance.close();
        }
      }]
    });
  }

});
