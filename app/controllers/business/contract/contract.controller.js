'use strict';

angular.module('com.app').controller('ContractCtrl', function ($scope, $state, $uibModal, $timeout, api, dialog, toastr, ContractService) {
  var vm = this;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.contract.root];

  vm.searchObject = {
    searchKeywords: ''
  }

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    } else if (flag == 'toggle') {
      vm.searchObject.toggle = true;
    }
  }

  vm.statusFilter = 'all';
  vm.contracts = [];
  vm.getContractList = function (tableState) {
    vm.loading = true;
    vm.total = 0;
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
      "orderBy": tableState.sort.predicate,
      "reverse": tableState.sort.reverse
    }, tempTotal = 0;
  	ContractService.getContractList(tableParams, vm.searchObject.searchKeywords).then(function (response) {
      if (response.data.success) {
        vm.tempContracts = response.data.entity.list;
        tempTotal = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;
      } else {
        tempTotal = 0;
        toastr.error(response.data.message);
      }
  	}).then(function () {
      // 获取用户相关流程
      if (vm.statusFilter == 'unhandled') {  // 代办
        return ContractService.getUserTask(api.userInfo.id, '联合审批', '0');
        // return ContractService.getUserTask(api.userInfo.id, '修改合同', '0');
      } else if (vm.statusFilter == 'done') {  // 已办
        return ContractService.getUserTask(api.userInfo.id, '联合审批', '1');
        // return ContractService.getUserTask(api.userInfo.id, '修改合同', '1');
      } else {
        return {
          data: {
            success: true,
            entity: []
          }
        }
      }
    }).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.userTasks = response.data.entity;
        /*
         ** 若用户有合同的审批任务，则将任务信息放入合同中，
         ** 即合同存在task，则表明该合同是用户的代办项
         */
        angular.forEach(vm.tempContracts, function (contract) {
          angular.forEach(vm.userTasks, function (task) {
            if (contract.processId == task.processInstanceId) {
              contract.task = task;
            }
          })
        });
        /* 列出所有合同，不过滤 */
        if (vm.statusFilter == 'all') {
          vm.contracts = angular.copy(vm.tempContracts);
        /* 列出待办合同，根据是否存在task和状态过滤 */
        } else if (vm.statusFilter == 'unhandled') {
          vm.contracts = [];
          angular.forEach(vm.tempContracts, function (contract) {
            if (contract.task && (contract.status == 1 || contract.status == 2)) {
              vm.contracts.push(contract);
            } else {
              tempTotal -= 1;
            }
          })
        /* 列出已办合同，根据是否存在task和状态过滤 */
        } else if (vm.statusFilter == 'done') {
          vm.contracts = [];
          angular.forEach(vm.tempContracts, function (contract) {
            if (contract.task && contract.status == 3) {
              vm.contracts.push(contract);
            } else {
              tempTotal -= 1;
            }
          })
        }
        vm.total = tempTotal;
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
  		vm.loading = false;
      toastr.error(err.data);
  	})
  }

  vm.searchStatus = function (filter) {
    if (vm.statusFilter != filter) {
      vm.statusFilter = filter;
      vm.refreshTable('toggle');
    }
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
        contractId: function () {return id;},
        users: ['$rootScope', '$q', 'PrivilegeService', function ($rootScope, $q, PrivilegeService) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          PrivilegeService.getContractCommentUsers().then(function (response) {
            if (response.data.success) {
              deferred.resolve(response.data.entity);
            } else {
              deferred.reject();
              toastr.error(response.data.message);
            }
          }).catch(function (err) {
            deferred.reject();
            toastr.error(err.data);
          });
          return deferred.promise;
        }]
      }
  	});

    modalInstance.result.then(function () {
      $timeout(function () {
        vm.refreshTable();
        toastr.success('合同流程发起成功！');
      }, 500);
    })
  }

  vm.recordComment = function (contract) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/contract/record-comment/recordComment.html',
      controller: 'RecordCommentCtrl as vm',
      resolve: {
        contractId: function () {return contract.id;},
        taskId: function () {return contract.task.id}
      }
    })

    modalInstance.result.then(function (res) {
      if (res.approve == 'false') {
        toastr.warning('您已驳回合同审批！');
      } else {
        toastr.success('您已通过合同审批！');
      }
      vm.refreshTable();
    })
  }

  vm.delete = function (contract) {
    var result = dialog.confirm('确认删除合同 ' + contract.protocolId + ' ?');
    result.then(function (res) {
      if (res) {
        ContractService.deleteContract(contract.id).then(function (response) {
          if (response.data.success) {
            vm.refreshTable('delete');
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
