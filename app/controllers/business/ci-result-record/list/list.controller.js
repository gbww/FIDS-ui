'use strict';

angular.module('com.app').controller('CiResultListCtrl', function ($stateParams, $uibModal, api, CiResultRecordService, UnitService, toastr, dialog) {
  var vm = this;
  vm.hasRecordAuth = api.permissionArr.indexOf('SAMPLE-UPDATEITEMRESULT-1') != -1;
  vm.isSampleDetail = !!$stateParams.reportId;

  vm.query = {
    reportId: $stateParams.reportId || null,
    receiveSampleId: $stateParams.receiveSampleId || null,
    sampleName: $stateParams.sampleName || null,
    name: $stateParams.entrustedUnit || null,
    method: $stateParams.inspectedUnit || null
  };
  vm.searchObject = {};

  vm.refreshTable = function (flag) {
    vm.allSelected = false;
    vm.itemSelected = [];
    vm.selectedItems = [];
    vm.searchObject.timestamp = new Date();
    if (flag === 'reset') {
      vm.searchObject.reset = true;
    }
  };


  vm.pageNum = parseInt($stateParams.pageNum) || null
  vm.pageSize = parseInt($stateParams.pageSize) || null
  vm.orderBy = $stateParams.orderBy || null
  vm.reverse = $stateParams.reverse === 'true'

  vm.status = parseInt($stateParams.status) ||1;
  vm.checkItems = [];
  vm.loading = true;
  vm.getCheckItemList = function (tableState) {
    var orderBy = tableState.sort.predicate;
    var reverse = tableState.sort.reverse ? 'desc' : 'asc';
    if (orderBy === 'reportId') {
      orderBy = 'report_id';
    } else if (orderBy === 'receiveSampleId') {
      orderBy = 'receive_sample_id';
    } else if (orderBy === 'testRoom') {
      orderBy = 'test_room';
    } else if (orderBy === 'testUser') {
      orderBy = 'test_user';
    } else if (orderBy === 'updatedAt') {
      orderBy = 'updated_at';
    } else if (orderBy === 'finishDate') {
      orderBy = 'finish_date'
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
    vm.reportId = vm.query.reportId
    vm.receiveSampleId = vm.query.receiveSampleId
    vm.sampleName = vm.query.sampleName
    vm.name = vm.query.name
    vm.method = vm.query.method
  	CiResultRecordService.getUserCi(tableParams, vm.status, vm.query).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.checkItems = response.data.entity.list;
        vm.total = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;
        if (tableState.pagination.start > vm.total) {
          tableState.pagination.start = 0;
        }
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
      vm.allSelected = false;
      vm.itemSelected = [];
      vm.selectedItems = [];
      vm.status = filter;
      vm.refreshTable('reset');
    }
  }

  vm.eventSearch=function(e){
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
      vm.search();
    }
  }
  vm.back = function () {
    vm.advance = false;
    angular.merge(vm.query, {
      reportId: null,
      receiveSampleId: null,
      sampleName: null,
      name: null,
      method: null
    });
  }

  vm.search = function () {
    vm.refreshTable('reset')
  }

  vm.reset = function () {
    angular.merge(vm.query, {
      reportId: null,
      receiveSampleId: null,
      sampleName: null,
      name: null,
      method: null
    });
  }

  vm.distribute = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/distribute/act/act.html',
      controller: 'CiDistributeActionCtrl as vm',
      resolve: {
        reportId: function () {return item.reportId;},
        checkItems: function () {return [item];},
        departments: ['$rootScope', '$q', 'PrivilegeService', function ($rootScope, $q, PrivilegeService) {
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
      toastr.success('检测项重新分配成功！');
      vm.refreshTable();
    });
  }

  vm.recordResult = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/ci-result-record/edit/edit.html',
      controller: 'RecordCiResultCtrl as vm',
      resolve: {
        checkItems: function () {return [item];},
        units: ['$rootScope', '$q', 'UnitService', function ($rootScope, $q, UnitService) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          UnitService.getUnitList().then(function (response) {
            $rootScope.loading = false;
            if (response.data.success) {
              var res = [];
              angular.forEach(response.data.entity, function (item) {
                res.push(item.unitName);
              })
              deferred.resolve(res);
            } else {
              deferred.resolve([]);
            }
          }).catch(function () {
            $rootScope.loading = false;
            deferred.resolve([]);
          });
          return deferred.promise;
        }],
      }
    });

    modalInstance.result.then(function () {
      toastr.success('检测项结果录入成功！');
      vm.refreshTable();
    });
  }

  vm.batch = function () {
    if (vm.selectedItems.length === 0) {
      toastr.warning('请选择检测项！');
      return;
    }
    vm.selectedItemsCopy = angular.copy(vm.selectedItems)
    $("#batchRecordModal").modal('show');
  }

  vm.export = function () {
    var link = document.createElement('a');
    var order = vm.orderBy ? [vm.orderBy, vm.reverse].join(' ') : null
    var name = api.userInfo.name
    var href = '/api/v1/ahgz/receive/sampleItem/writeExcel?username=' + name + '&status=' + vm.status + '&pageSize=' + vm.pageSize + '&pageNum=' + vm.pageNum
    if (order) href += '&order=' + order
    angular.forEach(vm.query, function (val, key) {
      if (val) {
        href += '&' + key + '=' + val
      }
    })
    link.href = href;
    link.download = parseInt(Math.random() * 1000000);
    link.click();
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
  
  vm.characterArr = [];
  vm.resultArr = ['合格', '不合格'];

  UnitService.getUnitList().then(function (response) {
    if (response.data.success) {
      var res = [];
      angular.forEach(response.data.entity, function (item) {
        res.push(item.unitName);
      })
      vm.characterArr = res;
    }
  });

  vm.patch = function (item, index) {
    vm.selectedRow = index;
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/ci-result-record/patch/patch.html',
      controller: 'RecordCiResultPatchCtrl as vm',
      resolve: {
        item: function () {
          return item
        },
        units: function () {
          return vm.characterArr 
        }
      }
    })


    modalInstance.result.then(function (res) {
      vm.selectedRow = null
      angular.forEach(vm.selectedItemsCopy, function (item, idx) {
        if ((res.direction === 'up' && idx <= index) || (res.direction === 'down' && idx >= index)) {
          // 覆盖式填充
          if (res.type === 'true') {
            angular.merge(item, res.val)          
          } else {
          // 非覆盖式填充
            for (var key in res.val) {
              if (!item[key] || idx === index) {
                item[key] = res.val[key]
              }
            }
          }
        }
      })
    }, function () {
      vm.selectedRow = null
    })
  }


  vm.batchClose = function () {
  	$("#batchRecordModal").modal('hide');
  }

  vm.batchOk = function () {
    var res = angular.copy(vm.selectedItemsCopy)
    // angular.forEach(res, function (item) {
    //   angular.merge(item, {status: 2})
    // })
    CiResultRecordService.batchRecordCiResult(res).then(function (response) {
  		if (response.data.success) {
        vm.batchClose()
        vm.refreshTable()
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).catch(function (err) {
  		toastr.error(err.data);
  	})
  }

  vm.batchPush = function (items) {
    if (!items && vm.selectedItems.length === 0) {
      toastr.warning('请选择检测项！');
      return;
    }

    var data = items ? items : vm.selectedItems.map(function (item) {
      return item.id
    })

    var result = dialog.confirm('确认下发?');
    result.then(function (res) {
      if (res) {
        CiResultRecordService.batchDistribute(data).then(function (response) {
  		    if (response.data.success) {
            toastr.success('下发成功！')
            vm.refreshTable()
  		    } else {
  			    toastr.error(response.data.message);
  		    }
  	    }).catch(function (err) {
  		    toastr.error(err.data);
        })
      }
    })
  }

});
