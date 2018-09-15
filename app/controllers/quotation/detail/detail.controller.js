'use strict';

angular.module('com.app').controller('QuotationDetailController', function ($stateParams, api, toastr, QuotationService) {
  var vm = this;
  vm.type = $stateParams.type;

  var quotationBC = api.breadCrumbMap.quotation;
  var detail = quotationBC.detail;
  vm.breadCrumbArr = [quotationBC.root, quotationBC.detail];

  vm.showClient = true

  vm.positions = [
    {label: '右下角', value: 'bottomRight'},
    {label: '右上角', value: 'topRight'},
    {label: '左下角', value: 'bottomLeft'},
    {label: '左上角', value: 'topLeft'},
    {label: '自定义', value: 'custom'},
  ]

  vm.position = {
    stampPosition: vm.positions[0].value,
    left: '96%',
    top: '96%'
  }

  vm.changePosition = function () {
    if (vm.position.stampPosition === 'bottomRight') {
      vm.position.left = '96%'
      vm.position.top = '96%'
    } else if (vm.position.stampPosition === 'topRight') {
      vm.position.left = '96%'
      vm.position.top = '6%'
    } else if (vm.position.stampPosition === 'bottomLeft') {
      vm.position.left = '6%'
      vm.position.top = '96%'
    } else if (vm.position.stampPosition === 'topLeft') {
      vm.position.left = '6%'
      vm.position.top = '6%'
    }
  }

  vm.quotation = {
    items: []
  }

  vm.step = 1;

  if (vm.type === 'create') {
    detail.name = '新建报价单';
    vm.itemArr = [{
      name: null,
      specification: null,
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
      specification: null,
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

  vm.computeTotalPrice = function (idx) {
    if (vm.itemArr[idx].quantity && vm.itemArr[idx].price)
    vm.itemArr[idx].total = parseFloat((vm.itemArr[idx].quantity * vm.itemArr[idx].price).toFixed(2))
  }


  vm.addFile = function (event) {
    var selectedFile = event.target.files[0];
    vm.filename = selectedFile.name;
  }

  var options = {
    items: ['undo', 'redo', 'cut', 'copy', 'paste', 'formatblock', 'fontname', 'fontsize', 'forecolor',
             'bold', 'italic', 'lineheight', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'table'],
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