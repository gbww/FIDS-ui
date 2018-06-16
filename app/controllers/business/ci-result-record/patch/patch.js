'use strict';

angular.module('com.app').controller('RecordCiResultPatchCtrl', function ($uibModalInstance, units, item) {
  var vm = this;

  vm.characterArr = units;
  vm.resultArr = ['合格', '不合格']

  vm.direction = 'down'
  vm.type = 'true'
  vm.columns = [
    {key: '名称', value: 'name'},
    {key: '检测方法', value: 'method'},
    {key: '单位', value: 'unit'},
    {key: '标准值', value: 'standardValue'},
    {key: '检出限', value: 'detectionLimit'},
    {key: '定量限', value: 'quantitationLimit'},
    {key: '设备', value: 'device'},
    {key: '结果', value: 'itemResult'},
    {key: '实测值', value: 'measuredValue'}
  ]

  vm.result = []
  var editColumn = ['itemResult', 'measuredValue']
  // var editColumn = ['name', 'method', 'unit', 'standardValue', 'detectionLimit', 'quantitationLimit', 'device', 'itemResult', 'measureValue']
  for (var key in item) {
    if (editColumn.indexOf(key) !== -1) {
      vm.result.push({column: key, value: item[key]})
    }
  }

  vm.addItem = function () {
    vm.result.push({column: '', value: ''})
  }

  vm.deleteItem = function (idx) {
    vm.result.splice(idx, 1);
    if (vm.result.length === 0) {
      vm.addItem();
    }
  }

  vm.changeColumn = function (pars) {
    pars.value = item[pars.column]
    if (pars.column === 'result') {
      pars.value = item[pars.column] || vm.resultArr[0]
    }
  }
  
  vm.ok = function () {
    var resDict = {};
    var res = angular.copy(vm.result);
    angular.forEach(res, function (item, idx) {
      if (!item.column || !item.value) {
        res.splice(idx, 1);
      } else {
        resDict[item.column] = item.value
      }
    })
    if (res.length === 0) {
      $uibModalInstance.dismiss();
    }

    $uibModalInstance.close({
      direction: vm.direction,
      type: vm.type,
      val: resDict
    })
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
