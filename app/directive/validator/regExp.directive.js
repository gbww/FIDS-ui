'use strick';

angular.module('com.app').directive('nameDuplicate', function(){
	return {
		restrict: 'EA',
		require: 'ngModel',
		scope: {
			existedArr: '=nameDuplicate'
		},
		link: function(scope, element, attrs, ngModel){
			ngModel.$parsers.push(function(value){
				var res = scope.existedArr.indexOf(value);
				if(res == -1){
					ngModel.$setValidity('duplicate', true);
				}else{
					ngModel.$setValidity('duplicate', false);
				}
				return value;
			})
		}
	}
}).directive('noneChinese', function(){ // 输入非中文
	return {
		restrict: 'EA',
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel){
			var reg = /[\u4E00-\u9FA5]+/;
			ngModel.$parsers.push(function(value){
				var res = reg.test(value);
				if(res) {
					ngModel.$setValidity('chinese', false);
				} else {
					ngModel.$setValidity('chinese', true);
				}
				return value;
			});
		}
	}
})
