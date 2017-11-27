'use strict';

angular.module('com.app').constant('api', {
  breadCrumbMap: {
    dashboard: {
      root: {name: '概览'}
    },
    report: {
      root: {name: '报告管理', url: 'app.report'},
      detail: {name: '详情', url: 'app.report.detail'}
    },
    itemToCheck: {
      root: {name: '检测结果录入'}
    },
    checkItem: {
      root: {name: '项目库'},
      list: {name: '检测项管理', url: 'app.checkItem.list'},
      manage: {name: '自定义管理', url: 'app.checkItem.manage'}
    },
    func: {
      root: {name: '功能管理'},
      template: {name: '模板管理', url: 'app.func.template'}
    },
    business: {
      root: {name: '业务管理'},
      contract: {
        root: {name: '合同管理', url: 'app.business.contract'},
        create: {name: '合同登记', url: 'app.business.contract.create'},
        detail: {name: '合同详情', url: 'app.business.contract.detail'}
      },
      sample: {
        root: {name: '抽样单管理', url: 'app.business.sample'},
        create: {name: '抽样录入', url: 'app.business.sample.create'},
        detail: {name: '抽样单详情', url: 'app.business.sample.detail'}
      }
    },
    privilege: {
    	root: {name: '用户管理'},
      organization: {
        root:{ name: '部门', url: 'app.privilege.organization'}
      },
      currentUser: {
        root:{name: '个人信息', url: 'app.privilege.currentUser'}
      },
      user: {
        root:{name: '用户', url: 'app.privilege.user'}
      },
      role: {
        root:{ name: '角色', url: 'app.privilege.role'}
      }
    }
  }
});
