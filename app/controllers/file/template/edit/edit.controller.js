'use strict';

angular.module('com.app').controller('TemplateEditCtrl', function ($uibModalInstance, $cookies, toastr, Upload, data, roles) {
	var vm = this;
	var template = data.template, roleIdList = data.roleIdList || []
	vm.template = angular.merge(template, {
		type: template.type + ''
	});
	vm.roles = roles

	vm.selectedRoles = []
	angular.forEach(vm.roles, function (role) {
		if (roleIdList.indexOf(role.id) !== -1) {
			vm.selectedRoles.push(role)
		}
	})

  vm.addFile = function (event) {
    var selectedFile = event.target.files[0];
    vm.filename = selectedFile.name;
  }

  vm.ok = function () {
		var data = {
      name: vm.template.name,
      category: vm.template.category,
      description: vm.template.description,
      type: parseInt(vm.template.type),
      file: vm.file
    }
    if (data.type === 1) {
      data.roleIdList = vm.selectedRoles.map(function (role) {return role.id}).join(';')
    }
		Upload.upload({
			url: '/api/v1/ahgz/template/' + vm.template.id,
			method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + $cookies.get('token')
      },
  		data: data
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
