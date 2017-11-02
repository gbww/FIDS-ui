angular.module('com.app').directive('appLayout', function appLayout() {
  return {
    restrict: 'EA',
    replace: true,
    scope: {},
    template: '<div class="container"><div ui-view></div></div>',
    controller: 'AppLayoutController as vm',
    link: function(scope, element, attrs){
    	$(element).siblings(".overlay").show()
    }
  };

/**
 ** 根据用户权限来决定是否显示相应导航栏菜单及操作项
 */
}).directive('roleAuth', ['api', function (api) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (!attrs.roleAuth) return;
            scope.ruleArr = api.permissionArr;

            /**
             ** roleAuth格式如1&2 3&4 5
             ** 权限必须同时有1和2，或者3和4，或者5，才会显示
             */
            var allowedRules = attrs.roleAuth.split(' ');
            var flag = false;
            for (var i=0,len=allowedRules.length; i<len; i++) {
                var combinedRules = allowedRules[i].split('&');
                var combinedFlag = true;
                for (var j=0; j<combinedRules.length; j++) {
                    if (scope.ruleArr.indexOf(combinedRules[j]) === -1) {
                        combinedFlag = false;
                        break;
                    }
                }
                if (combinedFlag) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                element.remove();
            }
        }
    }
}]);
