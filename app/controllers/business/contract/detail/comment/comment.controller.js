'use strict';

angular.module('com.app').controller('ContractDetailCommentCtrl', function ($scope, toastr, ContractService) {
  var vm = this;

  $scope.$emit('refreshContract');
  vm.loading = true;
  $scope.$on('contractInfo', function (event, contract) {
  	ContractService.getCommentList(contract.id).then(function (response) {
  		vm.loading = false;
  		if (response.data.success) {
  			vm.comments = response.data.entity;
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).catch(function (err) {
  		vm.loading = false;
			toastr.error(err.data.message);
  	})
  })

});
