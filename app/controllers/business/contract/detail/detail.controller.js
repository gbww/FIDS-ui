'use strict';

angular.module('com.app').controller('BusinessContractDetailCtrl', function ($scope, $stateParams, $state, api, id, contract) {
  var vm = this;

  vm.type = $stateParams.type;

  var businessBC = api.breadCrumbMap.business;
  var detail = angular.copy(businessBC.contract.detail);
  if (vm.type == 'create') {
  	detail.name = '合同登记';
  } else {
  	detail.name = '合同详情';
  }
  vm.breadCrumbArr = [businessBC.root, businessBC.contract.root, detail];


  vm.tab = 'order';
  vm.shift = function (tab) {
    vm.tab = tab;
    if (tab == 'inspection') {
      vm.tree = $.fn.zTree.init(angular.element("#inspectTree"), setting, vm.treeData);
    }
  }
  vm.entrust_version = 'singleVersion';
  vm.getReportType = 'self';

  if (vm.type == 'create') {
    vm.contract = {
      id: id,
      sample_type: 'food'
    }
  } else {
    vm.contract = angular.merge(contract, {
      sample_type: 'food'
    });
  }

  vm.sample_produce_date = '生产日期';


  vm.checkNode = function (event, treeId, treeNode) {
  }

  vm.contextMenu = function (event, treeId, treeNode) {
    if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
      vm.tree.cancelSelectedNode();
      vm.showRMenu("root", event.clientX, event.clientY);
    } else if (treeNode && !treeNode.noR) {
      vm.tree.selectNode(treeNode);
      vm.showRMenu("node", event.clientX, event.clientY);
    }
  }
  vm.showRMenu = function (type, x, y) {
    x += document.body.scrollLeft;
    y += document.body.scrollTop;
    $('.context-menu').css({
      top: y + 'px',
      left: x + 'px'
    }).show();
  }

  var setting = {
    check: {
      enable: true
    },
    edit: {
      enable: true,
      showRemoveBtn: false,
      showRenameBtn: false,
      drag: {

      },
    },
    callback: {
      onCheck: vm.checkNode,
      onRightClick: vm.contextMenu
    }
  }

  vm.treeData = [
    {name: '项目总表', open: true, children: [
      {name: '苏州食药局', children: [
        {name: '膨化食品', children: [
          {name: '薯片'}
        ]},
        {name: '肉类食品', children: [
          {name: '牛肉'}
        ]}
      ]},
      {name: '2016国抽', children: [
        {name: 'test1'},
        {name: 'test2'}
      ]},
      {name: '2017国抽', children: [
        {name: 'test1'},
        {name: 'test2'}
      ]}
    ]}
  ];

  $("body").bind('mousedown', function (event) {
    if ($(event.target).parents(".context-menu").length == 0) {
        $(".context-menu").hide();
      }
  })


});
