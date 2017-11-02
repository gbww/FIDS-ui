'use strict';

angular.module('com.app').controller('TemplateUploadCtrl', function ($uibModalInstance, TemplateService, toastr, Upload) {
  var vm = this;


  vm.template = {
    category: '0'
  };

  vm.addFile = function (event) {
    var selectedFile = event.target.files[0];
    vm.filename = selectedFile.name;
  }

  vm.ok = function () {
  	Upload.upload({
  		url: '/api/v1/ahgz/template/upload',
  		data: {
        name: vm.template.name,
        category: vm.template.category,
        description: vm.template.description,
  			file: vm.file
  		}
  	}).then(function (response) {
  		if (response.data.success) {
		  	$uibModalInstance.close();
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
