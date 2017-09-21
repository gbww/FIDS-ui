'use strict';

angular.module('com.app').controller('SampleAddCatalogCiCtrl', function ($scope, $uibModalInstance, checkItems) {
  var vm = this;
  vm.checkItems = checkItems;

  // 单选、复选
  vm.itemChecked = [];
  vm.checkedItems = [];
  vm.checkAll = function () {
    if (vm.allChecked){
      vm.checkedItems = [];
      angular.forEach(vm.checkItems, function (item, idx) {
        vm.checkedItems.push(item);
        vm.itemChecked[idx] = true;
      });
    } else {
      vm.checkedItems = [];
      angular.forEach(vm.checkItems, function (item, idx) {
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
        if (item.check_item_id == vm.checkedItems[i].check_item_id) {
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

});
