'use strict';

angular.module('com.app').controller('DeviceCtrl', function ($uibModal, api, dialog, toastr, ClientService) {
  var vm = this;

  vm.breadCrumbArr = [api.breadCrumbMap.device.root, api.breadCrumbMap.device.detect];

  vm.searchObject = {}

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    } else if (flag === 'reset') {
      vm.searchObject.reset = true
    }
  }

  vm.clients = [];
  vm.loading = true;
  vm.getClientList = function (tableState) {
    var orderBy = tableState.sort.predicate;
    var reverse = tableState.sort.reverse ? 'desc' : 'asc';
    if (orderBy == 'clientName') {
      orderBy = 'client_name'
    } else if (orderBy == 'createdAt') {
      orderBy = 'created_at'
    }
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
      "order": orderBy ? [orderBy, reverse].join(' ') : null
    };

    ClientService.getClientList(tableParams, vm.query).then(function (response) {
    	vm.loading = false;
      if (response.data.success) {
        vm.clients = [
          {
            dwbh: 'J-005',yqmc: '紫外可见分光光度计',xh: 'TU-1901',ccrq: '2012.07.23',ccbh: '21-1901-01-0342',
            sccj: '北京普析通用仪器有限责任公司',jszb: 'Standard',jg: '40000',gzrq: '2012.09',zt: '在用',
            cfks: '综合实验室',syks: '理化',glr: '陈红兵',bz: ''
          },
          {
            dwbh: 'J-001',yqmc: '液相色谱仪',xh: 'Agilent1260infinity LC',ccrq: '2012-11-07',ccbh: 'DEABB05109',
            sccj: '安捷伦科技（中国）有限公司',jszb: '',jg: '381500',gzrq: '2012.11',zt: '在用',
            cfks: '色谱室（一）',syks: '液相',glr: '李维',bz: ''
          },
        ];
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
