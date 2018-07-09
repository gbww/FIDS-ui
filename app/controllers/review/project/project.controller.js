'use strict';

angular.module('com.app').controller('ReviewProjectCtrl', function ($uibModal, api, ReviewService, toastr, dialog) {
  var vm = this;

  var reviewBC = api.breadCrumbMap.review;
  vm.breadCrumbArr = [reviewBC.root, reviewBC.project];

  vm.searchObject = {
    searchKeywords: ''
  }

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    }
  }

  vm.projects = [];
  vm.loading = true;
  vm.getProjectList = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
    ReviewService.getProjectList(tableParams, vm.searchObject.searchKeywords).then(function (response) {
      vm.loading = false;
      // vm.projects = [
      //   {
      //     id: 1, comType: '食品销售', projectName: 'name', numberRegulation: 'numberRegulation',
      //     content: 'content', standardScore: 8, checkWay: 'checkWay'
      //   }
      // ]
      // vm.total = 1;
      // tableState.pagination.numberOfPages = 1;
      if (response.data.success) {
        vm.projects = response.data.entity.list;
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

  vm.showInfo = function (evt) {
    $(evt.target).tooltip('show')
  }

});
