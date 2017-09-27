'use strict';

angular.module('com.app').controller('TemplateListCtrl', function ($uibModal, api, TemplateService, toastr) {
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
  		templateUrl: 'controllers/func/template/upload/upload.html',
  		controller: 'TemplateUploadCtrl as vm',
      resolve: {
        typeMap: function () {
          var coverType = [], reportType = [];
          angular.forEach(vm.templates, function (item) {
            if (item.category == '0') {
              coverType.push(item.type);
            } else if (item.category == '1') {
              reportType.push(item.type);
            }
          })
          return {
            coverType: coverType,
            reportType: reportType
          }
        }
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
      templateUrl: 'controllers/func/template/edit/edit.html',
      controller: 'TemplateEditCtrl as vm',
      resolve: {
        template: function () {return angular.copy(item);},
        typeMap: function () {
          var coverType = [], reportType = [];
          angular.forEach(vm.templates, function (item) {
            if (item.category == '0') {
              coverType.push(item.type);
            } else if (item.category == '1') {
              reportType.push(item.type);
            }
          })
          return {
            coverType: coverType,
            reportType: reportType
          }
        }
      }
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("模板修改成功！");
    })
  }


});
