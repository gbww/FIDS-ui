angular.module('smart-table').run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/smart-table/custom-page.html', [
        '<nav ng-if="pages.length >= 2">',
        '<ul class="pagination">',
        '<li><a style="float:left;" ng-click="selectPage(1)">首页</a></li>',
        '<li class="previous" ng-class={"disabled":currentPage===1} ng-disabled="currentPage===1"><a ng-click="currentPage===1 || selectPage(currentPage - 1)">上一页</a></li>',
        '<li><a><page-select></page-select> / {{numPages}}页</a></li>',



        // '<li ng-repeat="page in pages" ng-class="{active: page==currentPage}"><a href="javascript: void(0);" ', 'ng-click="selectPage(page)">{{page}}</a></li>',

        '<li><a style="float:right;" ng-click="selectPage(numPages)">尾页</a></li>',
        '<li class="next" ng-class="{disabled:currentPage>=numPages}" ng-disabled="currentPage>=numPages"><a ng-click="currentPage===numPages || selectPage(currentPage + 1)" >下一页</a></li>',
        '</ul>',


        '</nav>'
    ].join(''));

    $templateCache.put('template/smart-table/st-idp.html',
        [

            // '<div  ng-if="stTotalCount>0"  class="pull-left">{{getFromItemIndex()}}-{{getToItemIndex()}}/{{stTotalCount}}条&nbsp;&nbsp;每页显示<select  ng-model="stItemsByPage" ng-options="item for item in [10,25,50,100]" ng-change="displayLengthChange(stItemsByPage)"></select>条</div>',
            '<div  ng-if="stTotalCount>0"  class="pull-left">每页显示<select  ng-model="stItemsByPage" ng-options="item for item in [10,25,50,100]" ng-change="displayLengthChange(stItemsByPage)"></select>条</div>',

            '<div ng-show="stTotalCount>stItemsByPage" st-pagination   st-items-by-page="stItemsByPage" st-template="template/smart-table/custom-page.html" class="pull-right"></div> '
        ].join(''));


}])

    //表格刷新的时候，只要st-search-watch监听的对象发生改变，就触发pipe方法
    .directive('stSearchWatch', function () {
        return {
            restrict: 'A',
            require: '^^stTable',
            scope: {
                stSearchWatch: '='
            },
            link: function (scope, element, attrs, ctrl) {
                scope.$watch('stSearchWatch', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        var tableState = ctrl.tableState();
                        // 当删除操作后总页数改变时，跳转到第一页
                        if (newValue.totalCount && (newValue.totalCount <= tableState.pagination.start)) {
                            tableState.pagination.start = 0;
                        }
                        // 当切换重新请求时，跳转到第一页
                        if (newValue.toggle) {
                            tableState.pagination.start = 0;
                            delete scope.stSearchWatch.toggle;
                        }
                        ctrl.pipe();
                        console.log('st-search-object');
                    }
                }, true);
            }
        };
    })
    .directive('stIdp', ['stConfig', function (stConfig) {
        //display length
        //information
        //pagination
        return {
            restrict: 'AE',
            require: '^stTable',
            scope: {
                stItemsByPage: '=?',
                stTotalCount: '='
            },
            templateUrl: 'template/smart-table/st-idp.html',
            link: function (scope, element, attrs, ctrl) {
                scope.currentPage = 1;
                scope.numPages = 0;
                scope.stItemsByPage = scope.stItemsByPage ? +(scope.stItemsByPage) : stConfig.pagination.itemsByPage;

                scope.$watch(function () {
                    return ctrl.tableState().pagination;
                }, function () {
                    scope.currentPage = Math.floor(ctrl.tableState().pagination.start / ctrl.tableState().pagination.number) + 1;
                    scope.numPages = ctrl.tableState().pagination.numberOfPages;
                }, true);


                scope.getFromItemIndex = function () {
                    if (scope.stTotalCount === 0) {
                        return 0;
                    } else {
                        return (scope.currentPage - 1) * scope.stItemsByPage + 1;
                    }

                };

                scope.getToItemIndex = function () {
                    if (scope.stTotalCount === 0) {
                        return 0;

                    } else {
                        return scope.currentPage >= scope.numPages ? scope.stTotalCount : scope.currentPage * scope.stItemsByPage;
                    }
                };

                scope.displayLengthChange = function (stItemsByPage) {
                    scope.stItemsByPage = stItemsByPage
                    scope.$emit('smart_table_display_length_change', scope.stItemsByPage);
                };

            }
        };
    }])
    .directive('st-information', [function () {
        return {
            restrict: 'AE',
            require: '^stTable',
            scope: {
                stTotalCount: '='
            },
            template: '共{{stTotalCount}}记录'
        };
    }])
    .directive('st-display', [function () {
        return {
            restrict: 'AE',
            require: '^stTable',
            scope: {
                stItemsByPage: '=?'
            },
            template: '每页显示<select ng-model="stItemsByPage" ng-options="item for item in [10,25,50,100]" ng-change="displayLengthChange()"></select>条记录',
            link: function (scope) {

                scope.stItemsByPage = scope.stItemsByPage ? +(scope.stItemsByPage) : stConfig.pagination.itemsByPage;

                scope.displayLengthChange = function () {
                    scope.$emit('smart_table_display_length_change', scope.stItemsByPage);
                };
            }
        };
    }])
    .directive('pageSelect', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
            link: function (scope, element, attrs) {
                scope.$watch('currentPage', function (c) {
                    scope.inputPage = c;
                });
            }
        }
    })
    .directive('stSearchWatch2', function () {
        return {
            require: '^stTable',
            scope: {
                stSearchWatch2: '='
            },
            link: function (scope, element, attrs, ctrl) {
                var table = ctrl;

                scope.$watch('stSearchWatch2', function (newValue) {
                    ctrl.search(newValue);
                });

            }
        };
    });
