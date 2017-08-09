'use strict';

angular.module('com.app').constant('api', {
  breadCrumbMap: {
    dashboard: {
      root: {name: '概览'}
    },
    business: {
      root: {name: '业务管理'},
      contract: {
        root: {name: '合同', url: 'app.business.contract'},
        detail: {name: '合同详情', url: 'app.business.contract.detail'}
      }
    },
    privilege: {
    	root: {name: '用户管理'},
      user: {
        root:{name: '用户', url: 'app.privilege.user'},
        create:{name:'创建用户',url:'app.privilege.user.create'},
        modify:{name:'修改用户',url:'app.privilege.user.modify'}
      },
      role: {
        root:{ name: '角色', url: 'app.privilege.role'},
        create:{name:'创建角色',url:'app.privilege.role.create'},
        modify:{name:'修改角色',url:'app.privilege.role.modify'}
      }
    }
  }
});
