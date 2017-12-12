'use strict';

angular.module('com.app').controller('ClientDetailLinkCtrl', function ($stateParams, $uibModal, dialog, toastr, ClientService) {
  var vm = this;

  vm.searchObject = {
    searchKeywords: ''
  }

	vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    }
  }

  vm.links = [];
  vm.loading = true;
  vm.getLinkList = function (tableState) {
    var orderBy = tableState.sort.predicate;
    var reverse = tableState.sort.reverse ? 'desc' : 'asc';
    if (orderBy == 'linkmanName') {
      orderBy = 'linkman_name'
    } else if (orderBy == 'createdAt') {
      orderBy = 'created_at'
    }
    var tableParams = {
      "order": orderBy ? [orderBy, reverse].join(' ') : null
    };

    ClientService.getClientLinkList(tableParams, $stateParams.id).then(function (response) {
    	vm.loading = false;
      if (response.data.success) {
        vm.links = response.data.entity || [];
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
  		vm.loading = false;
      toastr.error(err.data);
    });
  }

  vm.create = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/client/detail/link/create/create.html',
      controller: 'ClientLinkCreateCtrl as vm',
      resolve: {
      	clientId: function () {return $stateParams.id}
      }
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("客户联系人创建成功！");
    })
  }

  vm.edit = function (link) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/client/detail/link/edit/edit.html',
      controller: 'ClientLinkEditCtrl as vm',
      resolve: {
        link: function () { return angular.copy(link); }
      }
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("客户联系人信息修改成功！");
    })
  }

  vm.delete = function (link) {
    var result = dialog.confirm('确认删除客户联系人 ' + link.linkmanName + ' ?');
    result.then(function (res) {
      if (res) {
        ClientService.deleteClientLink([link.id]).then(function (response) {
          if (response.data.success) {
            vm.refreshTable('delete');
            toastr.success('客户联系人删除成功！');
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
