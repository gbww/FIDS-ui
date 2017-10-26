'use strict';

angular.module('com.app').controller('TemplateUploadCtrl', function ($uibModalInstance, TemplateService, toastr, Upload, typeMap) {
  var vm = this;

  vm.coverTypeArr = angular.merge([], typeMap.coverType);
  vm.reportTypeArr = angular.merge(['单页版', '委托版', '标准版', '绿色版', ], typeMap.reportType);

  vm.typeArr = vm.coverTypeArr;

  vm.template = {
  	type: vm.typeArr.length > 0 ? vm.typeArr[0] : '',
    category: '0'
  };

  vm.changeCategory = function (category) {
    if (category == '0') {
      vm.typeArr = vm.coverTypeArr;
    } else {
      vm.typeArr = vm.reportTypeArr;
    }
    if (vm.typeArr.length > 0) {
      vm.template.type = vm.typeArr[0];
    }
  }

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
        type: vm.template.type,
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
