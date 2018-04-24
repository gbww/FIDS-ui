'use strict';

angular.module('com.app').factory('CheckItemService', function ($http) {
	return {
		/**    
		 *  自定义检测项管理
		 */

		// 获取目录信息
		getCICatalogInfo: function (id) {
			return $http.get('/api/v1/ahgz/checkitemscatalog/' + id);
		},

		getChildCatalog: function (id) {
			return $http({
				url: '/api/v1/ahgz/checkitemscatalog/children',
				method: 'GET',
				params: {
					parentId: id
				}
			});
		},

		addCICatalog: function (data) {
			return $http({
				url: '/api/v1/ahgz/checkitemscatalog',
				method: 'POST',
				data: data
			})
		},

		editCICatalog: function (data) {
			return $http({
				url: '/api/v1/ahgz/checkitemscatalog',
				method: 'PUT',
				data: data
			})
		},

		deleteCICatalog: function (id) {
			return $http({
				url: '/api/v1/ahgz/checkitemscatalog/' + id,
				method: 'DELETE'
			})
		},

		recordCatalogCi: function (data) {
			return $http({
				url: '/api/v1/ahgz/checkitemscatalog/item/mapping',
				method: 'POST',
				data: data
			})
		},

		editCatalogCi: function (data) {
			return $http({
				url: '/api/v1/ahgz/checkitemscatalog/item/mapping',
				method: 'PUT',
				data: data
			})
		},

		deleteCatalogCi: function (id) {
			return $http({
				url: '/api/v1/ahgz/checkitemscatalog/item/mapping/' + id,
				method: 'DELETE'
			})
		},

		getCatalogCiList: function (id) {
			// return $http.get('/api/v1/ahgz/checkitemscatalog/item/' + id + '/tree');
			return $http.get('/api/v1/ahgz/checkitemscatalog/item/mapping/' + id);
		},


		/**    
		 *  检测项管理
		 */

		// 获取所有的检测项
		getCheckItemList: function (tableParams, searchName) {
			return $http({
				url: '/api/v1/ahgz/checkitemscatalog/item',
				method: 'GET',
				params: {
          pageSize: tableParams.pageSize,
          pageNum: tableParams.pageNum,
          name: searchName
        }
			});
		},

		recordCheckItem: function (data) {
			return $http({
				url: '/api/v1/ahgz/checkitemscatalog/item',
				method: 'POST',
				data: data
			})
		},

		getCheckItemInfo: function (id) {
			return $http.get('/api/v1/ahgz/checkitemscatalog/item/' + id);
		},

		editCheckItem: function (id, data) {
			return $http({
				url: '/api/v1/ahgz/checkitemscatalog/item/' + id,
				method: 'PUT',
				data: data
			});
		},

		deleteCheckItem: function (id) {
			return $http({
				url: '/api/v1/ahgz/checkitemscatalog/item/' + id,
				method: 'DELETE'
			});
		}
	}
})
