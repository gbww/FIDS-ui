'use strict';

angular.module('com.app').constant('api', {
  breadCrumbMap: {
    dashboard: {
      root: {name: '概览'}
    },
    statistic: {
      root: {name: '统计查询'}
    },
    checkItem: {
      root: {name: '项目库'},
      list: {name: '检测项管理', url: 'app.checkItem.list'},
      manage: {name: '自定义管理', url: 'app.checkItem.manage'}
    },
    unit: {
      root: {name: '单位库管理'}
    },
    func: {
      root: {name: '文件管理'},
      template: {name: '模板管理', url: 'app.func.template'},
      frtemplate: {name: '帆软模板管理', url: 'app.func.frtemplate'}
    },
    review: {
      root: {name: '企业审核管理'},
      company: {
        root: {name: '企业管理', url: 'app.review.company'},
        report: {
          root: {name: '企业报告', url: 'app.review.company.report'},
          project: {name: '项目', url: 'app.review.company.report.project'}
        }
      },
      searchCompany: {
        root: {name: '企业查询', url: 'app.review.searchCompany'},
        report: {
          root: {name: '企业报告', url: 'app.review.searchCompany.report'},
          project: {name: '项目', url: 'app.review.searchCompany.report.project'}
        }
      },
      project: {name: '项目明细', url: 'app.review.project'}
    },
    client: {
      root: {name: '客户管理', url: 'app.client'},
      detail: {name: '客户详情'}
    },
    device: {
      root: {name: '设备管理', url: 'app.device'},
      detect: {name: '检验设备'}
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
        inspection: {name: '查看报告', url: 'app.business.report.inspection'},
        detail: {name: '编辑报告', url: 'app.business.report.detail'}
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
