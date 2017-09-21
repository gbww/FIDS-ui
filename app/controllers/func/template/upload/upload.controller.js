'use strict';

angular.module('com.app').controller('TemplateUploadCtrl', function ($uibModalInstance, TemplateService, toastr, Upload) {
  var vm = this;

  vm.typeArr = ['单页版', '委托版', '标准版', '绿色版'];
  vm.template = {
  	type: vm.typeArr[0]
  };

  vm.addFile = function (event) {
    var selectedFile = event.target.files[0];
    vm.filename = selectedFile.name;
  }

  vm.ok = function () {
  	Upload.upload({
  		url: '/api/v1/ahgz/template/upload',
  		data: {
  			file: vm.file
  		}
  	}).then(function(){
  		// return TemplateService.recordTemplateItem(vm.template);
  	}).then(function (response) {
  		if (response.data.success) {
		  	$uibModalInstance.close();
  			toastr.success('模板上传成功！');
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).catch(function (err) {
  		toastr.error(err.data);
  	});
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }



});
