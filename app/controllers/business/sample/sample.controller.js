'use strict';

angular.module('com.app').controller('SampleCtrl', function ($rootScope, $scope, $state, $cookies, $uibModal, $timeout, api, dialog, toastr, SampleService, CheckItemService) {
  var vm = this;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.sample.root];
  vm.hasAddItemAuth = api.permissionArr.indexOf('SAMPLE-ADDITEM-1') != -1;

  vm.clonedSampleId = $cookies.get('clonedSampleId');
  vm.searchObject = {}

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    } else if (flag == 'toggle') {
      vm.searchObject.toggle = true;
    }
  }

  vm.searchConditions = {
    reportId: null,
    sampleName: null,
    entrustedUnit: null,
    inspectedUnit: null,
    productionUnit: null,
    receiveSampleId: null,
    executeStandard: null
  };
  vm.reportIdArr = [], vm.sampleNameArr = [], vm.entrustedUnitArr = [], vm.inspectedUnitArr = [],
  vm.productionUnitArr = [], vm.sampleIdArr = [], vm.exeStandardArr =[];

  vm.status = 0;
  vm.samples = [];
  vm.loading = true;
  vm.ciLoading = true;
  vm.getSampleList = function (tableState) {

    var orderBy = tableState.sort.predicate;
    var reverse = tableState.sort.reverse ? 'desc' : 'asc';
    if (orderBy == 'reportId') {
      orderBy = 'report_id';
    } else if (orderBy == 'createdAt') {
      orderBy = 'created_at';
    }

    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
      "order": orderBy ? [orderBy, reverse].join(' ') : null
    }
  	SampleService.getSampleList(tableParams, vm.searchObject, vm.status).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.samples = response.data.entity.list;
        vm.total = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;

        if (vm.samples.length > 0) {
          vm.selectedSample = vm.samples[0];
          vm.getSampleCi();
        } else {
          vm.ciLoading = false;
          vm.checkItems = [];
        }
        angular.forEach(vm.samples, function (item) {
          if (vm.reportIdArr.indexOf(item.reportId) == -1) {
            vm.reportIdArr.push(item.reportId);
          }
          if (vm.sampleIdArr.indexOf(item.receiveSampleId) == -1) {
            vm.sampleIdArr.push(item.receiveSampleId);
          }
          if (item.sampleName && vm.sampleNameArr.indexOf(item.sampleName) == -1) {
            vm.sampleNameArr.push(item.sampleName);
          }
          if (item.entrustedUnit && vm.entrustedUnitArr.indexOf(item.entrustedUnit) == -1) {
            vm.entrustedUnitArr.push(item.entrustedUnit);
          }
          if (item.inspectedUnit && vm.inspectedUnitArr.indexOf(item.inspectedUnit) == -1) {
            vm.inspectedUnitArr.push(item.inspectedUnit);
          }
          if (item.productionUnit && vm.productionUnitArr.indexOf(item.productionUnit) == -1) {
            vm.productionUnitArr.push(item.productionUnit);
          }
          if (item.executeStandard && vm.exeStandardArr.indexOf(item.executeStandard) == -1) {
            vm.exeStandardArr.push(item.executeStandard);
          }
        })
      } else {
        vm.total = 0;
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
  		vm.loading = false;
      toastr.error(err.data);
  	})
  }

  vm.searchStatus = function (filter) {
    if (vm.status != filter) {
      vm.status = filter;
      vm.refreshTable('toggle');
    }
  }

  vm.back = function () {
    vm.advance = false;
    angular.merge(vm.searchConditions, {
      sampleName: null,
      entrustedUnit: null,
      inspectedUnit: null,
      productionUnit: null,
      receiveSampleId: null,
      executeStandard: null
    });
  }

  vm.reset = function () {
    angular.merge(vm.searchConditions, {
      reportId: null,
      sampleName: null,
      entrustedUnit: null,
      inspectedUnit: null,
      productionUnit: null,
      receiveSampleId: null,
      executeStandard: null
    });

  }

  vm.search=function(){
    vm.searchObject = angular.copy(vm.searchConditions);
  }

  vm.eventSearch=function(e){
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
      vm.search();
    }
  }

  vm.selectSample = function (sample) {
    if (angular.equals(vm.selectedSample, sample)) {
      return;
    }
    vm.selectedSample = sample;
    vm.getSampleCi();
  }

  /* 防止事件冒泡到 vm.selectSample */
  vm.toggleDropdown = function (event) {
    event.stopPropagation();
    var $group = $(event.target).parents('.btn-group');
    var status = $group.find('.dropdown-menu').css('display');
    $('.btn-group').removeClass('open');
    if (status == 'none') {
      $group.addClass('open');
    }

  }
  $(document).click(function () {
    $('.btn-group').removeClass('open');
  });

  vm.clone = function (sample, event) {
    event.stopPropagation();
    vm.clonedSampleId = sample.receiveSampleId
    $cookies.put('clonedSampleId', sample.receiveSampleId);
    toastr.success('复制成功！')
    $('.btn-group').removeClass('open');
  }

  // 离开抽样单页面时，清空复制信息
  $scope.$on('$stateChangeStart', function (event, toState) {
    if (toState.name.indexOf('sample') == -1) {
      $cookies.remove('clonedSampleId');
    }
  })

  vm.goDetail = function (id) {
    $state.go('app.business.sample.detail.info', {id: id});
  }

  vm.delete = function (sample, event) {
    event.stopPropagation();
    $('.btn-group').removeClass('open');
    var result = dialog.confirm('确认删除接样单 ' + sample.receiveSampleId + ' ?');
    result.then(function (res) {
      if (res) {
        SampleService.deleteSample([sample.receiveSampleId]).then(function (response) {
          if (response.data.success) {
            vm.refreshTable('delete');
            toastr.success('接样单删除成功！');
          } else {
            toastr.error(response.data.message);
          }
        }).catch(function (error) {
          toastr.error(error.data.message)
        });
      }
    })
  }

  /*
   ** 接样单检测项
   */

  var setting = {
    callback: {
      onExpand: expandNode,
      onClick: clickNode
    }
  }

  // 树形结构
  vm.catalogLoading = true;
  if (vm.hasAddItemAuth) {
    CheckItemService.getChildCatalog('-1').then(function (response) {
      vm.catalogLoading = false;
      var data = response.data.entity;
      angular.forEach(data, function (item) {
        angular.merge(item, {name: item.productName, isParent: item.isCatalog=='1'})
      })
      vm.tree = $.fn.zTree.init($("#inspectTree"), setting, data);
    })
  }

  // 根据
  vm.checkItems = [];
  vm.getSampleCi = function () {
    vm.ciLoading = true;
    SampleService.getSampleCiList(vm.selectedSample.receiveSampleId).then(function (response) {
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
        item.receiveSampleId = vm.selectedSample.receiveSampleId;
        item.reportId = vm.selectedSample.reportId;
        delete item.id;
      });
      data = [].concat(checkItems);
    } else {
      angular.forEach(checkItems, function (item) {
        var tempItem = {
          reportId: vm.selectedSample.reportId,
          receiveSampleId: vm.selectedSample.receiveSampleId,
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
    $rootScope.loading = true;
    SampleService.updateSampleCi(vm.selectedSample.receiveSampleId, data).then(function (response) {
      $rootScope.loading = false;
      if (response.data.success) {
        vm.getSampleCi();
        toastr.success('添加成功！');
      } else {
        toastr.error(response.data.message);
      }
    })
  }

  vm.appendCI = function () {
    $rootScope.loading = true;
    SampleService.getSampleCiList(vm.clonedSampleId).then(function (response) {
      $rootScope.loading = false;
      if (response.data.success) {
        var checkItems = response.data.entity;
        angular.forEach(checkItems, function (item) {
          item.standard_value = item.standardValue,
          item.detection_limit = item.detectionLimit,
          item.quantitation_limit = item.quantitationLimit,
          item.default_price = item.defaultPrice
        });
        var modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          backdrop: 'static',
          templateUrl: 'controllers/business/sample/detail/ci/catalog-ci/catalogCi.html',
          controller: 'SampleAddCatalogCiCtrl as vm',
          resolve: {
            checkItems: function () {return checkItems}
          }
        });
        modalInstance.result.then(function (res) {
          addCheckItems(res);
        })
      } else {
        toastr.error(response.data.message);
      }
    })
  }

  // 点击检测项集合节点，弹出集合的检测项供用户添加
  function clickNode (event, treeId, treeNode) {
    if (!vm.selectedSample) {
      return;
    }
    if (treeNode.isCatalog == '0') {
      vm.selectedNode = treeNode;
      var modalInstance = $uibModal.open({
        animation: true,
        size: 'lg',
        backdrop: 'static',
        templateUrl: 'controllers/business/sample/detail/ci/catalog-ci/catalogCi.html',
        controller: 'SampleAddCatalogCiCtrl as vm',
        resolve: {
          checkItems: ['$q', function ($q) {
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
              toastr.error(err.data);
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
    if (!vm.selectedSample) {
      return;
    }
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
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/sample/detail/ci/edit/edit.html',
      controller: 'EditSampleCiCtrl as vm',
      resolve: {
        sampleId: function () {return vm.selectedSample.receiveSampleId;},
        checkItem: function () {return ci;}
      }
    });

    modalInstance.result.then(function (res) {
      toastr.success('检测项修改成功！');
      vm.getSampleCi();
    });
  }

  vm.deleteCI = function (ci) {
    var result = dialog.confirm('确认从接样单中删除检测项 ' + ci.name + ' ?');
    result.then(function (res) {
      if (res) {
        SampleService.deleteSampleCi(vm.selectedSample.receiveSampleId, [ci.id]).then(function (response) {
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
        sampleId: function () {return vm.selectedSample.receiveSampleId;},
        checkItems: function () {return [item];},
        departments: ['$q', 'PrivilegeService', function ($q, PrivilegeService) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          PrivilegeService.getOrganizationList().then(function (response) {
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

    modalInstance.result.then(function (res) {
      $timeout(function () {
        toastr.success('检测项分配成功！');
        vm.getSampleCi();
      }, 500)
    });
  }

  vm.batchDistribute = function () {
    if (vm.selectedItems.length === 0) {
      toastr.warning('请选择检测项！');
      return;
    }

    var testRoom = '', testUser = '';
    for (var i=0,len=vm.selectedItems.length; i<len; i++) {
      if (i == 0) {
        testRoom = vm.selectedItems[i].testRoom;
        testUser = vm.selectedItems[i].testUser;
      } else if (testRoom !== vm.selectedItems[i].testRoom || testUser !== vm.selectedItems[i].testUser) {
        toastr.error('请确认所选检测项分配的检测室检测人员为同一人！');
        return;
      }
    }

    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/sample/detail/ci/distribute/distribute.html',
      controller: 'CiDistributeCtrl as vm',
      resolve: {
        sampleId: function () {return vm.selectedSample.receiveSampleId;},
        checkItems: function () {return angular.copy(vm.selectedItems);},
        departments: ['$q', 'PrivilegeService', function ($q, PrivilegeService) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          PrivilegeService.getOrganizationList().then(function (response) {
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
      vm.itemSelected = [], vm.selectedItems = [], vm.allSelected = false;
      toastr.success('检测项分配成功！');
      vm.getSampleCi();
    });
  }

  // 单选、复选
  vm.itemSelected = [];
  vm.selectedItems = [];
  vm.selectAll = function () {
    if (vm.allSelected){
      vm.selectedItems = [];
      angular.forEach(vm.checkItems, function (item, idx) {
        vm.selectedItems.push(item);
        vm.itemSelected[idx] = true;
      });
    } else {
      vm.selectedItems = [];
      angular.forEach(vm.checkItems, function (item, idx) {
        vm.itemSelected[idx] = false;
      });
    }
  }

  vm.selectItem = function (event, idx, item) {
    if(event.target.checked){
      vm.selectedItems.push(item);
      vm.itemSelected[idx] = true;
      if(vm.selectedItems.length == vm.checkItems.length){
        vm.allSelected = true;
      }
    } else {
      for (var i=0,len=vm.selectedItems.length; i<len; i++){
        if (item.name == vm.selectedItems[i].name) {
          vm.selectedItems.splice(i, 1);
          break;
        }
      };
      vm.itemSelected[idx] = false;
      vm.allSelected = false;
    }
  }

});
