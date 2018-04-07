'use strict';

angular.module('com.app').constant('api', {
  breadCrumbMap: {
    dashboard: {
      root: {name: '概览'}
    },
    checkItem: {
      root: {name: '项目库'},
      list: {name: '检测项管理', url: 'app.checkItem.list'},
      manage: {name: '自定义管理', url: 'app.checkItem.manage'}
    },
    func: {
      root: {name: '文件管理'},
      template: {name: '模板管理', url: 'app.func.template'}
    },
    client: {
      root: {name: '客户管理', url: 'app.client'},
      detail: {name: '客户详情'}
    },
    business: {
      root: {name: '业务管理'},
      contract: {
        root: {name: '合同评审', url: 'app.business.contract'},
        create: {name: '合同登记', url: 'app.business.contract.create'},
        detail: {name: '合同详情', url: 'app.business.contract.detail'}
      },
      sample: {
        root: {name: '业务受理', url: 'app.business.sample'},
        create: {name: '抽样录入', url: 'app.business.sample.create'},
        detail: {name: '抽样单详情', url: 'app.business.sample.detail'}
      },
      report: {
        root: {name: '报告', url: 'app.business.report'},
        detail: {name: '报告详情', url: 'app.business.report.detail'}
      },
      itemToCheck: {
        root: {name: '检测结果录入', url: 'app.business.itemToCheck.list'},
        detail: {name: '抽样单详情'}
      },
      distribute: {
        root: {name: '检测项分配', url: 'app.business.distribute'}
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
