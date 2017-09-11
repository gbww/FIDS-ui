'use strict';

angular.module('com.app').controller('CheckItemManageCtrl', function ($scope, $state, $uibModal, $q, api, CheckItemService, toastr, dialog) {
  var vm = this;
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
  	vm.ciLoading = true;
  	CheckItemService.getCheckItemsTree(id).then(function (response) {
  		vm.ciLoading = false;
  		if (response.data.success) {
  			vm.checkItems = response.data.entity;
  		} else {
  			toastr.error(response.data.message);
  		}
  	}).catch(function (err) {
  		vm.ciLoading = false;
  		toastr.error(err.data.message);
  	})
  }

  vm.getCatalog = function () {
  	// 获取根目录信息
  	CheckItemService.getCICatalogInfo('1').then(function (response) {
  		var data = response.data.entity;
  		angular.merge(data, {name: data.productName, isParent: data.isCatalog=='1'})
	    vm.tree = $.fn.zTree.init($("#inspectTree"), setting, data);
	    if (data.isCatalog == '0') {
		    vm.getCatalogCheckItems('1');
	    }
  	})
  }
  vm.getCatalog();


  function expandNode (event, treeId, treeNode) {
  	if (!treeNode.children) {
      $('#' + treeNode.tId).find("#" + treeNode.tId + '_ico').removeClass().addClass('button ico_loading');
	  	CheckItemService.getChildCatalog(treeNode.id).then(function (response) {
        $('#' + treeNode.tId).find("#" + treeNode.tId + '_ico').removeClass().addClass('button ico_open');
	  		if (response.data.success) {
	  			var data = response.data.entity;
	  			angular.forEach(data, function (item) {
	  				if (item.isCatalog == '1') {
	  					// 目录节点
							angular.merge(item, {name: item.productName, isParent: true})
						} else {
	  					// 检测项集合节点
							angular.merge(item, {name: item.productName})
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

  function showContextMenu () {
    $(".context-menu").show();
  }
  function hideContextMenu () {
    $(".context-menu").hide();
  }

  function showRMenu (type, x, y) {
    x = x + document.body.scrollLeft - $("#inspectTree").offset().left + 15;
    y = y + document.body.scrollTop - $("#inspectTree").offset().top + 15;
    $('.context-menu').css({
      top: y + 'px',
      left: x + 'px'
    });
    showContextMenu();
  }
  $("body").bind('mousedown', function (event) {
    if ($(event.target).parents(".context-menu").length == 0) {
    	hideContextMenu();
      }
  })

  vm.addNode = function () {
    hideContextMenu();
    var parentNode = vm.tree.getSelectedNodes()[0];
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/checkItem/manage/add-catalog/addCatalog.html',
      controller: 'BusinessAddCatalogCtrl as vm'
    });

    modalInstance.result.then(function (catalog) {
    	var data = angular.merge({}, catalog, {parentId: parentNode.id});
    	CheckItemService.addCICatalog(data).then(function (response) {
    		if (response.data.success) {
    			if (catalog.isCatalog == '1') {
	    			var nodeData = angular.merge({}, data, {name: data.productName, isParent: true})
    			} else {
	    			var nodeData = angular.merge({}, data, {name: data.productName});
    			}
		    	vm.tree.addNodes(parentNode, -1, nodeData);
    		}	else {
    			toastr.error(response.data.message);
    		}
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
      templateUrl: 'controllers/business/checkItem/manage/add-checkitem/addCheckItem.html',
      controller: 'AddCatalogCiCtrl as vm'
    });

    modalInstance.result.then(function (res) {
    	var promiseArr = [];
    	angular.forEach(res, function (checkItemId) {
    		var data = {
    			catalogId: node.id,
    			checkItemId: checkItemId,
    			laborary: null
    		}
    		promiseArr.push(CheckItemService.recordCiToCatalog(data));
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
      templateUrl: 'controllers/business/checkItem/manage/edit-catalog/editCatalog.html',
      controller: 'BusinessEditCatalogCtrl as vm',
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
    CheckItemService.deleteCICatalog(node.id).then(function (response) {
    	if (response.data.success) {
		    vm.tree.removeNode(node);
    	} else {
    		toastr.error(response.data.message);
    	}
    }).catch(function (err) {
    	toastr.error(err.data.message);
    })
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


});
