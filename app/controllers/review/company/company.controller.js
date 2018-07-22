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
      if (response.data.success) {
        vm.companys = response.data.entity.list;
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
      if (response.data.success) {
        deferred.resolve(response.data.entity)
      } else {
        deferred.reject();
        toastr.error(response.data.message)
      }
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
    var result = dialog.confirm('确认删除企业 ' + company.comName + ' ?');
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
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      backdrop: 'static',
      templateUrl: 'controllers/review/company/addReviewer/addReviewer.html',
      controller: 'ProjectReviewerCtrl as vm',
      resolve: {
        companyId: function () {return company.id},
        reportId: function () {return null},
        reviewers: function () {return null}
      }
    })
    modalInstance.result.then(function (reportId) {
      $state.go('app.review.company.report.project', {companyId: company.id, reportId: reportId})
    })
  }

});
