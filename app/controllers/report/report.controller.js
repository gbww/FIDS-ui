'use strict';

angular.module('com.app').controller('ReportCtrl', function ($state, $uibModal, $timeout, api, toastr, SampleService) {
  var vm = this;

  var reportBC = api.breadCrumbMap.report;
  vm.breadCrumbArr = [reportBC.root];

  vm.searchObject = {
    searchKeywords: ''
  }

  vm.refreshTable = function () {
    vm.searchObject.timestamp = new Date();
  }

  vm.samples = [];
  vm.getSampleList = function (tableState) {
    vm.loading = true;
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
    SampleService.getSampleList(tableParams, vm.searchObject.searchKeywords).then(function (response) {
      vm.loading = false;
      if (response.data.success) {
        vm.samples = response.data.entity.list;
        vm.total = response.data.entity.total;
        tableState.pagination.numberOfPages = response.data.entity.pages;
      } else {
        vm.total = 0;
        toastr.error(response.data.message);
      }
    }).catch(function (err) {
      vm.loading = false;
      toastr.error(err.data);
    })
  }


  vm.search=function(){
    vm.searchObject.searchKeywords = vm.query;
  }

  vm.eventSearch=function(e){
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
      vm.searchObject.searchKeywords = vm.query;
    }
  }

  vm.goDetail = function (id) {
    $state.go('app.report.detail.info', {id: id});
  }

  vm.export = function (sample) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/report/export/export.html',
      controller: 'ReportExportCtrl as vm',
      resolve: {
        sampleId: function () {return sample.receiveSampleId},
        templateMap: ['$rootScope', '$q', 'TemplateService', function ($rootScope, $q, TemplateService) {
          $rootScope.loading = true;
          var deferred = $q.defer();

          TemplateService.filterTemplate().then(function (response) {
            $rootScope.loading = false;
            var coverTemplates = [], reportTemplates = [], bothTemplates = [];
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
          }).catch(function (){
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
      /* 二进制流 */
      // var iframe = document.createElement('iframe');
      // iframe.src = '/api/v1/ahgz/sample/items/report/' + sample.receiveSampleId + '?templateFileName=' + res.name + '&type=' + res.type;
      // iframe.style.display = 'none';
      // document.body.appendChild(iframe);
      // $timeout(function () {
      //   document.body.removeChild(iframe);
      // }, 1000)

      /* base64编码流数据 */
      // SampleService.exportFile(sample.receiveSampleId, res).then(function (response) {
      //   var link = document.createElement('a');
      //   var blob = binaryToBlob(response.data);
      //   link.href = URL.createObjectURL(blob);
      //   link.download = res;
      //   link.click();
      //   URL.revokeObjectURL(link.href);
      // })

      /* 文件路径，需要配置nginx */
      // var link = document.createElement('a');
      // link.href = 'http://' + location.host + '/opt/test.xls';
      // link.download = 'test.xls';
      // link.click();


      var link = document.createElement('a');
      link.href = '/api/v1/ahgz/sample/items/report/' + sample.receiveSampleId + '?type=excel&templateFileName=' + res;
      link.download = res;
      link.click();
    });
  }

  function binaryToBlob(data) {
    var l = data.length, arr = new Uint8Array(l);

    for(var i = 0; i < l; i++) {
      arr[i] = data.charCodeAt(i);
    }

    return new Blob([arr], { type: 'application/vnd.ms-excel'})
  };

  vm.preview = function (sample) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      templateUrl: 'controllers/report/preview/preview.html',
      controller: 'ReportPreviewCtrl as vm',
      resolve: {
        sampleId: function () {return sample.receiveSampleId},
        templateMap: ['$rootScope', '$q', 'TemplateService', function ($rootScope, $q, TemplateService) {
          $rootScope.loading = true;
          var deferred = $q.defer();

          TemplateService.filterTemplate().then(function (response) {
            $rootScope.loading = false;
            var coverTemplates = [], reportTemplates = [], bothTemplates = [];
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
          }).catch(function (){
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
  }

});
