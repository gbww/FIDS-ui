'use strict';

angular.module('com.app').controller('BusinessCatalogCiCtrl', function ($scope, $uibModalInstance, checkItems) {
  var vm = this;
  vm.checkItems = checkItems;

  // 单选、复选
  vm.itemChecked = [];
  vm.checkedItems = [];
  vm.checkAll = function () {
    if (vm.allChecked){
      vm.checkedItems = [];
      angular.forEach(vm.checkItems, function (item, idx) {
        vm.checkedItems.push(item.check_item_id);
        vm.itemChecked[idx] = true;
      });
    } else {
      vm.checkedItems = [];
      angular.forEach(vm.checkItems, function (item, idx) {
        vm.itemChecked[idx] = false;
      });
    }
  }

  vm.checkItem = function (event, idx, id) {
    if(event.target.checked){
      vm.checkedItems.push(id);
      vm.itemChecked[idx] = true;
      if(vm.checkedItems.length == vm.checkItems.length){
        vm.allChecked = true;
      }
    } else {
      for (var i=0,len=vm.checkedItems.length; i<len; i++){
        if (id == vm.checkedItems[i]) {
          vm.checkedItems.splice(i, 1);
          break;
        }
      };
      vm.itemChecked[idx] = false;
      vm.allChecked = false;
    }
  }

  vm.ok = function () {
  	$uibModalInstance.close(vm.checkedItems);
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }

});
