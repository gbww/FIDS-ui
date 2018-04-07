'use strict';

angular.module('com.app').controller('QuotationDetailController', function ($stateParams, api, toastr, QuotationService) {
  var vm = this;
  vm.type = $stateParams.type;

  var quotationBC = api.breadCrumbMap.quotation;
  var detail = quotationBC.detail;
  vm.breadCrumbArr = [quotationBC.root, quotationBC.detail];

  vm.step = 1;

  if (vm.type === 'create') {
    detail.name = '新建报价单';
    vm.itemArr = [{
      name: null,
      gg: null,
      quantity: null,
      unit: null,
      price: null,
      total: null,
      remark: null
    }];
  } else {

  }

  vm.addItem = function () {
    vm.itemArr.push({
      name: null,
      gg: null,
      quantity: null,
      unit: null,
      price: null,
      total: null,
      remark: null
    });
  }

  vm.deleteItem = function (idx) {
    vm.itemArr.splice(idx, 1);
    if (vm.itemArr.length === 0) {
      vm.addItem();
    }
  }



  var options = {
    items: ['undo', 'redo', 'cut', 'copy', 'paste', 'formatblock', 'fontname', 'fontsize', 'forecolor', 'bold', 'italic', 'lineheight', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'table'],
  }

  vm.editorTop = KindEditor.create('#tmpl-top', options);
  vm.editorBottom = KindEditor.create('#tmpl-bottom', options);

  vm.preview = function () {
    var win = window.open('', '预览');
    win.document.write('<html><head><title>预览</title>' +
      '<link rel="stylesheet" type="text/css" href="main.css"></head><body style="background-color:#ccc">');
    win.document.write('<div class="quotation-preview-content"><div><div class="top">');
    win.document.write(vm.editorTop.html());
    win.document.write('</div><div class="bottom">');
    win.document.write(vm.editorBottom.html());
    win.document.write('</div></div></div></body></html>');
    win.document.close();
  }
})