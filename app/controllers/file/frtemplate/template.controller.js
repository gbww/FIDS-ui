'use strict';

angular.module('com.app').controller('FrTemplateListCtrl', function ($uibModal, api, FrTemplateService, toastr, dialog) {
  var vm = this;

  var funcBC = api.breadCrumbMap.func;
  vm.breadCrumbArr = [funcBC.root, funcBC.frtemplate];

  vm.searchObject = {}

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    } else if (flag === 'reset') {
      vm.searchObject.reset = true
    }
  }

  vm.templates = [];
  vm.loading = true;
  vm.getTemplateList = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
    FrTemplateService.getTemplateList(tableParams, vm.query).then(function (response) {
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
    vm.refreshTable('reset')
  }
  vm.eventSearch=function(e){
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
      vm.search()
    }
  }

  vm.upload = function () {
		var modalInstance = $uibModal.open({
  		animation: true,
  		size: 'md',
  		backdrop: 'static',
  		templateUrl: 'controllers/file/frtemplate/upload/upload.html',
      controller: 'FrTemplateUploadCtrl as vm',
      resolve: {
        roles: ['$q', 'PrivilegeService', function ($q, PrivilegeService) {
          var deferred = $q.defer();
          PrivilegeService.getRoleList().then(function (response) {
            if (response.data.success) {
              deferred.resolve(response.data.entity);
            } else {
              deferred.reject()
            }
          }).catch(function () {
            deferred.reject()
          })
          return deferred.promise;
        }]
      }
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
      templateUrl: 'controllers/file/frtemplate/edit/edit.html',
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
        FrTemplateService.deleteTemplate(template.id).then(function (response) {
          if (response.data.success) {
            vm.refreshTable('delete');
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
