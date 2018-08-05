'use strict';

angular.module('com.app').controller('CiResultSampleCategoryCtrl', function (CiResultRecordService, toastr) {
  var vm = this;

  vm.query = {
    reportId: null,
    receiveSampleId: null
  };

  vm.searchObject = {};
  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'reset') {
      vm.searchObject.reset = true;
    }
  }

  vm.status = 0;
  vm.samples = [];
  vm.loading = true;
  vm.getSampleList = function (tableState) {
    var orderBy = tableState.sort.predicate;
    var reverse = tableState.sort.reverse ? 'desc' : 'asc';
    if (orderBy == 'reportId') {
      orderBy = 'report_id'
    } else if (orderBy == 'finishDate') {
      orderBy = 'finish_date'
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
        var now = new Date().getTime()
        var day = 1000*3600*24
        vm.samples = response.data.entity.list.map(function (sample, idx) {
          var date = new Date(sample.finishDate).getTime()
          var interval = (date - now) / day

          if (interval <= 0) {
            sample.emergency = 0
            sample.status = '已过期'
          } else if (interval <= 1) {
            sample.emergency = 1
            sample.status = '紧急'
          } else if (interval <= 3) {
            sample.emergency = 2
            sample.status = '急迫'
          } else if (interval <= 7) {
            sample.emergency = 3
            sample.status = '告警'
          } else {
            sample.emergency = 4
            sample.status = '一般'
          }
          return sample
        })
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
    vm.refreshTable('reset');
  }
  
  vm.eventSearch=function(e){
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
      vm.search();
    }
  }
});
