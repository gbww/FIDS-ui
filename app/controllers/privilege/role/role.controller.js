'use strict';

angular.module('com.app').controller('PrivilegeRoleCtrl', function ($rootScope, $q, $uibModal, api, toastr, dialog, PrivilegeService) {
  var vm = this;

  var privilegeBC = api.breadCrumbMap.privilege;
  vm.breadCrumbArr = [privilegeBC.root, privilegeBC.role.root];

  vm.searchObject = {
    searchKeywords: ''
  }

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    }
  }

  vm.roles = [];
  vm.loading = true;
  vm.getRoleList = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
    PrivilegeService.getRoleList(tableParams, vm.searchObject.searchKeywords).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.roles = response.data.entity.list;
        vm.total = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;
      } else {
        vm.total = 0;
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    });
  }

  vm.create = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/privilege/role/create/create.html',
      controller: 'PrivilegeRoleCreateCtrl as vm'
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("角色创建成功！");
    })
  }

  vm.editInfo = function (role) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/privilege/role/edit/edit.html',
      controller: 'PrivilegeRoleEditCtrl as vm',
      resolve: {
        role: function () { return role; }
      }
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("角色信息修改成功！");
    })
  }

  vm.delete = function (role) {
    var result = dialog.confirm('确认删除角色 ' + role.name + ' ?');
    result.then(function (res) {
      if (res) {
        PrivilegeService.deleteRole(role.id).then(function (response) {
          if (response.data.success) {
            vm.refreshTable('delete');
            toastr.success('角色删除成功！');
          } else {
            toastr.error(response.data.message);
          }
        }).catch(function (error) {
          toastr.error(error.data.message)
        });
      }
    })
  }


	$("#entityTree").modal('hide');

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
  
  var moduleName = {
    'USER': '用户管理',
    'ORGANIZATION': '部门管理',
    'ROLE': '角色管理',
    'SAMPLE': '接样管理',
    'REPORT': '报告管理',
    'CONTRACT': '合同管理',
    'TEMPLATE': '模板管理',
    'GZUNIT': '单位库管理',
    'CLIENT': '客户管理',
    'CHECKITEM': '检测项管理'
  }

  vm.editEntity = function (id) {
    $rootScope.loading = true;
    vm.roleId = id;
    // 所有权限项和登录用户拥有的权限项
    var entityPromise = PrivilegeService.getPrivileges();
    var userEntityPromise = PrivilegeService.getRoleEntities(id)
    $q.all([entityPromise, userEntityPromise]).then(function (responses) {
      $rootScope.loading = false;
      var entities = responses[0].data.entity;
      var userEntities = responses[1].data.entity.slice(0,100);
      for (var i=0,userLen=userEntities.length; i<userLen; i++) {
        for (var j=0,len=entities.length; j<len; j++) {
          if (entities[j].id == userEntities[i].id) {
            entities[j].checked = true;
            break;
          }
        }
      }

      var userEntityMap = {};
      angular.forEach(userEntities, function (entity) {
        if (!userEntityMap[entity.category]) {
          userEntityMap[entity.category] = [];
        }
        userEntityMap[entity.category].push({
          name: entity.displayName,
          id: entity.id
        })
      })

      var entityMap = {};
      angular.forEach(entities, function (entity) {
        if (!entityMap[entity.category]) {
          entityMap[entity.category] = [];
        }
        entityMap[entity.category].push({
          name: entity.displayName,
          id: entity.id,
          checked: entity.checked || false
        })
      })

      vm.treeData = [];
      angular.forEach(entityMap, function (val, key) {
        vm.treeData.push({
          name: moduleName[key],
          checked: userEntityMap[key] ? (userEntityMap[key].length == val.length) : false,
          children: val
        })
      })
    	vm.treeObj = $.fn.zTree.init($("#entityTree"), setting, vm.treeData);
      var nodes = vm.treeObj.getCheckedNodes();
      var map = {};
      for (i=0,len=nodes.length; i<len; i++) {
        if (!map[nodes[i].parentTId]) {
          map[nodes[i].parentTId] = true;
          vm.treeObj.checkNode(nodes[i], true, true);
        }
      }


    	$("#entityModal").modal('show');
    }).catch(function (err) {
      $rootScope.loading = false;
      toastr.error('获取权限项失败！');
    });
  }

  vm.close = function () {
  	$("#entityModal").modal('hide');
  }

  vm.ok = function () {
  	var nodes = vm.treeObj.getCheckedNodes();
    var entities = [];
    angular.forEach(nodes, function (node) {
      if (node.parentTId) {
        entities.push(node.id);
      }
    });
    PrivilegeService.initRoleEntity(vm.roleId, entities).then(function (response) {
      vm.close();
      vm.treeObj.destroy();
      if (response.data.success) {
        toastr.success('权限修改成功！')
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      toastr.error(err.data);
    })
  }
})
