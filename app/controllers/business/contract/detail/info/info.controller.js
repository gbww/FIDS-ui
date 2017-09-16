'use strict';

angular.module('com.app').controller('ContractDetailInfoCtrl', function ($scope, toastr, ContractService) {
  var vm = this;

  $scope.$emit('refreshContract');
  $scope.$on('contractInfo', function (event, contract) {
  	vm.contract = contract;
  })

  vm.ok = function () {
    var data = angular.merge({}, vm.contract, {
      isUseStandard: parseInt(vm.contract.isUseStandard),
      isSubcontracting: parseInt(vm.contract.isSubcontracting),
      isExpedited: parseInt(vm.contract.isExpedited),
      isEvaluation: parseInt(vm.contract.isEvaluation),
      productDate: vm.contract.productDate ? new Date(vm.contract.productDate).toLocaleString() : null,
      inspectionDate: vm.contract.inspectionDate ? new Date(vm.contract.inspectionDate).toLocaleString() : null,
      acceptanceDate: vm.contract.acceptanceDate ? new Date(vm.contract.acceptanceDate).toLocaleString() : null
    });

  	ContractService.editContract(vm.contract.id, data).then(function (response) {
  		if (response.data.success) {
  			toastr.success('合同修改成功！');
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).catch(function (err) {
  		toastr.error(err.data.message);
  	})
  }

});
