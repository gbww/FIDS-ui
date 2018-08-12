'use strict';

angular.module('com.app').controller('ContractCtrl', function ($scope, $state, $stateParams, $uibModal, $timeout, api, dialog, toastr, ContractService) {
  var vm = this;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.contract.root];

  vm.searchObject = {}

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    } else if (flag == 'reset') {
      vm.searchObject.reset = true;
    }
  }

  vm.pageNum = parseInt($stateParams.pageNum) || null
  vm.pageSize = parseInt($stateParams.pageSize) || null
  vm.orderBy = $stateParams.orderBy || null
  vm.reverse = $stateParams.reverse === 'true'
  vm.query = $stateParams.sampleName || ''
  vm.type = $stateParams.type || 'enterprise';
  vm.statusFilter = $stateParams.status || 'all';

  vm.contracts = [];
  vm.loading = true;
  vm.getContractList = function (tableState) {
    var orderBy = tableState.sort.predicate;
    var reverse = tableState.sort.reverse ? 'desc' : 'asc';
    if (orderBy == 'detectType') {
      orderBy = 'detect_type'
    } else if (orderBy == 'createdAt') {
      orderBy = 'created_at'
    }
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
      "order": orderBy ? [orderBy, reverse].join(' ') : null
    };
    var isHandle = null, total = 0;
    if (vm.statusFilter === 'unhandled') {
      isHandle = '0';
    } else if (vm.statusFilter === 'done') {
      isHandle = '1';
    }

    vm.pageNum = tableParams.pageNum
    vm.pageSize = tableParams.pageSize
    vm.orderBy = tableState.sort.predicate
    vm.reverse = tableState.sort.reverse
    vm.sampleName = vm.query

    ContractService.getContractList(tableParams, vm.query, vm.type, isHandle).then(function (response) {
      vm.loading = false;
      total = response.data.entity.total;
      var tempContracts = [];
      if (response.data.success) {
        angular.forEach(response.data.entity.list, function (item) {
          if (vm.statusFilter !== 'all') {
            if (item.task[0]) {
              tempContracts.push(angular.merge({}, item.contract, {task: true}));
            } else {
              total -= 1;
            }
          } else {
            tempContracts.push(item.contract);
          }
        });

        vm.contracts = tempContracts;

        vm.total = total;
        tableState.pagination.numberOfPages = response.data.entity.pages;
      } else {
        tempTotal = 0;
        toastr.error(response.data.message);
      }
      
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

    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    })
  }

  vm.toggleType = function (type) {
    if (vm.type === type) {
      return;
    }
    vm.statusFilter = 'all';
    if (type === 'enterprise') {
      vm.type = 'enterprise';
    } else if (type === 'government') {
      vm.type = 'government';
    } else {
      vm.type = 'pb';
    }
    vm.refreshTable('reset');
  }

  vm.searchStatus = function (filter) {
    if (vm.statusFilter != filter) {
      vm.statusFilter = filter;
      vm.refreshTable('reset');
    }
  }

  vm.search=function(){
    vm.refreshTable('reset')
  }
  vm.eventSearch=function(e){
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
      vm.search()
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
        toastr.warning('您已驳回合同审批！', '警告');
      } else {
        toastr.success('您已通过合同审批！');
      }
      vm.refreshTable();
    })
  }

  vm.delete = function (contract) {
    var result = dialog.confirm('确认删除合同 ' + contract.id + ' ?');
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
