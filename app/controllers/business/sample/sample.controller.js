'use strict';

angular.module('com.app').controller('SampleCtrl', function ($rootScope, $scope, $state, $stateParams, $cookies, $uibModal, $timeout, api, dialog, toastr, SampleService, CheckItemService) {
  var vm = this;
  vm.hasAddSampleAuth = api.permissionArr.indexOf('SAMPLE-ADD-1') != -1;
  vm.hasUpdateSampleAuth = api.permissionArr.indexOf('SAMPLE-UPDATESAMPLE-1') != -1;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.sample.root];
  vm.hasAddItemAuth = api.permissionArr.indexOf('SAMPLE-ADDITEM-1') != -1 && api.permissionArr.indexOf('CHECKITEM-CATALOG-SELECT-1') != -1;

  vm.clonedReportId = $cookies.get('clonedReportId');

  vm.searchObject = {}
  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    } else if (flag == 'reset') {
      vm.searchObject.reset = true;
    }
    vm.allSelectedSample = false;
    vm.itemSelectedSample = [];
    vm.selectedItemsSample = [];
  }

  vm.pageNum = parseInt($stateParams.pageNum) || null
  vm.pageSize = parseInt($stateParams.pageSize) || null
  vm.orderBy = $stateParams.orderBy || null
  vm.reverse = $stateParams.reverse === 'true'

  vm.searchConditions = {
    reportId: $stateParams.reportId || null,
    sampleName: $stateParams.sampleName || null,
    entrustedUnit: $stateParams.entrustedUnit || null,
    inspectedUnit: $stateParams.inspectedUnit || null,
    productionUnit: $stateParams.productionUnit || null,
    receiveSampleId: $stateParams.receiveSampleId || null,
    executeStandard: $stateParams.executeStandard || null
  };
  vm.reportIdArr = [], vm.sampleNameArr = [], vm.entrustedUnitArr = [], vm.inspectedUnitArr = [],
  vm.productionUnitArr = [], vm.sampleIdArr = [], vm.exeStandardArr =[];

  vm.status = parseInt($stateParams.status) || 0;
  vm.samples = [];
  vm.loading = true;
  vm.ciLoading = true;
  vm.getSampleList = function (tableState) {

    var orderBy = tableState.sort.predicate;
    var reverse = tableState.sort.reverse ? 'desc' : 'asc';
    if (orderBy == 'reportId') {
      orderBy = 'report_id';
    } else if (orderBy == 'finishDate') {
      orderBy = 'finish_date';
    } else if (orderBy == 'entrustedUnit') {
      orderBy = 'entrusted_unit';
    } else if (orderBy == 'inspectedUnit') {
      orderBy = 'inspected_unit';
    } else if (orderBy == 'receiveSampleId') {
      orderBy = 'receive_sample_id';
    }

    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
      "order": orderBy ? [orderBy, reverse].join(' ') : null
    }

    vm.pageNum = tableParams.pageNum
    vm.pageSize = tableParams.pageSize
    vm.orderBy = tableState.sort.predicate
    vm.reverse = tableState.sort.reverse
    vm.reportId = vm.searchConditions.reportId
    vm.sampleName = vm.searchConditions.sampleName
    vm.entrustedUnit = vm.searchConditions.entrustedUnit
    vm.inspectedUnit = vm.searchConditions.inspectedUnit
    vm.productionUnit = vm.searchConditions.productionUnit
    vm.receiveSampleId = vm.searchConditions.receiveSampleId
    vm.executeStandard = vm.searchConditions.executeStandard
  	SampleService.getSampleList(tableParams, vm.searchConditions, vm.status).then(function (response) {
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
      vm.refreshTable('reset');
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
    vm.refreshTable('reset')
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
    vm.clonedReportId = sample.reportId
    $cookies.put('clonedReportId', sample.reportId);
    toastr.success('复制成功！')
    $('.btn-group').removeClass('open');
  }

  // 离开抽样单页面时，清空复制信息
  $scope.$on('$stateChangeStart', function (event, toState) {
    if (toState.name.indexOf('sample') == -1) {
      $cookies.remove('clonedReportId');
    }
  })

  vm.goDetail = function (id) {
    $state.go('app.business.sample.detail.info', {
      status: vm.status, id: id, pageSize: vm.pageSize, pageNum: vm.pageNum, orderBy: vm.orderBy, reverse: vm.reverse.toString(),
      reportId: vm.reportId, sampleName: vm.sampleName, entrustedUnit: vm.entustedUnit, inspectedUnit: vm.inspectedUnit,
      productionUnit: vm.productionUnit, receiveSampleId: vm.receiveSampleId, executeStandard: vm.executeStandard
    });
  }

  vm.delete = function (sample, event) {
    event.stopPropagation();
    $('.btn-group').removeClass('open');
    var result = dialog.confirm('确认删除接样单 ' + sample.reportId + ' ?');
    result.then(function (res) {
      if (res) {
        SampleService.deleteSample([sample.reportId]).then(function (response) {
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
    SampleService.getSampleCiList(vm.selectedSample.reportId).then(function (response) {
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
        item.testRoom = item.department;
        delete item.id;
        delete item.department;
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
          defaultPrice: item.default_price,
          testRoom: item.department,
          law: item.law,
          package: item.package
        }
        data.push(tempItem);
      });
    }
    $rootScope.loading = true;
    SampleService.recordSampleCi(vm.selectedSample.reportId, data).then(function (response) {
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
    SampleService.getSampleCiList(vm.clonedReportId).then(function (response) {
      $rootScope.loading = false;
      if (response.data.success) {
        var checkItems = response.data.entity;
        angular.forEach(checkItems, function (item) {
          item.standard_value = item.standardValue;
          item.detection_limit = item.detectionLimit;
          item.quantitation_limit = item.quantitationLimit;
          item.default_price = item.defaultPrice;
          item.department = item.testRoom;
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
        reportId: function () {return vm.selectedSample.reportId;},
        checkItem: function () {return ci;},
        units: ['$rootScope', '$q', 'UnitService', function ($rootScope, $q, UnitService) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          UnitService.getUnitList().then(function (response) {
            if (response.data.success) {
              var res = [];
              angular.forEach(response.data.entity, function (item) {
                res.push(item.unitName);
              })
              deferred.resolve(res);
            } else {
              deferred.resolve([]);
            }
          });
          return deferred.promise;
        }],
        organizations: ['$rootScope', '$q', 'PrivilegeService', function ($rootScope, $q, PrivilegeService) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          PrivilegeService.getOrganizationList().then(function (response) {
            if (response.data.success) {
              deferred.resolve(response.data.entity);
            } else {
              deferred.reject();
            }
          });
          return deferred.promise;
        }]
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
        SampleService.deleteSampleCi(vm.selectedSample.reportId, [ci.id]).then(function (response) {
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

  vm.batchDelete = function () {
    if (vm.selectedItems.length === 0) {
      toastr.warning('请选择检测项！', '警告');
      return;
    }

    var result = dialog.confirm('确认从接样单中批量删除检测项?');
    result.then(function (res) {
      if (res) {
        var ids = [];
        angular.forEach(vm.selectedItems, function (item) {
          ids.push(item.id)
        });
        SampleService.deleteSampleCi(vm.selectedSample.reportId, ids).then(function (response) {
          if (response.data.success) {
            vm.getSampleCi();
            vm.selectedItems = [];
            vm.itemSelected = [];
            vm.allSelected = false;
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

  vm.release = function (reportId, flag, event) {
    event.stopPropagation();
    var result = dialog.confirm('确认' + (flag ? '下发' : '撤回') + '报告编号为 ' + reportId + ' 的接样单?');
    result.then(function (res) {
      if (res) {
        SampleService.setSampleStatus(reportId, flag ? -1 : 0).then(function (response) {
          if (response.data.success) {
            vm.refreshTable()
          } else {
            toastr.error(response.data.message)
          }
        }).catch(function (err) {
          toastr.error(err.data)
        })
      }
    })
  }

  vm.batchRelease = function (flag) {
    if (vm.selectedItemsSample.length === 0) {
      toastr.warning('请选择接样单！', '警告');
      return;
    }
    var result = dialog.confirm('确认' + (flag ? '下发' : '撤回') + ' ?');
    result.then(function (res) {
      if (res) {
        SampleService.batchSetSampleStatus(vm.selectedItemsSample, flag ? -1 : 0).then(function (response) {
          if (response.data.success) {
            vm.refreshTable()
          } else {
            toastr.error(response.data.message)
          }
        }).catch(function (err) {
          toastr.error(err.data)
        })
      }
    })
  }

  vm.distribute = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/distribute/act/act.html',
      controller: 'CiDistributeActionCtrl as vm',
      resolve: {
        reportId: function () {return vm.selectedSample.reportId;},
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
      toastr.warning('请选择检测项！', '警告');
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
      templateUrl: 'controllers/business/distribute/act/act.html',
      controller: 'CiDistributeActionCtrl as vm',
      resolve: {
        reportId: function () {return vm.selectedSample.reportId;},
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

  // 抽样单单选、复选
  vm.itemSelectedSample = [];
  vm.selectedItemsSample = [];
  vm.selectAllSample = function () {
    if (vm.allSelectedSample){
      vm.selectedItemsSample = [];
      angular.forEach(vm.samples, function (item, idx) {
        vm.selectedItemsSample.push(item.reportId);
        vm.itemSelectedSample[idx] = true;
      });
    } else {
      vm.selectedItemsSample = [];
      angular.forEach(vm.samples, function (item, idx) {
        vm.itemSelectedSample[idx] = false;
      });
    }
  }

  vm.selectItemSample = function (event, idx, id) {
    if(event.target.checked){
      vm.selectedItemsSample.push(id);
      vm.itemSelectedSample[idx] = true;
      if(vm.selectedItemsSample.length == vm.samples.length){
        vm.allSelectedSample = true;
      }
    } else {
      for (var i=0,len=vm.selectedItemsSample.length; i<len; i++){
        if (id == vm.selectedItemsSample[i].reportId) {
          vm.selectedItemsSample.splice(i, 1);
          break;
        }
      };
      vm.itemSelectedSample[idx] = false;
      vm.allSelectedSample = false;
    }
  }

  // 检测项单选、复选
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
