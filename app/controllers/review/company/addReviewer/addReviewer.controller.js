'use strict';

angular.module('com.app').controller('ProjectReviewerCtrl', function ($q, $uibModalInstance, ReviewService, toastr, reportId) {
	var vm = this;
	
	vm.identityArr = ['组长', '组员', '联系人', '陪审员']
	vm.userArr = [{
		name: '', position: '', telephone: '', firstMeeting: '', liveMeeting: '', lastMeeting: '', reviewReportId: reportId, identity: vm.identityArr[0]
	}]
	vm.add = function () {
		vm.userArr.push({
			name: '', position: '', telephone: '', firstMeeting: '', liveMeeting: '', lastMeeting: '', reviewReportId: reportId, identity: vm.identityArr[0]
		})
	}
	vm.delete = function (idx) {
		vm.userArr.splice(idx, 1)
		if (vm.userArr.length === 0) {
			vm.add()
		}
	}

  vm.ok = function () {
		var promises = []
		angular.forEach(vm.userArr, function (uer) {
			if (user.name) {
				promises.push(ReviewService.addReviewer(user))
			}
		})
		
  	$q.all(promises).then(function (response) {
  		if (response.data.success) {
		  	$uibModalInstance.close();
  		} else {
  			toastr.error(response.data.message);
  		}
  	})
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
