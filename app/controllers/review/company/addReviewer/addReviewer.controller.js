'use strict';

angular.module('com.app').controller('ProjectReviewerCtrl', function ($q, $uibModalInstance, ReviewService, toastr, companyId, reportId, reviewers) {
	var vm = this;
	vm.type = reviewers ? 'edit' : 'create'
	
	vm.identityArr = ['组长', '组员', '联系人', '陪审员']
	vm.userArr = [];
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

	if (vm.type === 'create') {
		vm.add()
	} else {
		vm.userArr = angular.copy(reviewers)
		if (vm.userArr.length === 0) vm.add()
	}

  vm.ok = function () {
		if (vm.type === 'create') {
			ReviewService.addReport(companyId).then(function (response) {
				if (response.data.success) {
					var reviewReportId = response.data.entity
					var data = []
					angular.forEach(vm.userArr, function (user) {
						if (user.name) {
							data.push(angular.merge(user, {reviewReportId: reviewReportId}))
						}
					})
					ReviewService.addReviewers(data).then(function (response) {
						if (response.data.success) {
							$uibModalInstance.close(reviewReportId);
						} else {
							toastr.error(response.data.message);
						}
					})
				} else {
					toastr.error(response.data.message)
				}
			}).catch(function (err) {
				toastr.error(err.data)
			})
		} else {
			var remainedUsers = [], deletedUserIds = [], addedUsers = []
			angular.forEach(vm.userArr, function (item) {
				if (item.id) {
					// 待更新
					remainedUsers.push(item)
				} else if (item.name) {
					// 待新增
					addedUsers.push(item)
				}
			})
			// 待删除
			var remainedUserIds = remainedUsers.map(function (item) {
				return item.id
			})
			var initUserIds = reviewers.map(function (item) {
				return item.id
			})
			angular.forEach(initUserIds, function (item) {
				if (remainedUserIds.indexOf(item) === -1) {
					deletedUserIds.push(item)
				}
			})

			var promises = [];
			if (addedUsers.length > 0) {
				promises = promises.concat(ReviewService.addReviewers(addedUsers))
			}
			if (remainedUsers.length > 0) {
				promises = promises.concat(remainedUsers.map(function (item) {
					return ReviewService.editReviewer(item)
				}))
			}
			if (deletedUserIds.length > 0) {
				// promises = promises.concat(ReviewService.deleteReviewers(deletedUserIds))
				promises = promises.concat(deletedUserIds.map(function (item) {
					return ReviewService.deleteReviewer(item)
				}))
			}

			if (promises.length > 0) {
				$q.all(promises).then(function (res) {
					toastr.success('更新成功')
					$uibModalInstance.close();
				})
			} else {
				$uibModalInstance.dismiss();
			}
		}
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
