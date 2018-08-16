'use strict';

angular.module('com.app').controller('SampleAddDbCiCtrl', function ($scope, $uibModal, $uibModalInstance, CheckItemService, eventService, toastr) {
  var vm = this;

  vm.searchObject = {}

  vm.refreshTable = function () {
    vm.searchObject.timestamp = new Date();
    if (flag == 'reset') {
      vm.searchObject.reset = true;
    }
  }

  vm.loading = true;
  vm.checkItems = [];
  vm.getCheckItemList = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
    CheckItemService.getCheckItemList(tableParams, vm.query).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.checkItems = response.data.entity.list;
        vm.total = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;
      } else {
        vm.total = 0;
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    })
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

  vm.addCheckItem = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/checkItem/list/add-checkitem/addCheckitem.html',
      controller: 'DBAddCheckItemCtrl as vm',
      resolve: {
        organizations: ['PrivilegeService', '$rootScope', '$q', function (PrivilegeService, $rootScope, $q) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          PrivilegeService.getOrganizationList().then(function (response) {
            $rootScope.loading = false;
            if (response.data.success) {
              deferred.resolve(response.data.entity);
            } else {
              $rootScope.loading = false;
              deferred.reject();
            }
          });
          return deferred.promise;
        }]
      }
    });

    modalInstance.result.then(function (res) {
      vm.refreshTable();
      toastr.success('检测项添加成功！');
    });
  }

  // 单选、复选
  vm.itemChecked = [];
  vm.checkedItems = [];
  vm.checkAll = function () {
    if (vm.allChecked){
      vm.checkedItems = [];
      angular.forEach(vm.checkItems, function (checkItem, idx) {
        vm.checkedItems.push(checkItem);
        vm.itemChecked[idx] = true;
      });
    } else {
      vm.checkedItems = [];
      angular.forEach(vm.checkItems, function (checkItem, idx) {
        vm.itemChecked[idx] = false;
      });
    }
  }

  vm.checkItem = function (event, idx, item) {
    if(event.target.checked){
      vm.checkedItems.push(item);
      vm.itemChecked[idx] = true;
      if(vm.checkedItems.length == vm.checkItems.length){
        vm.allChecked = true;
      }
    } else {
      for (var i=0,len=vm.checkedItems.length; i<len; i++){
        if (item.id == vm.checkedItems[i].id) {
          vm.checkedItems.splice(i, 1);
          break;
        }
      };
      vm.itemChecked[idx] = false;
      vm.allChecked = false;
    }
  }

  vm.ok = function () {
    if (vm.checkedItems.length > 0) {
      $uibModalInstance.close(vm.checkedItems);
    } else {
      $uibModalInstance.dismiss();
    }
  }

  vm.cancel = function () {
    $uibModalInstance.dismiss();
  }

  function keyEvent (evt) {
    var keyCode = evt.keyCode || evt.which
    if (keyCode === 13) {
      vm.ok()
    }
  }
  eventService.addEvent(document, 'keydown', keyEvent)
  $scope.$on('$destroy', function () {
    eventService.removeEvent(document, 'keydown', keyEvent)
  });

});
