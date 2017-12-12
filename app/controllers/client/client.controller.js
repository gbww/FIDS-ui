'use strict';

angular.module('com.app').controller('ClientCtrl', function ($uibModal, api, dialog, toastr, ClientService) {
  var vm = this;

  vm.breadCrumbArr = [api.breadCrumbMap.client.root];

  vm.searchObject = {
    searchKeywords: ''
  }

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
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

    ClientService.getClientList(tableParams, vm.searchObject.searchKeywords).then(function (response) {
    	vm.loading = false;
      if (response.data.success) {
        angular.forEach(response.data.entity.list, function (client) {
          var area = client.clientAddress.split(',');
          if (area[0] == area[1]) {
            client.address = area[0] + area[2];
          } else {
            client.address = area.join('');
          }
        })
        vm.clients = response.data.entity.list;
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
    vm.searchObject.searchKeywords = vm.query;
  }

  vm.eventSearch=function(e){
    var keycode = window.event ? e.keyCode : e.which;
    if (keycode == 13) {
      vm.search();
    }
  }


  vm.create = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/client/create/create.html',
      controller: 'ClientCreateCtrl as vm'
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("客户创建成功！");
    })
  }

  vm.edit = function (client) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/client/edit/edit.html',
      controller: 'ClientEditCtrl as vm',
      resolve: {
        client: function () { return angular.copy(client); }
      }
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("客户信息修改成功！");
    })
  }

  vm.delete = function (client) {
    var result = dialog.confirm('确认删除客户 ' + client.clientName + ' ?');
    result.then(function (res) {
      if (res) {
        ClientService.deleteClient([client.clientNum]).then(function (response) {
          if (response.data.success) {
            vm.refreshTable('delete');
            toastr.success('客户删除成功！');
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
