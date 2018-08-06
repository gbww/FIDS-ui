
'use strict';

angular.module('com.app').controller('QuotationController', function (api, toastr, QuotationService) {
  var vm = this;

  vm.breadCrumbArr = [api.breadCrumbMap.quotation.root];

  vm.searchObject = {}

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    } else if (flag === 'reset') {
      vm.searchObject.reset = true
    }
  }

  vm.quotations = [];
  vm.loading = true;
  vm.getQuotationList = function (tableState) {
    var orderBy = tableState.sort.predicate;
    var reverse = tableState.sort.reverse ? 'desc' : 'asc';
    if (orderBy == 'quotationName') {
      orderBy = 'quotation_name'
    } else if (orderBy == 'createdAt') {
      orderBy = 'created_at'
    }
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
      "order": orderBy ? [orderBy, reverse].join(' ') : null
    };

    QuotationService.getQuotationList(tableParams, vm.query).then(function (response) {
    	vm.loading = false;
      if (response.data.success) {
        vm.quotations = response.data.entity.list;
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
    vm.refreshTable('reset')
  }

  vm.eventSearch=function(e){
    var keycode = window.event ? e.keyCode : e.which;
    if (keycode == 13) {
      vm.search();
    }
  }
});