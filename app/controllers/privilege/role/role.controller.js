'use strict';

angular.module('com.app').controller('PrivilegeRoleCtrl', function (api) {
  var vm = this;

  var privilegeBC = api.breadCrumbMap.privilege;
  vm.breadCrumbArr = [privilegeBC.root, privilegeBC.role.root];

  vm.roles = [{name: 'admin', desc: 'for test'}]

	angular.element("#entityTree").modal('hide');


	vm.checkNode = function (event, treeId, treeNode) {

	}

	var setting = {
		check: {
			enable: true
		},
		callback: {
			onCheck: vm.checkNode
		}
	}

  vm.open = function (id) {
  	vm.treeData = [{
			id: 0, name: '概览', route: 'app.dashboard',
			}, {id: 1, name: '用户管理', route: 'app.privilege', children: [{
				id: 2, name: '用户', route: 'app.privilege.user'
			}, {
				id: 3, name: '角色', route: 'app.privilege.role'
			}]
		}];
  	$.fn.zTree.init(angular.element("#entityTree"), setting, vm.treeData);

  	angular.element("#entityModal").modal('show');
  }

  vm.close = function () {
  	angular.element("#entityModal").modal('hide');
  }

  vm.reset = function () {

  }

  vm.ok = function () {
  	var treeObj = $.fn.zTree.getZTreeObj("entityTree");
  	var selectEntities = treeObj.getCheckedNodes(true);
  	console.log(selectEntities);
  }
})
