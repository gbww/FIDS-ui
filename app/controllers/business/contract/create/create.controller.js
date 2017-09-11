'use strict';

angular.module('com.app').controller('ContractCreateCtrl', function ($state, api, toastr, ContractService) {
  var vm = this;

  var businessBC = api.breadCrumbMap.business;
  vm.breadCrumbArr = [businessBC.root, businessBC.contract.root, businessBC.contract.create];

  vm.contract = {
  	// sample_id: null,
  	// protocol_id: null,
  	// sample_name: null,
  	// process_technology: null,
  	// quality_level: null,
  	// specification_quantity: null,
  	// product_date: null,
  	// storage_condition: null,
  	// storage_time: null,
  	// sample_traits: null,
  	// process_demand: null,
  	// detect_purpose: null,
  	// other_data: null,
  	detectType: '委托检验',
  	// detect_project: null,
  	executeStandard: '标准一',
  	// detect_by: null,
  	isUseStandard: '0',
  	isSubcontracting: '0',
  	isExpedited: '0',
  	isEvaluation: '0',
  	// product_unit: null,
  	// inspection_unit: null,
  	// sampling_address: null,
  	// inspection_unit_address: null,
  	// zip_code: null,
  	// phone: null,
  	// fax: null,
  	// contact_person: null,
  	reportMethod: 'self',
  	reportCount: 1,
  	// inspection_user: null,
  	// inspection_date: null,
  	// acceptor: null,
  	// acceptance_date: null,
  	// cost: null,
  	// activity1: null,
  	// process_id: null,
  	extra: null
  }

  vm.ok = function () {
  	var data = angular.merge({}, vm.contract, {
	  	isUseStandard: 0,
	  	isSubcontracting: 0,
	  	isExpedited: 0,
	  	isEvaluation: 0
  	});

		ContractService.createContract(data).then(function (response) {
			if (response.data.success) {
				toastr.success('合同录入成功！');
				$state.go('app.business.contract');
			} else {
				toastr.error(response.data.message);
			}
		}).catch(function (err) {
			toastr.error(response.data.message);
		})
  }
});
