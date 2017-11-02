'use strict';

angular.module('com.app').controller('SampleCtrl', function ($rootScope, $scope, $state, $cookies, $uibModal, $timeout, api, dialog, toastr, SampleService, CheckItemService) {
  var vm = this;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.sample.root];

  $('#date-start').datetimepicker({
    useCurrent: false,
    format: 'YYYY-MM-DD hh:mm:ss'
  });
  $('#date-end').datetimepicker({
    useCurrent: false,
    format: 'YYYY-MM-DD hh:mm:ss'
  });

  $("#date-start").on("dp.change", function (e) {
    $('#date-end').data("DateTimePicker").minDate(e.date);
  });
  $("#date-end").on("dp.change", function (e) {
    $('#date-start').data("DateTimePicker").maxDate(e.date);
  });

  vm.searchObject = {
    searchKeywords: ''
  }

  vm.refreshTable = function () {
    vm.searchObject.timestamp = new Date();
  }

  vm.searchConditions = {};
  vm.sampleIdArr = [], vm.sampleTypeArr = [], vm.checkTypeArr = [], vm.entrustedUnitArr = [];

  vm.status = '0';
  vm.samples = [];
  vm.getSampleList = function (tableState) {
    vm.loading = true;
    vm.ciLoading = true;
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
  	SampleService.getSampleList(tableParams, vm.searchObject.searchKeywords, parseInt(vm.status)).then(function (response) {
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
          if (vm.sampleIdArr.indexOf(item.receiveSampleId) == -1) {
            vm.sampleIdArr.push(item.receiveSampleId);
          }
          if (vm.sampleTypeArr.indexOf(item.sampleType) == -1) {
            vm.sampleTypeArr.push(item.sampleType);
          }
          if (vm.checkTypeArr.indexOf(item.checkType) == -1) {
            vm.checkTypeArr.push(item.checkType);
          }
          if (item.entrustedUnit && vm.entrustedUnitArr.indexOf(item.entrustedUnit) == -1) {
            vm.entrustedUnitArr.push(item.entrustedUnit);
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
      vm.refreshTable();
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

  vm.selectSample = function (sample) {
    if (angular.equals(vm.selectedSample, sample)) {
      return;
    }
    vm.selectedSample = sample;
    vm.getSampleCi();
  }

  vm.clone = function (sample) {
    $cookies.putObject('clonedSample', sample);
    toastr.success('复制成功！')
  }

  vm.goDetail = function (id) {
    $state.go('app.business.sample.detail.info', {id: id});
  }

  vm.delete = function (sample) {
    var result = dialog.confirm('确认删除接样单 ' + sample.receiveSampleId + ' ?');
    result.then(function (res) {
      if (res) {
        SampleService.deleteSample([sample.receiveSampleId]).then(function (response) {
          if (response.data.success) {
            vm.refreshTable();
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
  CheckItemService.getChildCatalog('-1').then(function (response) {
    vm.catalogLoading = false;
    var data = response.data.entity;
    angular.forEach(data, function (item) {
      angular.merge(item, {name: item.productName, isParent: item.isCatalog=='1'})
    })
    vm.tree = $.fn.zTree.init($("#inspectTree"), setting, data);
  })

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
        delete item.id;
      });
      data = [].concat(checkItems);
    } else {
      angular.forEach(checkItems, function (item) {
        var tempItem = {
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
    SampleService.updateSampleCi(vm.selectedSample.receiveSampleId, data).then(function (response) {
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
      size: 'lg',
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

  vm.delete = function (ci) {
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
        checkItem: function () {return item;},
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

});
