'use strict';

angular.module('com.app').controller('ContractCtrl', function ($scope, $state, $uibModal, api, dialog, toastr, ContractService) {
  var vm = this;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.contract.root];

  vm.searchObject = {
    searchKeywords: ''
  }

  vm.refreshTable = function () {
    vm.searchObject.timestamp = new Date();
  }

  vm.contracts = [];
  vm.loading = true;
  vm.getContractList = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
  	ContractService.getContractList(tableParams, vm.searchObject.searchKeywords).then(function (response) {
      if (response.data.success) {
        vm.contracts = response.data.entity.list;
        vm.total = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;
      } else {
        vm.total = 0;
        toastr.error(response.data.message);
      }
  	}).then(function () {
      // 获取用户相关流程
      return ContractService.getUserTask(api.userInfo.id, '联合审批');
    }).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.userTasks = response.data.entity;
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
  		vm.loading = false;
      toastr.error(err.data.message);
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

  vm.goDetail = function (id, tab) {
    if (tab == 'info') {
      $state.go('app.business.contract.detail.info', {id: id});
    } else if (tab == 'comment') {
      $state.go('app.business.contract.detail.comment', {id: id});
    } else if (tab == 'ci') {
      $state.go('app.business.contract.detail.ci', {id: id});
    }
  }

  // 发起评审流程
  vm.startCommentProcess = function (id) {
  	var modalInstance = $uibModal.open({
  		animation: true,
  		size: 'md',
  		backdrop: 'static',
  		templateUrl: 'controllers/business/contract/start-comment-process/startCommentProcess.html',
  		controller: 'StartCommentProcessCtrl as vm',
      resolve: {
        contractId: function () {return id;}
      }
  	})
  }

  vm.recordComment = function (id) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/contract/record-comment/recordComment.html',
      controller: 'RecordCommentCtrl as vm',
      resolve: {
        contractId: function () {return id;},
        taskId: function () {return vm.userTasks[0].id}
      }
    })

    modalInstance.result.then(function (res) {
      vm.goDetail(id, 'comment');
    })
  }

  vm.delete = function (contract) {
    var result = dialog.confirm('确认删除合同 ' + contract.sampleName + ' ?');
    result.then(function (res) {
      if (res) {
        ContractService.deleteContract(contract.id).then(function (response) {
          if (response.data.success) {
            vm.refreshTable();
            toastr.success('合同删除成功！');
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
