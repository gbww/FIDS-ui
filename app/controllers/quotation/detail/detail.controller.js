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

  vm.quotation = {}

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


  vm.clientTable = function () {
    var str = '<table class="client-info-table"><tr><td>客户名称：</td><td>' + vm.quotation.client + '</td><td></td><td>联系人：</td><td>' + vm.quotation.user + '</td></tr>' +
            '<tr><td>客户电话：</td><td>' + (vm.quotation.telephone || '') + '</td><td></td><td>客户传真：</td><td>' + (vm.quotation.fax || '') + '</td></tr>' +
            '<tr><td>客户邮箱：</td><td>' + (vm.quotation.email || '') + '</td><td></td><td>客户地址：</td><td>' + (vm.quotation.address || '') + '</td></tr>' +
            '<tr><td>报价人：</td><td>' + (vm.quotation.offerer || '') + '</td><td></td><td>报价日期：</td><td>' + (vm.quotation.date || '') + '</td></tr>'
    return str
  }
  vm.productTable = function (total) {
    var str = '<table class="product-info-table">' +
            '<tr><th>品名</td><th>规格</td><th>数量</td><th>单位</td><th>单价</td><td>金额</td><td>备注</td></tr>'; 
    for (var i=0, len=vm.itemArr.length; i<len; i++) {
      var item = vm.itemArr[i]
      str += '<tr><td>' + (item.name || '') + '</td><td>' + (item.specification || '') + '</td><td>' + (item.quantity || '') +
            '</td><td>' + (item.unit || '') + '</td><td>' + (item.price || '') + '</td><td>' + (item.total || '') + '</td><td>' + (item.remark || '') + '</td></tr>'
    }
    str += '<tr><td colspan="7" style="text-align:right">总计：' + total + '</td></tr>'
    str += '<tr><td>备注</td><td colspan="6">(' + (vm.quotation.remark || '') + ')</td></tr></table>'
    return str
  }


  vm.preview = function () {
    var total = vm.itemArr.map(function (item) {
      return item.total
    }).reduce(function (total, sum) {
      return total + sum
    })
    var win = window.open('', '预览');
    win.document.write('<html><head><title>预览</title>' +
      '<link rel="stylesheet" type="text/css" href="main.css"></head><body style="background-color:#ccc">');
    win.document.write('<div class="quotation-preview-content"><div><div class="top">');
    win.document.write(vm.editorTop.html());
    win.document.write('</div><div class="table">')
    win.document.write(vm.clientTable() + vm.productTable(total))
    win.document.write('</div><div class="bottom">');
    win.document.write(vm.editorBottom.html());
    win.document.write('</div></div></div></body></html>');
    win.document.close();
  }

  var LODOP; //声明为全局变量
	vm.test = function () {	
    LODOP=getLodop();
		// var strFormHtml="<body>"+$('iframe').contents().find('body').html()+"</body>";
		var strFormHtml = $('.wrapper').html();
		LODOP.PRINT_INIT("测试");	
    // LODOP.ADD_PRINT_TEXT(50,50,260,39,"打印文本");
    LODOP.SET_PRINT_PAGESIZE(1,0,0,"A4")
    LODOP.ADD_PRINT_TABLE('2%', '2%','96%','96%',strFormHtml);
    LODOP.ADD_PRINT_IMAGE(300, 600, 80, 60, "<img src='http://10.139.7.88:8089/var/lib/docs/gzjy/sign/sign.png'>");
		LODOP.PREVIEW();
		// LODOP.PRINT();
  }
})