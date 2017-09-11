'use strick';

angular.module('com.app').directive('validatorMatch', function() {  // 验证两次密码匹配
    return {
    	require: 'ngModel',
    	link : function(scope, element, attrs, ngModel) {
    		ngModel.$parsers.push(function(value) {
    			var oldValue = attrs.validatorMatch;
    			ngModel.$setValidity('match', value == oldValue);
    			return value;
    		});
    	}
    }
}).directive('validatorPassword', function(){  // 验证密码格式
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel){
            var reg = /^(?=.*[a-z])(?=.*[A-Z])[\da-zA-Z]{0,30}$/;

            ngModel.$parsers.push(function(value){
                var validity = reg.test(value);
                ngModel.$setValidity("password", validity);
                return value;
            });
        }
    }
}).directive('nameDuplicate', function(){
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
