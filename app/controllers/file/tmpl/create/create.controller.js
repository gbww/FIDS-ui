'use strict';

angular.module('com.app').controller('TmplCreateCtrl', function ($uibModal, TemplateService, toastr, dialog) {
  var vm = this;

  var options = {
    items: ['undo', 'redo', 'cut', 'copy', 'paste', 'formatblock', 'fontname', 'fontsize', 'forecolor', 'bold', 'italic', 'lineheight', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'table', 'pagebreak', 'image', 'preview', 'print', 'fullscreen'],
    uploadJson: '/upload', // 图片上传api地址
    pagebreakHtml: '<div style="page-break-after: always;" class="ke-pagebreak"></div>'
  }
  // vm.editor = KindEditor.create('#tmpl', options);

  vm.save = function () {
    console.log(vm.editor.html());
  }
  vm.print = function () {
    var nodes = $('iframe').contents().find('.ke-pagebreak')
    // 加pager
    nodes.removeClass('ke-pagebreak');
    vm.editor.clickToolbar('print');
    // 删除pager
    nodes.addClass('ke-pagebreak');
  }



  var LODOP; //声明为全局变量
  vm.design = function () {
		var strFormHtml = $('.wrapper').html();
		LODOP.PRINT_INIT("测试");	
		LODOP.ADD_PRINT_TABLE(50,50,'100%','100%',strFormHtml);
    LODOP.PRINT_DESIGN();
  }
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
  };	
  


});