'use strict';

angular.module('com.app').controller('TmplListCtrl', function ($uibModal, api, TemplateService, toastr, dialog) {
  var vm = this;

  var funcBC = api.breadCrumbMap.func;
  vm.breadCrumbArr = [funcBC.root, funcBC.template];

  vm.searchObject = {
    searchKeywords: ''
  }

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    }
  }

  vm.tmpls = [];
  vm.loading = true;
  vm.getTmplList = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
    TemplateService.getTemplateList(tableParams, vm.searchObject.searchKeywords).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.tmpls = response.data.entity.list;
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

  
  vm.delete = function (template) {
    var result = dialog.confirm('确认删除模板 ' + template.name + ' ?');
    result.then(function (res) {
      if (res) {
        TemplateService.deleteTemplate(template.id).then(function (response) {
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

});
