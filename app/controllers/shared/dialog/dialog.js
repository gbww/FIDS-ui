angular.module('com.app').factory('dialog', function ($uibModal) {
	var dialog = {};

	dialog.open = $open;
    //警告框
	dialog.alert = function (data) {
		return $open('alert', data);
	};
	dialog.confirm = function (data) {
		return $open('confirm', data);
	};
	dialog.warn = function (data) {
		return $open('warn', data);
	};
	dialog.error = function (data) {
		return $open('error', data);
	};
	//提示框,1秒之后自动消失
	dialog.tip = function (data) {
		return $open('tip', data);
	};

	function $open(mode, data) {
		var modal = $uibModal.open({
			templateUrl: 'controllers/shared/dialog/' + mode + '/index.html',
			resolve: {
				mode: function () {
					return mode
				},
				data: function () {
					return data;
				}
			},
			size: "md",
			windowClass: "dialog-modal",
			controller: ['$uibModalInstance', 'mode', 'data', function ($uibModalInstance, mode, data) {
				var vm = this;

				vm.data = data;
                //确定按钮
				vm.ok = function () {
					$uibModalInstance.close(data);
				};
				vm.close = function () {
					$uibModalInstance.close(false);
				};
                //取消按钮
				vm.dismiss = function () {
					$uibModalInstance.dismiss();
				};
                //提示框，2秒之后消失
                if (mode == 'tip') {
					setTimeout(function () {
						$uibModalInstance.dismiss();
					}, 2000);
				}
			}],
			controllerAs: 'vm'
		});
		return modal.result;
	}

	return dialog;
});
