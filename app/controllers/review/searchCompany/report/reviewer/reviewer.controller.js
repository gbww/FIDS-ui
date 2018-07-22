'use strict';

angular.module('com.app').controller('ReviewerCtrl', function ($uibModalInstance, reviewers) {
	var vm = this;
	
	vm.identityArr = ['组长', '组员', '联系人', '陪审员']

	vm.userArr = angular.copy(reviewers)
	if (vm.userArr.length === 0) {
		vm.userArr.push({
			name: '', position: '', telephone: '', firstMeeting: '', liveMeeting: '', lastMeeting: '', reviewReportId: reportId, identity: vm.identityArr[0]
		})
	}


  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
