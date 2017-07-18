angular.module('com.app').directive('layoutMenu', function LayoutMenu() {
  return {
    restrict: 'EA',
    replace: true,
    scope: {},
    templateUrl: 'directive/layout-menu/menu.html',
    controller: 'LayoutMenuController as vm'
  };
}).directive('accordionMenu', function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            element = $(element);
            element.children('li').click(function (event) {
                var navbarStatus = sessionStorage.getItem('navbarStatus');
                event.stopPropagation();
                if (!navbarStatus || navbarStatus === 'normal') {
                    $(this).siblings().removeClass('open').find('ul').slideUp();
                    if ($(this).hasClass('open')) {
                        $(this).removeClass('open').find('ul').slideUp();
                    } else {
                        $(this).addClass('open').find('ul').slideDown();
                    }
                }
            }).hover(function (event) {
                var navbarStatus = sessionStorage.getItem('navbarStatus');
                event.stopPropagation();
                if (navbarStatus === 'narrow') {
                    $(this).siblings().find('ul').hide();
                    $(this).find('ul').show();
                }
            }, function (event) {
                var navbarStatus = sessionStorage.getItem('navbarStatus');
                event.stopPropagation();
                if (navbarStatus === 'narrow') {
                    $(this).find('ul').hide();
                }
            })

            element.children('li').find("ul a").click(function (event) {
                event.stopPropagation()
            })

            $(document).on('click', function () {
                if (sessionStorage.getItem('navbarStatus') === 'narrow') {
                    element.find('ul').hide();
                }
            })
        }
    }
});
