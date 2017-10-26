'use strict';

angular.module('com.app').controller('DashboardCtrl', function ($state, $timeout, api, DashboardService) {
  var vm = this;

  vm.breadCrumbArr = [api.breadCrumbMap.dashboard.root];

  vm.judgeContracts = [];
  vm.getJudgeContractList = function () {
  	vm.judgeLoading = true;
  	DashboardService.getJudgeContractList().then(function (response) {
  		$timeout(function () {
		  	vm.judgeLoading = false;
	  		vm.judgeContracts = response.data.contractList;
  		}, 1000);
  	})
  }
  // vm.getJudgeContractList();
  vm.goContract = function (id) {
    $state.go('app.business.contract.detail', {type: 'edit', id: '123456', tab: 'judgement'});
  }

  vm.samples = [];
  vm.getSampleList = function () {
  	vm.samples = [];
  }


  // var DEFAULT_URL = '/mock/data/test.pdf';

  // PDFJS.getDocument(DEFAULT_URL).then(function (pdf) {
  //   var shownPageCount = pdf.numPages < 50 ? pdf.numPages : 50;//设置显示的编码
  //   var $pop = $("#pageContainer")
  //   var getPageAndRender = function (pageNumber) {
  //     pdf.getPage(pageNumber).then(function getPageHelloWorld(page) {
  //       var scale = 'page-width';
  //       var viewport = page.getViewport(scale);
  //       var $canvas = $('<canvas></canvas>').attr({
  //        'height': viewport.height,
  //        'width': viewport.width
  //      });
  //       $pop.append($canvas);

  //       page.render({
  //         canvasContext: $canvas[0].getContext('2d'),
  //         viewport: viewport
  //       });
  //     });
  //     if (pageNumber < shownPageCount) {
  //       pageNumber++;
  //       getPageAndRender(pageNumber);
  //     }
  //   };
  //   getPageAndRender(1);
  // })
});
