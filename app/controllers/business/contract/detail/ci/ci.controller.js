'use strict';

angular.module('com.app').controller('ContractDetailCiCtrl', function ($rootScope, $scope, $stateParams, $uibModal, $q, api, CheckItemService, ContractService, toastr, dialog) {
  var vm = this;
  vm.hasAddItemAuth = api.permissionArr.indexOf('CONTRACT-UPDATE-1') != -1;

  var setting = {
    callback: {
      onExpand: expandNode,
      onClick: clickNode
    }
  }

  vm.catalogLoading = true;
  $scope.$emit('refreshContract');

  vm.getContractInfo = function () {
    vm.ciLoading = true;
    ContractService.getContractInfo($stateParams.id).then(function (response) {
      vm.ciLoading = false;
      if (response.data.success) {
        vm.contract = response.data.entity;

        var checkItemArr = vm.contract.detectProject ? vm.contract.detectProject.split(',') : [];
        if (checkItemArr.length > 0) {
          vm.ciLoading = true;
        }
        vm.getContractCi(checkItemArr);
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      vm.ciLoading = false;
      toastr.error(err.data);
    });
  }
  vm.getContractInfo();

  CheckItemService.getChildCatalog('-1').then(function (response) {
    vm.catalogLoading = false;
    var data = response.data.entity;
    angular.forEach(data, function (item) {
      angular.merge(item, {name: item.productName, isParent: item.isCatalog=='1'})
    });
    vm.tree = $.fn.zTree.init($("#inspectTree"), setting, data);
  });

  vm.getContractCi = function (arr) {
    var num = 0;
    vm.checkItems = [];
    var tempArr = [];
    angular.forEach(arr, function (id) {
      num += 1;
      (function (id) {
        CheckItemService.getCheckItemInfo(id).then(function (response) {
          tempArr.push(response.data.entity);
          if (num >= arr.length) {
            vm.ciLoading = false;
            vm.checkItems = tempArr;
          }
        })
      })(id)
    })
  }

  function expandNode (event, treeId, treeNode) {
    if (!treeNode.children) {
      $('#' + treeNode.tId).find("#" + treeNode.tId + '_ico').removeClass().addClass('button ico_loading');
      CheckItemService.getChildCatalog(treeNode.id).then(function (response) {
        $('#' + treeNode.tId).find("#" + treeNode.tId + '_ico').removeClass().addClass('button ico_open');
        if (response.data.success) {
          var data = response.data.entity;
          angular.forEach(data, function (item) {
            if (item.isCatalog == '1') {
              // 目录节点
              angular.merge(item, {name: item.productName, isParent: true})
            } else {
              // 检测项集合节点
              angular.merge(item, {name: item.productName})
            }
            vm.tree.addNodes(treeNode, -1, item);
          })
        }
      })
    }
  }

  function addCheckItems (arr) {
    if (!vm.contract.detectProject) {
      var existArr = arr;
    } else {
      var existArr = vm.contract.detectProject.split(',');
      for (var i=0,len=arr.length; i<len; i++) {
        if (existArr.indexOf(arr[i]) == -1) {
          existArr.push(arr[i]);
        }
      }
    }
    var data = angular.merge(vm.contract, {detectProject: existArr.join(',')});
    ContractService.editContract(vm.contract.id, data).then(function () {
      vm.getContractCi(vm.contract.detectProject ? vm.contract.detectProject.split(',') : []);
      toastr.success('添加成功！');
    });
  }

  // 点击检测性集合节点，弹出集合在的检测项供用户添加
  function clickNode (event, treeId, treeNode) {
    if (treeNode.isCatalog == '0') {
      vm.selectedNode = treeNode;
      var modalInstance = $uibModal.open({
        animation: true,
        size: 'lg',
        backdrop: 'static',
        templateUrl: 'controllers/business/contract/detail/ci/catalog-ci/catalogCi.html',
        controller: 'BusinessCatalogCiCtrl as vm',
        resolve: {
          checkItems: [function () {
            var defered = $q.defer();
            $rootScope.loading = true;
            CheckItemService.getCatalogCiList(treeNode.id).then(function (response) {
              $rootScope.loading = false;
              if (response.data.success) {
                defered.resolve(response.data.entity);
              } else {
                defered.reject('');
                toastr.error(response.data.message);
              }
            }).catch(function (err) {
              $rootScope.loading = false;
              defered.reject('');
              toastr.error(err.data);
            });
            return defered.promise;
          }]
        }
      });

      modalInstance.result.then(function (res) {
        addCheckItems(res);
      })
    } else {
      vm.selectedNode = null;
    }


  }


  // 弹出数据库中所有检测项供用户添加
  vm.addContractCI = function () {

 		var modalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      backdrop: 'static',
      templateUrl: 'controllers/checkItem/manage/add-checkitem/addCheckItem.html',
      controller: 'CustomAddCatalogCiCtrl as vm'
    });

    modalInstance.result.then(function (res) {
      addCheckItems(res);
    });
  }

  vm.delete = function (ci) {
    var result = dialog.confirm('确认从合同中删除检测项 ' + ci.name + ' ?');
    result.then(function (res) {
      if (res) {
        var existArr = vm.contract.detectProject.split(',');
        existArr.splice(existArr.indexOf(ci.id), 1);
        var data = angular.merge(vm.contract, {detectProject: existArr.join(',')});
        ContractService.editContract(vm.contract.id, data).then(function (response) {
          if (response.data.success) {
            vm.getContractCi(vm.contract.detectProject ? vm.contract.detectProject.split(',') : []);
            toastr.success('合同检测项删除成功！');
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
