angular.module('com.app').directive('loginValidator', function appLayout() {
	return {
		restrict: 'EA',
		scope: {
			submitted: "="
		},
		link: function(scope, element, attrs){
			element = $(element);
			element.find("#login").click(function(event){
				var username = element.find("input[name='username']").val();
				var password = element.find("input[name='password']").val();
				if(username == ""){
					scope.submitted = false;
					element.find(".input-message").html("请输入用户名");
					event.preventDefault();
				}else if(password == ""){
					scope.submitted = false;
					element.find(".input-message").html("请输入密码");
					event.preventDefault();
				}else{
					element.find(".input-message").html("");
				}
				scope.$apply();
			});
		}
	}

}).directive('validatorMatch', function() {  // 验证两次密码匹配
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
});
