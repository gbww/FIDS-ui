'use strict';

angular.module('com.app').factory('PrivilegeService', function ($http) {
	return {
		/*
		 ***  用户管理
		 */

		// 当前用户权限项
		getUserPrivileges: function () {
			return $http({
				url: '/api/v1/user/privileges',
				method: 'PUT'
			});
		},

		// 登陆用户信息
		getCurrentUserInfo: function () {
			return $http.get('/api/v1/user')
		},


		// 用户列表
		getUserList: function (tableParams, searchName) {
			return $http({
				url: '/api/v1/users',
				method: 'GET',
				params: {
          pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          name:searchName
        }
      })
		},

		createUser: function (organizationId, user) {
			return $http({
				url: '/api/v1/organizations/' + organizationId + '/users',
				method: 'POST',
				data: user
			})
		},

		deleteUser: function (organizationId, userId) {
			return $http({
				url: '/api/v1/organizations/' + organizationId + '/users/' + userId,
				method: 'DELETE'
			})
		},

		editUser: function (organizationId, userId, data) {
			return $http({
				url: '/api/v1/organizations/' + organizationId + '/users/' + userId,
				method: 'PUT',
				data: data
			})
		},

		getUserInfo: function (userId) {
			return $http.get('/api/v1/users/userId');
		},

		modifyPassword: function (organizationId, userId) {
			return $http({
				url: '/api/v1/organizations/' + organizationId + '/users/' + userId + '/password',
				method: 'PUT'
			})
		},

		modifyUserStatus: function (organizationId, userId, action) {  // suspend or resume
			return $http({
				url: '/api/v1/organizations/' + organizationId + '/users/' + userId + '/action/' + action,
				method: 'PUT'
			})
		},

		// 更改用户角色
		modifyUserRole: function (organizationId, userId, roleId) {
			return $http({
				url: '/api/v1/organizations/' + organizationId + '/users/' + userId + '/roles/' + roleId + '/action/assignRole',
				method: 'PUT'
			})
		},

		/*
		 ***  权限管理
		 */

		getRoleList: function (tableParams, searchName) {
			if (tableParams) {
				return $http({
					url: '/api/v1/roles',
					method: 'GET',
					params: {
	          pageSize: tableParams.pageSize,
	          pageNum: tableParams.pageNum,
	          name:searchName
	        }
	      });
			} else {
				return $http.get('/api/v1/roles');
			}

		},

		createRole: function (data) {
			return $http({
				url: '/api/v1/roles',
				method: 'POST',
				data: data
			})
		},

		// 更改权限项
		initRoleEntity: function (roleId, entities) {
			return $http({
				url: '/api/v1/roles/' + roleId + '/action/privileges/init',
				method: 'PUT',
				data: entities
			})
		},

		deleteRole: function (roleId) {
			return $http({
				url: '/api/v1/roles/' + roleId,
				method: 'DELETE'
			})
		},

		getRoleInfo: function (roleId) {
			return $http.get('/api/v1/roles/' + roleId)
		},

		getRoleEntities: function (roleId) {
			return $http.get('/api/v1/roles/' + roleId + '/privileges')
		},

		editRole: function (roleId, data) {
			return $http({
				url: '/api/v1/roles/' + roleId,
				method: 'PUT',
				data: data
			})
		},


		/*
		 ***  权限管理
		 */

		getPrivileges: function () {
			return $http.get('/api/v1/privileges');
		},

		// 权限功能分类
		getPrivilegeCategory: function () {
			return $http.get('/api/v1/privileges/categories');
		},

		// 枚举权限功能分类
		enumPrivilegeCategory: function () {
			return $http.get('/api/v1/privileges/captials/categories');
		},


		/*
		 ***  部门管理
		 */
		getOrganizationList: function (tableParams, searchName) {
			if (tableParams) {
				return $http({
					url: '/api/v1/organizations',
					method: 'GET',
					params: {
						pageSize: tableParams.pageSize,
						pageNum: tableParams.pageNum,
						name:searchName
					}
				});
			} else {
				return $http.get('/api/v1/organizations');
			}
		},

		createOrganization: function (data) {
			return $http({
				url: '/api/v1/organizations/',
				method: 'POST',
				data: data
			});
		},

		getOrganizationInfo: function (id) {
			return $http.get('/api/v1/organizations/' + id);
		},

		deleteOrganization: function (id) {
			return $http({
				url: '/api/v1/organizations/' + id,
				method: 'DELETE'
			});
		},

		editOrganization: function (id, data) {
			return $http({
				url: '/api/v1/organizations/' + id,
				method: 'PUT',
				data: data
			});
		}

	}
});
