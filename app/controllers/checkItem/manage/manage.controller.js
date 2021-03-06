'use strict';

angular.module('com.app').controller('DBCheckItemManageCtrl', function ($rootScope, $scope, $uibModal, $q, $filter, $cookies, api, CheckItemService, PrivilegeService, toastr, dialog, Upload) {
  var vm = this;
  vm.hasUpdateAuth = api.permissionArr.indexOf('CHECKITEM-MAPPING-ADD-1') != -1;

  var checkItemBC = api.breadCrumbMap.checkItem;
  vm.breadCrumbArr = [checkItemBC.root, checkItemBC.manage];
  vm.hasCheckItemAuth = api.permissionArr.indexOf('CHECKITEM-CATALOG-SELECT-1') != -1;

  // 操作节点是否是目录
  vm.isCatalog = true;

  var setting = {
    edit: {
      enable: true,
      showRemoveBtn: false,
      showRenameBtn: false
    },
    callback: {
    	onExpand: expandNode,
      onClick: clickNode,
      onRightClick: rightClickNode
    }
  }

  vm.checkItems = [];

  // 根据目录id获取该目录下的检测项
  vm.getCatalogCheckItems = function (id) {
  	CheckItemService.getCatalogCiList(id).then(function (response) {
  		if (response.data.success) {
  			vm.checkItems = response.data.entity;
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).catch(function (err) {
  		toastr.error(err.data);
  	})
  }

  vm.getCatalog = function () {
  	// 获取根目录信息
    var init = true;
    vm.catalogLoading = true;
  	CheckItemService.getChildCatalog('-1').then(function (response) {
      vm.catalogLoading = false;
      var data = response.data.entity;
      if (data.length === 0) {
        vm.initial = true;
        return;
      }
      angular.forEach(data, function (item) {
        angular.merge(item, {name: item.productName, isParent: item.isCatalog=='1'})
        if (init && item.isCatalog == '0') {
          init = false;
          vm.getCatalogCheckItems(item.id);
        }
      })
	    vm.tree = $.fn.zTree.init($("#inspectTree"), setting, data);
  	})
  }
  vm.getCatalog();


  function expandNode (event, treeId, treeNode) {
  	if (!treeNode.children) {
      $('#' + treeNode.tId).find("#" + treeNode.tId + '_ico').removeClass().addClass('button ico_loading');
	  	CheckItemService.getChildCatalog(treeNode.id).then(function (response) {
        $('#' + treeNode.tId).find("#" + treeNode.tId + '_ico').removeClass().addClass('button ico_open');
	  		if (response.data.success) {
          // 先根据名称排序，再将文件夹排在前面
	  			var data = $filter('orderBy')($filter('orderBy')(response.data.entity, 'isCatalog'), 'productName');
	  			angular.forEach(data, function (item) {
	  				if (item.isCatalog == '1') {
	  					// 目录节点
							angular.merge(item, {name: item.productName, isParent: true})
						} else {
	  					// 检测项集合节点
							angular.merge(item, {name: item.productName + '(' + item.id + ')'})
						}
		  			vm.tree.addNodes(treeNode, -1, item);
	  			})
	  		}
	  	})
	  }
  }

  function clickNode (event, treeId, treeNode) {
  	if (angular.equals(treeNode, vm.selectedNode)) return;
  	if (treeNode.isCatalog == '0') {
  		vm.selectedNode = treeNode;
      vm.getCatalogCheckItems(treeNode.id);
      vm.allSelected = false;
      vm.itemSelected = [];
      vm.selectedItems = [];
  	} else {
  		vm.selectedNode = null;
  	}
  }

  function rightClickNode (event, treeId, treeNode) {
  	vm.isCatalog = treeNode.isCatalog == '1';
    if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
      vm.tree.cancelSelectedNode();
      showRMenu("root", event.clientX, event.clientY);
    } else if (treeNode && !treeNode.noR) {
      vm.tree.selectNode(treeNode);
      showRMenu("node", event.clientX, event.clientY);
    }
  }

  function showContextMenu (x, y) {
    if (vm.isCatalog) {
      $('#folder').css({
        top: y + 'px',
        left: x + 'px'
      });
    } else {
      $('#file').css({
        top: y + 'px',
        left: x + 'px'
      });
    }
  }
  function hideContextMenu () {
    $(".context-menu").css({left: '-100%'});
  }

  function showRMenu (type, x, y) {
    x = x + document.body.scrollLeft - $("#inspectTree").offset().left + 15;
    y = y + document.body.scrollTop - $("#inspectTree").offset().top + 15;
    showContextMenu(x, y);
  }
  $("body").bind('mousedown', function (event) {
    if ($(event.target).parents(".context-menu").length == 0) {
    	hideContextMenu();
    }
  })

  vm.initialCatalog = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/checkItem/manage/add-catalog/addCatalog.html',
      controller: 'CustomAddCatalogCtrl as vm',
      resolve: {
        isCatalog: function () {return true;},
        isInitial: function () {return true;}
      }
    });

    modalInstance.result.then(function (catalog) {
      $rootScope.loading = true;
    	var data = angular.merge({}, catalog, {parentId: '-1'});
    	CheckItemService.addCICatalog(data).then(function (response) {
        $rootScope.loading = false;
        if (response.data.success) {
          vm.initial = false;
          vm.getCatalog();
    		}	else {
    			toastr.error(response.data.message);
    		}
      });
    })
  }

  vm.addChildNode = function () {
    hideContextMenu();
    var parentNode = vm.tree.getSelectedNodes()[0];
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/checkItem/manage/add-catalog/addCatalog.html',
      controller: 'CustomAddCatalogCtrl as vm',
      resolve: {
        isCatalog: function () {return null;},
        isInitial: function () {return false;}
      }
    });

    modalInstance.result.then(function (catalog) {
      $rootScope.loading = true;
    	var data = angular.merge({}, catalog, {parentId: parentNode.id});
    	CheckItemService.addCICatalog(data).then(function (response) {
    		if (response.data.success) {
          CheckItemService.getChildCatalog(parentNode.id).then(function (response) {
            $rootScope.loading = false;
            var items = response.data.entity;
            for (var i=0,len=items.length; i<len; i++) {
              if (items[i].productName == data.productName) {
                data.id = items[i].id;
                break;
              }
            }
      			if (catalog.isCatalog == '1') {
  	    			var nodeData = angular.merge({}, data, {name: data.productName, isParent: true})
      			} else {
  	    			var nodeData = angular.merge({}, data, {name: data.productName + '(' + data.id + ')'});
      			}
  		    	vm.tree.addNodes(parentNode, -1, nodeData);
          }).catch(function () {
            $rootScope.loading = false;
          })
    		}	else {
    			toastr.error(response.data.message);
    		}
    	}).catch(function () {
        $rootScope.loading = false;
      })
    })
  }

  vm.addSiblingNode = function () {
    hideContextMenu();
    var siblingNode = vm.tree.getSelectedNodes()[0];
    var parentNode = siblingNode.getParentNode();
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/checkItem/manage/add-catalog/addCatalog.html',
      controller: 'CustomAddCatalogCtrl as vm',
      resolve: {
        isCatalog: function () {return vm.isCatalog;},
        isInitial: function () {return false;}
      }
    });

    modalInstance.result.then(function (catalog) {
      $rootScope.loading = true;
      var data = angular.merge({}, catalog, {parentId: parentNode ? parentNode.id : '-1'});
      CheckItemService.addCICatalog(data).then(function (response) {
        if (response.data.success) {
          if (!parentNode) {
            var promise = CheckItemService.getChildCatalog('-1');
          } else {
            var promise = CheckItemService.getChildCatalog(parentNode.id);
          }
          promise.then(function (response) {
            $rootScope.loading = false;
            var items = response.data.entity;
            for (var i=0,len=items.length; i<len; i++) {
              if (items[i].productName == data.productName) {
                data.id = items[i].id;
                break;
              }
            }
            if (catalog.isCatalog == '1') {
              var nodeData = angular.merge({}, data, {name: data.productName, isParent: true})
            } else {
              var nodeData = angular.merge({}, data, {name: data.productName});
            }
            vm.tree.addNodes(parentNode, -1, nodeData);
          }).catch(function () {
            $rootScope.loading = false;
          })
        } else {
          toastr.error(response.data.message);
        }
      }).catch(function () {
        $rootScope.loading = false;
      })
    })
  }

  vm.addCheckItem = function () {
  	hideContextMenu();
    var node = vm.tree.getSelectedNodes()[0];
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      backdrop: 'static',
      templateUrl: 'controllers/checkItem/manage/add-checkitem/addCheckItem.html',
      controller: 'CustomAddCatalogCiCtrl as vm'
    });

    modalInstance.result.then(function (res) {
    	var promiseArr = [];
    	angular.forEach(res, function (item) {
    		var data = angular.merge({}, item, {
          catalogId: node.id,
          checkItemId: item.id
    		});
    		promiseArr.push(CheckItemService.recordCatalogCi(data));
    	})
    	$q.all(promiseArr).then(function () {
    		vm.getCatalogCheckItems(node.id);
    		toastr.success('添加成功！');
    	});
    });
  }

  vm.editNode = function () {
    hideContextMenu();
    var selectedNode = vm.tree.getSelectedNodes()[0];
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/checkItem/manage/edit-catalog/editCatalog.html',
      controller: 'CustomEditCatalogCtrl as vm',
      resolve: {
        node: function () {return selectedNode}
      }
    });

    modalInstance.result.then(function (catalog) {
      CheckItemService.editCICatalog(catalog).then(function (response) {
        if (response.data.success) {
          vm.tree.removeNode(selectedNode);
          var data = angular.merge({}, selectedNode, catalog, {name: catalog.productName});
          vm.tree.addNodes(vm.tree.getNodeByTId(selectedNode.parentTId), -1, data);
        } else {
          toastr.error(response.data.message);
        }
      })
    })
  }

  vm.deleteNode = function () {
    hideContextMenu();
    var node = vm.tree.getSelectedNodes()[0];
    var isFolder = node.isCatalog === '1';
    var msg = (node.isCatalog === '1') ? ('将同时删除 ' + node.name + ' 下所有内容，确认删除？') : ('确认删除项目 ' + node.name + ' ?');
    var result = dialog.confirm(msg);
    result.then(function (res) {
      if (res) {
        CheckItemService.deleteCICatalog(node.id).then(function (response) {
          if (response.data.success) {
            vm.tree.removeNode(node);
            vm.checkItems = [];
          } else {
            toastr.error(response.data.message);
          }
        }).catch(function (err) {
          toastr.error(err.data);
        })
      }
    })
  }

  vm.editCheckItem = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/checkItem/manage/edit-checkitem/editCheckitem.html',
      controller: 'ManageEditCheckItemCtrl as vm',
      resolve: {
        checkItem: function () {return item;},
        units: ['$rootScope', '$q', 'UnitService', function ($rootScope, $q, UnitService) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          UnitService.getUnitList().then(function (response) {
            if (response.data.success) {
              var res = [];
              angular.forEach(response.data.entity, function (item) {
                res.push(item.unitName);
              })
              deferred.resolve(res);
            } else {
              deferred.resolve([]);
            }
          });
          return deferred.promise;
        }],
        organizations: ['$rootScope', '$q', function ($rootScope, $q) {
          $rootScope.loading = true;
          var deferred = $q.defer();
          PrivilegeService.getOrganizationList().then(function (response) {
            if (response.data.success) {
              deferred.resolve(response.data.entity);
            } else {
              deferred.reject();
            }
          });
          return deferred.promise;
        }]
      }
    });

    modalInstance.result.then(function (res) {
      vm.getCatalogCheckItems(vm.selectedNode.id);
      toastr.success('检测项修改成功！');
    });
  }

  vm.deleteCheckItem = function (item) {
    var node = vm.tree.getSelectedNodes()[0];
  	var result = dialog.confirm('确认从 ' + node.name + ' 中删除检测项 ' + item.name + ' ?');
    result.then(function (res) {
      if (res) {
        CheckItemService.deleteCatalogCi(item.id).then(function (response) {
          if (response.data.success) {
		    		vm.getCatalogCheckItems(node.id);
            toastr.success('删除成功！');
          } else {
            toastr.error(response.data.message);
          }
        }).catch(function (error) {
          toastr.error(error.data.message)
        });
      }
    })
  }

  vm.importFile = function (event) {
    var file = event.target.files[0];
    if (!/\.xlsx?$/.test(file.name)) {
      toastr.error('请选择excel文件！');
      return;
    }
    hideContextMenu();
    var catalogId = vm.tree.getSelectedNodes()[0].id;

    Upload.upload({
      url: '/api/v1/ahgz/checkitemscatalog/item/mapping/import',
      headers: {
        Authorization: 'Bearer ' + $cookies.get('token')
      },
      data: {
        catalogId: catalogId,
        file: event.target.files[0]
      }
    }).then(function (response) {
      if (response.data.success) {
        toastr.success('导入成功！');
        vm.getCatalogCheckItems(catalogId);
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      toastr.error(err.data);
    });
  }

  vm.copy = function () {
    toastr.success('复制成功！')
    vm.copiedItems = vm.selectedItems
  }

  vm.paste = function () {
  	hideContextMenu();
    var node = vm.tree.getSelectedNodes()[0];
    var promiseArr = [];
    angular.forEach(vm.copiedItems, function (item) {
      var data = angular.merge({}, item, {
        catalogId: node.id,
        checkItemId: item.id
      });
      promiseArr.push(CheckItemService.recordCatalogCi(data));
    })
    $q.all(promiseArr).then(function () {
      vm.getCatalogCheckItems(node.id);
      toastr.success('添加成功！');
    });
  }

  // 单选、复选
  vm.itemSelected = [];
  vm.selectedItems = [];
  vm.selectAll = function () {
    if (vm.allSelected){
      vm.selectedItems = [];
      angular.forEach(vm.checkItems, function (item, idx) {
        vm.selectedItems.push(item);
        vm.itemSelected[idx] = true;
      });
    } else {
      vm.selectedItems = [];
      angular.forEach(vm.checkItems, function (item, idx) {
        vm.itemSelected[idx] = false;
      });
    }
  }

  vm.selectItem = function (event, idx, item) {
    if(event.target.checked){
      vm.selectedItems.push(item);
      vm.itemSelected[idx] = true;
      if(vm.selectedItems.length == vm.checkItems.length){
        vm.allSelected = true;
      }
    } else {
      for (var i=0,len=vm.selectedItems.length; i<len; i++){
        if (item.id == vm.selectedItems[i].id) {
          vm.selectedItems.splice(i, 1);
          break;
        }
      };
      vm.itemSelected[idx] = false;
      vm.allSelected = false;
    }
  }

  $scope.$on('destroy')

});
