'use strict';

angular.module('com.app').controller('ReportDetailCtrl', function ($rootScope, $state, $stateParams, $q, $uibModal, api, toastr, SampleService, ReportService, users, templates) {
  var vm = this;
  $rootScope.loading = false;

  vm.type = $stateParams.type;
  vm.status = $stateParams.status;
  vm.taskId = $stateParams.taskId;
  vm.templates = templates;
  vm.users = users;

  var businessBC = api.breadCrumbMap.business;
  var report = angular.copy(businessBC.report.root);
  report.params = {
    status: vm.status
  }
  var detail = angular.copy(businessBC.report.detail);
  if (vm.type === 'bz') {
    detail.name = '编制报告';
  }
  vm.breadCrumbArr = [businessBC.root, report, detail];

  vm.showReport = true;
  vm.showReportCi = true;

  vm.getReportInfo = function () {
    vm.loading = true;
    $q.all({
      report: ReportService.getReportInfo($stateParams.id),
      checkItem: ReportService.getReportCi($stateParams.id)
    }).then(function (response) {
      vm.loading = false;
      if (response.report.data.success) {
        vm.report = response.report.data.entity.receiveSample;
        if (!vm.report.drawUser) {
          vm.report.drawUser = api.userInfo.username;
        }

        var reportExtend = response.report.data.entity.reportExtend;
        if (reportExtend) {
          vm.tmplId = reportExtend.id;
          vm.templateId = reportExtend.templateId
          vm.initTemplateId = reportExtend.templateId
        }
      } else {
        toastr.error(response.report.data.message);
      }

      if (response.checkItem.data.success) {
        vm.checkItems = response.checkItem.data.entity;
      } else {
        toastr.error(response.checkItem.data.message);
      }

      if (!vm.report.dataRemarks && vm.checkItems) {
        completeDataRemarks();
      }
    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    });
  };
  vm.getReportInfo();


  /**
   * 根据检测项自动填充数据页备注
   */
  function completeDataRemarks() {
    var quantitationLimitStr = [], detectionLimitStr = [];
    angular.forEach(vm.checkItems, function (checkItem) {
      if (checkItem.measuredValue === '未检出') {
        var str = checkItem.name + ' ' + checkItem.standardValue + checkItem.unit;
        if (checkItem.quantitationLimit) {
          quantitationLimitStr.push(str)
        } else if (checkItem.detectionLimit) {
          detectionLimitStr.push(str)
        }
      }
    });
    var str = '';
    if (quantitationLimitStr.length > 0) {
      str += '1、方法定量限：' + quantitationLimitStr.join('，') + '。';
      if (detectionLimitStr.length > 0) {
        str += '2、方法检出限：' + detectionLimitStr.join('，') + '。';
      }
    } else if (detectionLimitStr.length > 0) {
      str += '1、方法检出限：' + detectionLimitStr.join('，') + '。';
    }
    vm.report.dataRemarks = str;
  }


  vm.changeContract = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      backdrop: 'static',
      templateUrl: 'controllers/business/sample/create/select-contract/selectContract.html',
      controller: 'SelectContractCtrl as vm'
    });

    modalInstance.result.then(function (res) {
      vm.report.protocolId = res;
    })
  }


  /**
   * 附件操作
   */
  vm.deleteAppendix = function () {
    delete vm.report.appendix;
  }
  vm.file = null;
  vm.addFile = function (event) {
    vm.file = event.target.files[0];
    vm.deleteAppendix();
  }
  vm.deleteFile = function () {
    vm.file = null;
  }

  vm.downloadFile = function (filepath) {
    var filename = filepath.substring(filepath.lastIndexOf('/') + 1);
    var link = document.createElement('a');
    link.href = '/api/v1/ahgz/receive/attachment/download?path=' + filepath;
    link.download = filename;
    link.click();
  };


  
  /**
   * 确认时同时更新报告内容和模板信息
   */

  vm.updateReport = function () {
    var data = angular.copy(vm.report);
    if (vm.type === 'bz') {
      data.drawUser = api.userInfo.username;
      data.reportStatus = 1;
    }
    ReportService.updateReport(data).then(function (response) {
      if (response.data.success) {
        toastr.success('报告修改成功！');
        $state.go('app.business.report', { status: vm.status });
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      toastr.error(err.data);
    })
  }

  vm.ok = function (form) {
    if (form.$invalid) {
      vm.submitted = true;
      return;
    }

    /**   
     * 上传、修改附件
     */
    if (vm.file) {
      var formData = new FormData();
      formData.append('file', vm.file);
      formData.append('receiveSampleId', vm.report.receiveSampleId);
      SampleService.uploadSampleAppendix(formData).catch(function (err) {
        toastr.error(err.data);
      })
    }


    if (vm.type === 'bj') {
      var data = {
        reportId: vm.report.reportId
      }
      angular.forEach(vm.templates, function (item) {
        if (item.id === vm.templateId) {
          angular.merge(data, {
            templateId: vm.templateId,
            templateName: item.name,
            templateDesc: item.description
          })
        }
      });

      // 绑定模板
      if (!vm.initTemplateId) {
        ReportService.bindReportTmpl(data).then(function () {
          return ReportService.startProcess(vm.report.receiveSampleId);
        }).then(function () {
          vm.updateReport();
        }).catch(function (err) {
          toastr.error(err.data);
        })
      } else {
        // 更新模板
        if (!angular.equals(vm.templateId, vm.initTemplateId)) {
          ReportService.updateReportTmpl(vm.tmplId, data).then(function () {
            vm.updateReport();
          }).catch(function (err) {
            toastr.error(err.data);
          })
        } else {
          vm.updateReport();
        }
      }
    } else {
      var data = {
        // editPerson: api.userInfo.username,
        examinePersonName: vm.report.examineUser,
        reportProcessId: vm.report.reportProcessId,
        receiveSampleId: vm.report.receiveSampleId,
        comment: vm.comment,
      };
      ReportService.runEditTask(vm.taskId, data).then(function (response) {
        if (response.data.success) {
          vm.updateReport();
        } else {
          toastr.error(response.data.message);
        }
      })
    }
  }


  /** 
   * 检测项操作
  */

  function getSampleCi () {
    ReportService.getReportCi($stateParams.id).then(function (response) {
      if (response.data.success) {
        vm.checkItems = response.data.entity;
      } else {
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      toastr.error(err.data);
    });
  }

  vm.edit = function (ci) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/business/sample/detail/ci/edit/edit.html',
      controller: 'EditSampleCiCtrl as vm',
      resolve: {
        sampleId: function () { return vm.report.receiveSampleId; },
        checkItem: function () { return ci; }
      }
    });

    modalInstance.result.then(function (res) {
      toastr.success('检测项修改成功！');
      getSampleCi();
    });
  }

  vm.delete = function (ci) {
    var result = dialog.confirm('确认从接样单中删除检测项 ' + ci.name + ' ?');
    result.then(function (res) {
      if (res) {
        SampleService.deleteSampleCi(vm.report.receiveSampleId, [ci.id]).then(function (response) {
          if (response.data.success) {
            getSampleCi();
            toastr.success('接样单检测项删除成功！');
          } else {
            toastr.error(response.data.message);
          }
        }).catch(function (error) {
          toastr.error(error.data.message)
        });
      }
    })
  }

  // 判定结论
  vm.determineArr = [' ', '/', '合格', '不合格'];
  vm.resultDict = {
    ' ': ['该样品按照 标准检验，结果见附页。'],
    '/': ['详见“检测结果”。'],
    '合格': [
      '该批次产品经检验，符合《 》标准的要求。',
      '该批次产品依据“农业部办公厅关于印发茄果类蔬菜等58类无公害农产品检测目录的通知（农质部[2015]4号）”中\'     \'的要求检验，结果符合规定。',
      '该样品按照&[检验依据]标准检验，所检项目均合格。',
      '经抽样检验，所检项目符合 标准要求。'
    ],
    '不合格': [
      '该批次产品依据“农业部办公厅关于印发茄果类蔬菜等58类无公害农产品检测目录的通知（农质部[2015]4号）”中\'     \'的要求检验，结果不符合规定。',
      '该样品按照&[检验依据]标准检验，不合格。',
      '经抽样检验，    项目不符合《》标准要求，检验结论为不合格。'
    ]
  }
  

  vm.checkTypeArr = ['监督检验', '委托检验', '发证检验', '认证检验', '省级抽检', '风险监测'];
  vm.reportLinkArr = ['流通环节', '餐饮环节', '生产环节'];

  vm.reportLxArr = ['食用农产品', '工业加工食品', '餐饮加工食品', '保健食品', '食品添加剂', '食品相关产品', '其他'];
  vm.packageClassifyArr = ['预包装', '散装'];

  vm.reportWayArr = ['随机抽样', '掷骰抽样'];
  vm.specificationModelArr = ['计量称重', '散装', 'kg/袋', 'g/袋', 'ml/瓶', 'L/瓶', 'L/桶', 'g/盒', 'kg/盒', 'ml/盒', 'L/盒'];
  vm.executeStandardArr = ['GB/T 23587-2009'];
  vm.processingTechnologyArr = ['合格品', '优等品', '一等品', '二等品', '三等品', '四等品',];
  vm.closedStatusArr = ['封样完好', '封样破损'];
  vm.reportStatusArr = ['固体', '液体', '半固体', '气体', '完好、新鲜、无异味', '腐烂、有异味'];
  vm.reportBasenumberArr = ['瓶', '袋', 'g', 'kg', 'L', 'ml'];
  vm.saveWayArr = ['常温', '冷冻', '冷藏'];
  vm.reportNamesArr = ['鲍仕峰 陶云飞', '杨洋 李振凡', '张磊 徐斌'];
  vm.responsiblePersonArr = [];
  vm.receiveUserArr = [];
});
