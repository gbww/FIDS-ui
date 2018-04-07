'use strict';

angular.module('com.app').config(function ($stateProvider) {

	$stateProvider.state('app.quotation', {
		url: '/quotation',
		templateUrl: 'controllers/quotation/quotation.html',
		controller: 'QuotationController as vm'
	});

	$stateProvider.state('app.quotation.detail', {
		url: '/quotation/:type/:id',
		views: {
			'@app': {
				templateUrl: 'controllers/quotation/detail/detail.html',
				controller: 'QuotationDetailController as vm'
			}
		}
	});

});
