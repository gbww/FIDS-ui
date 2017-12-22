'use strict';

angular.module('com.app').controller('DashboardCtrl', function (api, DashboardService) {
  var vm = this;
  vm.breadCrumbArr = [api.breadCrumbMap.dashboard.root];

  vm.ctimePeriod = '1d';
  vm.citimePeriod = '6M';
  vm.changeTimePeriod = function (type, time) {
    var timePeriod = '';
    if (time === '1d'){
      timePeriod = '1d';
    } else if (time === '1w'){
      timePeriod = '1w';
    } else if (time === '1M'){
      timePeriod = '1M';
    } else if (time === '3M'){
      timePeriod = '3M';
    } else if (time === '6M'){
      timePeriod = '6M';
    } else{
      timePeriod = '1d';
    }
    if (type === 'contract') {
      vm.ctimePeriod = timePeriod;
    } else if (type === 'checkitem') {
      vm.citimePeriod = timePeriod;
      vm.getAllCi();
    }
  };

  function getFormattedDate(date) {
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' +
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }


  // vm.contractChart = echarts.init(document.getElementById('contract-chart'));
  vm.ciChart = echarts.init(document.getElementById('checkitem-chart'));
  // vm.contractChart.showLoading();
  vm.ciChart.showLoading();

  // 获取各个部门检测项完成情况
  // 0: 待分配 1：待检测 2：完成
  vm.getAllCi = function () {
    var endDate = new Date();  
    // var endTime = endDate.toLocaleString();
    var endTime = getFormattedDate(endDate);
    var startDate = new Date(endDate.getTime() - formatTime(vm.citimePeriod, 'milliSecond'));
    // var startTime = startDate.toLocaleString();
    var startTime = getFormattedDate(startDate);
    DashboardService.getAllCi(startTime, endTime).then(function (response) {
      var department = {};
      vm.allCiXData = [];
      vm.allCiY0Data = [], vm.allCiY1Data = [], vm.allCiY2Data = [];
      angular.forEach(response.data.entity || [], function (item) {
        var testRoom = item.testRoom ? item.testRoom : '未分配';
        if (!department[testRoom]) {
          department[testRoom] = {};
        }
        if (!item.testRoom) {
          department[testRoom][0] = item.itemCount;
        } else {
          department[testRoom][item.status] = item.itemCount;
        }
      });
      angular.forEach(department, function (val, key) {
        vm.allCiXData.push(key);
        vm.allCiY0Data.push(val[0] || 0);
        vm.allCiY1Data.push(val[1] || 0);
        vm.allCiY2Data.push(val[2] || 0);
      });
      vm.drawCiChart();
    });
  };
  vm.getAllCi();

  // 获取登陆用户检测项完成情况
  vm.getOwnCi = function () {

  }
  vm.getOwnCi();

  // 获取抽样单完成情况
  vm.getAllSample = function () {

  }

  // 获取合同完成情况
  vm.getAllContract = function () {

  }

  var option = {
    color: ['#C1232B','#B5C334','#FCCE10'],
    tooltip: {
      trigger: 'axis',
      formatter: function (obj) {
        var str = '';
        angular.forEach(obj, function (item) {
          str += item.seriesName + '：' + item.data + '</br>';
        })
        str.replace(/<\/br>$/, '');
        return str;
      }
    },
    toolbox: {
      feature: {
        dataView: {
          show: true,
          readOnly: false
        },
        saveAsImage: {
          show: true
        }
      }
    },
    xAxis: [{
      type: 'category',
      axisPointer: {
        type: 'shadow'
      },
      axisLine: {
        lineStyle: {
          color: '#858B9D'
        }
      }
    }],
    yAxis: [{
        type: 'value',
        name: '数量（个）',
        min: 0,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      }
    ],
    series: [{
        type: 'bar',
        barMaxWidth: 30
      }
    ]
  };

  vm.drawCiChart = function () {
    vm.ciChart.hideLoading();
    var ciOption = angular.merge({}, option, {
      legend: {
        bottom: 0,
        data: ['待分配', '待检测', '检测完成']
      },
      xAxis: [{ data: vm.allCiXData }],
      series: [{
        name: '待分配',
        barMinHeight: 2,
        data: vm.allCiY0Data
      }, {
        type: 'bar',
        barMaxWidth: 30,
        barMinHeight: 2,
        name: '待检测',
        data: vm.allCiY1Data
      }, {
        type: 'bar',
        barMaxWidth: 30,
        barMinHeight: 2,
        name: '检测完成',
        data: vm.allCiY2Data
      }]
    });
    vm.ciChart.setOption(ciOption);
  }



  function formatTime (time, unit) {
    var res, base;
    if (unit === 'milliSecond') {
      base = 1000;
    } else if (unit === 'second') {
      base = 1;
    } else if (unit === 'minute') {
      base = 1 / 1000;
    }
    if (/s$/.test(time)) {
      res = time.replace(/s$/, '') * base; // 秒
    } else if (/m$/.test(time)) {
      res = time.replace(/m$/, '') * 60 * base; // 分钟
    } else if (/h$/.test(time)) {
      res = time.replace(/h$/, '') * 60 * 60 * base; // 小时
    } else if (/d$/.test(time)) {
      res = time.replace(/d$/, '') * 24* 60 * 60 * base; // 天
    } else if (/w$/.test(time)) {
      res = time.replace(/w$/, '') * 7 * 24* 60 * 60 * base; // 周
    } else if (/M$/.test(time)) {
      res = time.replace(/M$/, '') * 30 * 24* 60 * 60 * base; // 月
    } else if (/y$/.test(time)) {
      res = time.replace(/y$/, '') * 365 * 24 * 60 * 60 * base; // 年
    }
    return Number(res);
  }

});
