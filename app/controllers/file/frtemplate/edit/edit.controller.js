'use strict';

angular.module('com.app').controller('TemplateEditCtrl', function ($uibModalInstance, $cookies, toastr, Upload, template, roles) {
  var vm = this;
	vm.template = template;
	vm.roles = roles;

  vm.addFile = function (event) {
    var selectedFile = event.target.files[0];
    vm.filename = selectedFile.name;
  }

  vm.ok = function () {
		Upload.upload({
			url: '/api/v1/ahgz/template/fr/' + vm.template.id,
			method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + $cookies.get('token')
      },
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
