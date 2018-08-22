'use strict';

angular.module('com.app').controller('FrTemplateUploadCtrl', function ($uibModalInstance, $cookies, toastr, Upload, roles) {
  var vm = this;
  vm.roles = roles;

  vm.selectedRoles = []
  vm.template = {
    category: '0'
  };

  vm.addFile = function (event) {
    var selectedFile = event.target.files[0];
    vm.filename = selectedFile.name;
  }

  vm.ok = function () {
  	Upload.upload({
  		url: '/api/v1/ahgz/template/fr/upload',
      headers: {
        Authorization: 'Bearer ' + $cookies.get('token')
      },
  		data: {
        name: vm.template.name,
        category: vm.template.category,
        description: vm.template.description,
        roleIdList: vm.selectedRoles.map(function (role) {return role.id}).join(','),
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
