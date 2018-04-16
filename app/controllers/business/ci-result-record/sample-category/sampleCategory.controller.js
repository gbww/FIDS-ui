'use strict';

angular.module('com.app').controller('CiResultSampleCategoryCtrl', function (CiResultRecordService, toastr) {
  var vm = this;

  vm.query = {
    reportId: null,
    receiveSampleId: null
  };

  vm.searchObject = {};
  vm.refreshTable = function () {
    vm.searchObject.timestamp = new Date();
  }

  vm.status = 0;
  vm.samples = [];
  vm.loading = true;
  vm.getSampleList = function (tableState) {
    var orderBy = tableState.sort.predicate;
    var reverse = tableState.sort.reverse ? 'desc' : 'asc';
    if (orderBy == 'reportId') {
      orderBy = 'report_id'
    } else if (orderBy == 'createdAt') {
      orderBy = 'created_at'
    }
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
      "order": orderBy ? [orderBy, reverse].join(' ') : null
    }
    CiResultRecordService.getUserSample(tableParams, vm.status, vm.query).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.samples = response.data.entity.list;
        vm.total = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;
      } else {
        vm.total = 0;
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
  		vm.loading = false;
      toastr.error(err.data);
    });
  }


  vm.search=function(){
    vm.refreshTable();
  }
  
  vm.eventSearch=function(e){
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
      vm.refreshTable();
    }
  }
});
