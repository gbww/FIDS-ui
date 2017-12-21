'use strict';

angular.module('com.app').controller('ReportCtrl', function ($scope, $state, $uibModal, $timeout, api, toastr, SampleService) {
  var vm = this;

  var reportBC = api.breadCrumbMap.report;
  vm.breadCrumbArr = [reportBC.root];

  vm.searchObject = {}

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'toggle') {
      vm.searchObject.toggle = true;
    }
  }

  vm.searchConditions = {
    reportId: null,
    sampleName: null,
    entrustedUnit: null,
    inspectedUnit: null,
    productionUnit: null,
    receiveSampleId: null,
    executeStandard: null
  };
  vm.reportIdArr = [], vm.sampleNameArr = [], vm.entrustedUnitArr = [], vm.inspectedUnitArr = [],
    vm.productionUnitArr = [], vm.sampleIdArr = [], vm.exeStandardArr = [];

  vm.status = 0;
  vm.samples = [];
  vm.loading = true;
  vm.getSampleList = function (tableState) {

    var orderBy = tableState.sort.predicate;
    var reverse = tableState.sort.reverse ? 'desc' : 'asc';
    if (orderBy == 'reportId') {
      orderBy = 'report_id'
    } else if (orderBy == 'createdAt') {
      orderBy = 'created_at'
    }
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
      "order": orderBy ? [orderBy, reverse].join(' ') : null
    }
    SampleService.getSampleList(tableParams, vm.searchObject, null, vm.status === 5 ? null : vm.status).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.samples = response.data.entity.list;
        vm.total = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;

        angular.forEach(vm.samples, function (item) {
          if (vm.reportIdArr.indexOf(item.reportId) == -1) {
            vm.reportIdArr.push(item.reportId);
          }
          if (vm.sampleIdArr.indexOf(item.receiveSampleId) == -1) {
            vm.sampleIdArr.push(item.receiveSampleId);
          }
          if (item.sampleName && vm.sampleNameArr.indexOf(item.sampleName) == -1) {
            vm.sampleNameArr.push(item.sampleName);
          }
          if (item.entrustedUnit && vm.entrustedUnitArr.indexOf(item.entrustedUnit) == -1) {
            vm.entrustedUnitArr.push(item.entrustedUnit);
          }
          if (item.inspectedUnit && vm.inspectedUnitArr.indexOf(item.inspectedUnit) == -1) {
            vm.inspectedUnitArr.push(item.inspectedUnit);
          }
          if (item.productionUnit && vm.productionUnitArr.indexOf(item.productionUnit) == -1) {
            vm.productionUnitArr.push(item.productionUnit);
          }
          if (item.executeStandard && vm.exeStandardArr.indexOf(item.executeStandard) == -1) {
            vm.exeStandardArr.push(item.executeStandard);
          }
        })
      } else {
        vm.total = 0;
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    })
  }

  vm.searchStatus = function (filter) {
    if (vm.status != filter) {
      vm.status = filter;
      vm.refreshTable('toggle');
    }
  }

  vm.back = function () {
    vm.advance = false;
    angular.merge(vm.searchConditions, {
      sampleName: null,
      entrustedUnit: null,
      inspectedUnit: null,
      productionUnit: null,
      receiveSampleId: null,
      executeStandard: null
    });
  }

  vm.reset = function () {
    angular.merge(vm.searchConditions, {
      reportId: null,
      sampleName: null,
      entrustedUnit: null,
      inspectedUnit: null,
      productionUnit: null,
      receiveSampleId: null,
      executeStandard: null
    });
  }

  vm.search = function () {
    vm.searchObject = angular.copy(vm.searchConditions);
  }

  vm.eventSearch = function (e) {
    var keycode = window.event ? e.keyCode : e.which;
    if (keycode == 13) {
      vm.searchObject.searchKeywords = vm.query;
    }
  }

  vm.export = function (sample) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/report/export/export.html',
      controller: 'ReportExportCtrl as vm',
      resolve: {
        sampleId: function () {
          return sample.receiveSampleId;
        },
        templateMap: ['$rootScope', '$q', 'TemplateService', function ($rootScope, $q, TemplateService) {
          $rootScope.loading = true;
          var deferred = $q.defer();

          TemplateService.filterTemplate().then(function (response) {
            $rootScope.loading = false;
            var coverTemplates = [],
              reportTemplates = [],
              bothTemplates = [];
            if (response.data.success) {
              var templates = response.data.entity.list;
              angular.forEach(templates, function (item) {
                if (item.category == '0') {
                  coverTemplates.push(item);
                } else if (item.category == '1') {
                  reportTemplates.push(item);
                } else if (item.category == '2') {
                  bothTemplates.push(item);
                }
              })
            }
            deferred.resolve({
              coverTemplates: coverTemplates,
              reportTemplates: reportTemplates,
              bothTemplates: bothTemplates
            })
          }).catch(function () {
            $rootScope.loading = false;
            deferred.resolve({
              coverTemplates: [],
              reportTemplates: [],
              bothTemplates: []
            })
          });
          return deferred.promise;
        }]
      }
    });

    modalInstance.result.then(function (res) {
      var link = document.createElement('a');
      link.href = '/api/v1/ahgz/sample/items/report/' + sample.receiveSampleId + '?type=excel&templateFileName=' + res;
      link.download = res;
      link.click();
    });
  }

  vm.preview = function (sample) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      templateUrl: 'controllers/report/preview/preview.html',
      controller: 'ReportPreviewCtrl as vm',
      resolve: {
        sampleId: function () {
          return sample.receiveSampleId;
        },
        templateMap: ['$rootScope', '$q', 'TemplateService', function ($rootScope, $q, TemplateService) {
          $rootScope.loading = true;
          var deferred = $q.defer();

          TemplateService.filterTemplate().then(function (response) {
            $rootScope.loading = false;
            var coverTemplates = [],
              reportTemplates = [],
              bothTemplates = [];
            if (response.data.success) {
              var templates = response.data.entity.list;
              angular.forEach(templates, function (item) {
                if (item.category == '0') {
                  coverTemplates.push(item);
                } else if (item.category == '1') {
                  reportTemplates.push(item);
                } else if (item.category == '2') {
                  bothTemplates.push(item);
                }
              })
            }
            deferred.resolve({
              coverTemplates: coverTemplates,
              reportTemplates: reportTemplates,
              bothTemplates: bothTemplates
            })
          }).catch(function () {
            $rootScope.loading = false;
            deferred.resolve({
              coverTemplates: [],
              reportTemplates: [],
              bothTemplates: []
            })
          });
          return deferred.promise;
        }]
      }
    });
    modalInstance.result.then(function () {
      vm.refreshTable();
    });
  }
});
