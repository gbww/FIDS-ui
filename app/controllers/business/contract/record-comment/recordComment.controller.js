'use strict';

angular.module('com.app').controller('RecordCommentCtrl', function ($scope, $uibModalInstance, ContractService, toastr, contractId, taskId) {
  var vm = this;
  vm.comment = {
  	approve: 'false',
    action: 'approve',
    contractId: contractId
  }

  vm.ok = function () {
    ContractService.recordComment(taskId, vm.comment).then(function (response) {
      if (response.data.success) {
        $uibModalInstance.close(vm.comment);
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      toastr.error(err.data.message);
    })
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
