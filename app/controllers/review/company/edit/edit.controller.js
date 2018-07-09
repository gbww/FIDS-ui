'use strict';

angular.module('com.app').controller('CompanyEditCtrl', function ($uibModalInstance, ReviewService, toastr, company, varietyList, scaleList) {
	var vm = this;

	vm.typeArr = ['食品生产企业', '食品销售者', '餐饮服务单位']
  vm.company = company;
	var lastType = vm.company.comType, initial = true
	
	var varietyMap = {foodProduce: [], others: []}, varietyArr = [],
		scaleMap = {foodProduce: [], foodSale: [], foodService: []}, scaleArr = [];
	angular.forEach(varietyList, function (item) {
		if (item.comType === '食品生产企业') {
			varietyMap.foodProduce.push({
				variety: item.comVariety, score: item.score
			}) 
		} else {
			varietyMap.others.push({
				variety: item.comVariety, score: item.score
			}) 
		}
	})
	angular.forEach(scaleList, function (item) {
		if (item.comType === '食品生产企业') {
			scaleMap.foodProduce.push({
				scale: item.scale, score: item.score
			}) 
		} else if (item.comType === '食品销售者') {
			scaleMap.foodSale.push({
				scale: item.scale, score: item.score
			}) 
		} else {
			scaleMap.foodService.push({
				scale: item.scale, score: item.score
			}) 
		}
	})


	function setVarietyArr () {
		if ((vm.company.comType === '食品销售者' && lastType === '餐饮服务单位') ||
				(vm.company.comType === '餐饮服务单位' && lastType === '食品销售者')) {
					return
				}
		var items, res = []
		if (vm.company.comType === '食品生产企业') {
			items = varietyMap.foodProduce
		} else {
			items = varietyMap.others
		}
		angular.forEach(items, function (item) {
			res.push(item.variety)
		})
		vm.varietyArr = res
		
		if (!initial) {
			vm.company.comVariety = vm.varietyArr[0]
			vm.setVarietyScore()
		}
	}
	vm.setVarietyScore = function  () {
		var items
		if (vm.company.comType === '食品生产企业') {
			items = varietyMap.foodProduce
		} else {
			items = varietyMap.others
		}

		angular.forEach(items, function (item) {
			if (vm.company.comVariety === item.variety) {
				vm.company.comVarietyScore = item.score
			}
		})
	}

	function setScaleArr () {
		var items, res = []
		if (vm.company.comType === '食品生产企业') {
			items = scaleMap.foodProduce
		}	else if (vm.company.comType === '食品销售者') {
			items = scaleMap.foodSale
		} else {
			items = scaleMap.foodService
		}
		angular.forEach(items, function (item) {
			res.push(item.scale)
		})
		vm.scaleArr = res

		if (!initial) {
			vm.company.comScale = vm.scaleArr[0]
			vm.setScaleScore()
		}
	}
	vm.setScaleScore = function  () {
		var items
		if (vm.company.comType === '食品生产企业') {
			items = scaleMap.foodProduce
		}	else if (vm.company.comType === '食品销售者') {
			items = scaleMap.foodSale
		} else {
			items = scaleMap.foodService
		}

		angular.forEach(items, function (item) {
			if (vm.company.comScale === item.scale) {
				vm.company.comScaleScore = item.score
			}
		})
	}

	vm.changeType = function () {
		setVarietyArr()
		setScaleArr()
		if (initial) initial = false
		lastType = vm.company.comType
	}
	vm.changeType()

  vm.ok = function () {
  	ReviewService.editCompany(vm.company).then(function (response) {
  		if (response.data.success) {
		  	$uibModalInstance.close();
  		} else {
  			toastr.error(response.data.message);
  		}
  	})
  }

  vm.cancel = function () {
  	$uibModalInstance.dismiss();
  }
});
