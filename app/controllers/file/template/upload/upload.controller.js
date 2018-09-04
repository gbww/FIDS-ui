'use strict';

angular.module('com.app').controller('TemplateUploadCtrl', function ($uibModalInstance, $cookies, toastr, api, Upload, roles) {
  var vm = this;
  vm.roles = roles;
  vm.selectedRoles = []

  vm.template = {
    category: '0',
    type: '0'
  };

  vm.changeType = function () {
    vm.filename = null
  }

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
      var selectedRoleIds = vm.selectedRoles.map(function (role) {return role.id})
      if (selectedRoleIds.indexOf(api.userInfo.role.id) === -1) {
        selectedRoleIds.push(api.userInfo.role.id)
      }
      data.roleIdList = selectedRoleIds.join(';')
    }
  	Upload.upload({
  		url: '/api/v1/ahgz/template/upload',
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
