'use strict';

angular.module('com.app').controller('PrivilegeUserCtrl', function (api, toastr) {
  var vm = this;

  var privilegeBC = api.breadCrumbMap.privilege;
  vm.breadCrumbArr = [privilegeBC.root, privilegeBC.user.root];

  toastr.success("skfjask" + Math.random());
})
