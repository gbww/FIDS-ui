'use strict';

angular.module('com.app').controller('ReviewCompanyCtrl', function ($rootScope, $state, $q, $uibModal, api, ReviewService, toastr, dialog) {
  var vm = this;

  var reviewBC = api.breadCrumbMap.review;
  vm.breadCrumbArr = [reviewBC.root, reviewBC.company.root];

  vm.searchObject = {
    searchKeywords: ''
  }

  vm.refreshTable = function (flag) {
    vm.searchObject.timestamp = new Date();
    if (flag == 'delete') {
      vm.searchObject.totalCount = vm.total - 1;
    }
  }

  vm.companys = [];
  vm.loading = true;
  vm.getCompanyList = function (tableState) {
    var tableParams = {
      "pageSize": tableState.pagination.number,
      "pageNum": Math.floor(tableState.pagination.start / tableState.pagination.number) + 1,
    }
    ReviewService.getCompanyList(tableParams, vm.searchObject.searchKeywords).then(function (response) {
      vm.loading = false;
      vm.companys = [
        {
          id: 1, comName: 'name', comType: '食品销售', comPrincipal: 'principal', comCreditCode: 'creditCode',
          comLicence: 'licence', comAddress: 'address', comScale: 'scale3', comScaleScore: 3,
          comVariety: 'variety5', comVarietyScore: 5, comTelephone: '1234', updatedAt: new Date()
        }
      ]
      vm.total = 1;
      tableState.pagination.numberOfPages = 1;
      // if (response.data.success) {
      //   vm.companys = response.data.entity.list;
      //   vm.total = response.data.entity.total;
      //   tableState.pagination.numberOfPages = response.data.entity.pages;
      // } else {
      //   vm.total = 0;
      //   toastr.error(response.data.message);
      // }
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

  function getResourceList (resource) {
    $rootScope.loading = true;
    var deferred = $q.defer(), promise;
    if (resource === 'variety') {
      promise = ReviewService.getVarietyList()
    } else if (resource === 'scale') {
      promise = ReviewService.getScaleList()
    }
    promise.then(function (response) {
      $rootScope.loading = false;
      if (resource === 'variety') {
        deferred.resolve([
          {id: 0, comType: '食品生产', liebie: '', comVariety: 'variety0', score: 0},
          {id: 1, comType: '食品生产', liebie: '', comVariety: 'variety1', score: 1},
          {id: 2, comType: '食品销售', comVariety: 'variety2', score: 2},
          {id: 3, comType: '食品销售', comVariety: 'variety3', score: 3},
          {id: 4, comType: '餐饮服务', comVariety: 'variety4', score: 4},
          {id: 5, comType: '餐饮服务', comVariety: 'variety5', score: 5}
        ])
      } else if (resource === 'scale') {
        deferred.resolve([
          {id: 0, comType: '食品生产', scale: 'scale0', score: 0},
          {id: 1, comType: '食品生产', scale: 'scale1', score: 1},
          {id: 2, comType: '食品销售', scale: 'scale2', score: 2},
          {id: 3, comType: '食品销售', scale: 'scale3', score: 3},
          {id: 4, comType: '餐饮服务', scale: 'scale4', score: 4},
          {id: 5, comType: '餐饮服务', scale: 'scale5', score: 5}
        ])
      }
      // if (response.data.success) {
      //   deferred.resolve(response.data)
      // } else {
      //   deferred.reject();
      //   toastr.error(response.data.message)
      // }
    }).catch(function (err) {
      $rootScope.loading = false;
      deferred.reject();
      toastr.error(err.data)
    })
    return deferred.promise; 
  }

  vm.create = function () {
		var modalInstance = $uibModal.open({
  		animation: true,
  		size: 'md',
  		backdrop: 'static',
  		templateUrl: 'controllers/review/company/create/create.html',
      controller: 'CompanyCreateCtrl as vm',
      resolve: {
        varietyList: function () {
          return getResourceList('variety')
        },
        scaleList: function () {
          return getResourceList('scale')
        },
      }
  	});

  	modalInstance.result.then(function () {
      vm.refreshTable();
		  toastr.success("企业添加成功！");
  	})
  }

  vm.edit = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      backdrop: 'static',
      templateUrl: 'controllers/review/company/edit/edit.html',
      controller: 'CompanyEditCtrl as vm',
      resolve: {
        company: function () {return angular.copy(item);},
        varietyList: function () {
          return getResourceList('variety')
        },
        scaleList: function () {
          return getResourceList('scale')
        },
      }
    });

    modalInstance.result.then(function () {
      vm.refreshTable();
      toastr.success("企业修改成功！");
    })
  }

  vm.delete = function (company) {
    var result = dialog.confirm('确认删除企业 ' + company.name + ' ?');
    result.then(function (res) {
      if (res) {
        ReviewService.deleteCompany(company.id).then(function (response) {
          if (response.data.success) {
            vm.refreshTable('delete');
            toastr.success('企业删除成功！');
          } else {
            toastr.error(response.data.message);
          }
        }).catch(function (error) {
          toastr.error(error.data.message)
        });
      }
    })
  }


  vm.lanuchReview = function (company) {
    var result = dialog.confirm('确认对企业 ' + company.comName + ' 发起审核?');
    result.then(function (res) {
      if (res) {
        // ReviewService.getReportId(item.id).then(function (response) {
        //   if (response.data.success) {
            var modalInstance = $uibModal.open({
              animation: true,
              size: 'lg',
              backdrop: 'static',
              templateUrl: 'controllers/review/company/addReviewer/addReviewer.html',
              controller: 'ProjectReviewerCtrl as vm',
              resolve: {
                // reportId: function () {return response.data},
                reportId: function () {return '123'},
              }
            })
            modalInstance.result.then(function () {
              $state.go('app.review.company.report.project', {companyId: company.id, reportId: '123'})
            })
        //   } else {
        //     toastr.error(response.data.message)
        //   }
        // }).catch(function (err) {
        //   toastr.error(err.data)
        // })
      }
    })
  }

});
