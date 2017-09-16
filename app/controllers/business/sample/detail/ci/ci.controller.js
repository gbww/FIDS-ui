'use strict';

angular.module('com.app').controller('SampleDetailCiCtrl', function ($rootScope, $scope, $uibModal, $q, CheckItemService, SampleService, toastr, dialog) {
  var vm = this;

  var setting = {
    callback: {
      onExpand: expandNode,
      onClick: clickNode
    }
  }


  $scope.$emit('refreshSample');
  $scope.$on('sampleInfo', function (event, sample) {
    vm.sample = sample;
    CheckItemService.getCICatalogInfo('1').then(function (response) {
      var data = response.data.entity;
      angular.merge(data, {name: data.productName, isParent: data.isCatalog=='1'})
      vm.tree = $.fn.zTree.init($("#inspectTree"), setting, data);
      vm.getSampleCi();
  	})
  })

  vm.getSampleCi = function () {
    vm.ciLoading = true;
    SampleService.getSampleCiList(vm.sample.receiveSampleId).then(function (response) {
      vm.ciLoading = false;
      if (response.data.success) {
        vm.checkItems = response.data.entity;
      } else {
        toastr.error(response.data.message);
      }
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

  function addCheckItems (checkItems, isDb) {
    var data = [];
    if (isDb) {
      angular.forEach(checkItems, function (item) {
        item.receiveSampleId = vm.sample.receiveSampleId;
        delete item.id;
      });
      data = [].concat(checkItems);
    } else {
      angular.forEach(checkItems, function (item) {
        var tempItem = {
          receiveSampleId: vm.sample.receiveSampleId,
          name: item.name,
          method: item.method,
          unit: item.unit,
          standardValue: item.standard_value,
          detectionLimit: item.detection_limit,
          quantitationLimit: item.quantitation_limit,
          device: item.device,
          defaultPrice: item.default_price
        }
        data.push(tempItem);
      });
    }
    SampleService.updateSampleCi(vm.sample.receiveSampleId, data).then(function (response) {
      if (response.data.success) {
        vm.getSampleCi();
        toastr.success('添加成功！');
      } else {
        toastr.error(response.data.message);
      }
    })
  }

  // 点击检测性集合节点，弹出集合在的检测项供用户添加
  function clickNode (event, treeId, treeNode) {
    if (treeNode.isCatalog == '0') {
      vm.selectedNode = treeNode;
      var modalInstance = $uibModal.open({
        animation: true,
        size: 'lg',
        backdrop: 'static',
        templateUrl: 'controllers/business/sample/detail/ci/catalog-ci/catalogCi.html',
        controller: 'SampleAddCatalogCiCtrl as vm',
        resolve: {
          checkItems: [function () {
            var defered = $q.defer();
            $rootScope.loading = true;
            CheckItemService.getCheckItemsTree(treeNode.id).then(function (response) {
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
              toastr.error(err.data.message);
            });
            return defered.promise;
          }]
        }
      });

      modalInstance.result.then(function (checkItems) {
        addCheckItems(checkItems);
      })
    } else {
      vm.selectedNode = null;
    }
  }


  // 弹出数据库中所有检测项供用户添加
  vm.addSampleCI = function () {
 		var modalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      backdrop: 'static',
      templateUrl: 'controllers/business/sample/detail/ci/db-ci/dbCi.html',
      controller: 'SampleAddDbCiCtrl as vm'
    });

    modalInstance.result.then(function (checkItems) {
      addCheckItems(checkItems, 'db');
    });
  }

  vm.edit = function (ci) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      backdrop: 'static',
      templateUrl: 'controllers/business/sample/detail/ci/edit/edit.html',
      controller: 'EditSampleCiCtrl as vm',
      resolve: {
        sampleId: function () {return vm.sample.receiveSampleId;},
        checkItem: function () {return ci;}
      }
    });

    modalInstance.result.then(function (res) {
      toastr.success('检测项修改成功！');
      vm.getSampleCi();
    });
  }

  vm.delete = function (ci) {
    var result = dialog.confirm('确认从接样单中删除检测项 ' + ci.name + ' ?');
    result.then(function (res) {
      if (res) {
        SampleService.deleteSampleCi(vm.sample.receiveSampleId, [ci.id]).then(function (response) {
          if (response.data.success) {
            vm.getSampleCi();
            toastr.success('接样单检测项删除成功！');
          } else {
            toastr.error(response.data.message);
          }
        }).catch(function (error) {
          toastr.error(error.data.message)
        });
      }
    })
  }

  vm.distribute = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/sample/detail/ci/distribute/distribute.html',
      controller: 'CiDistributeCtrl as vm',
      resolve: {
        sampleId: function () {return vm.sample.receiveSampleId;},
        checkItem: function () {return item;}
      }
    });

    modalInstance.result.then(function (res) {
      toastr.success('检测项分配成功！');
      vm.getSampleCi();
    });
  }

});
