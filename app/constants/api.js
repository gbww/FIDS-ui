'use strict';

angular.module('com.app').constant('api', {
  breadCrumbMap: {
    dashboard: {
      root: {name: '概览'}
    },
    business: {
      root: {name: '业务管理'},
      contract: {
        root: {name: '合同管理', url: 'app.business.contract'},
        create: {name: '合同登记', url: 'app.business.contract.create'},
        detail: {name: '合同详情', url: 'app.business.contract.detail'}
      },
      checkItem: {
        root: {name: '检测项管理', url: 'app.business.checkItem'},
        list: {name: '列表管理', url: 'app.business.checkItem.list'},
        manage: {name: '自定义管理', url: 'app.business.checkItem.manage'}
      },
      inspection: {
        root: {name: '检测项目', url: 'app.business.inspection'}
      }
    },
    privilege: {
    	root: {name: '用户管理'},
      organization: {
        root:{ name: '部门', url: 'app.privilege.organization'}
      },
      user: {
        root:{name: '用户', url: 'app.privilege.user'}
        // create:{name:'创建用户',url:'app.privilege.user.create'},
        // modify:{name:'修改用户',url:'app.privilege.user.modify'}
      },
      role: {
        root:{ name: '角色', url: 'app.privilege.role'}
        // create:{name:'创建角色',url:'app.privilege.role.create'},
        // modify:{name:'修改角色',url:'app.privilege.role.modify'}
      }
    }
  }
});
