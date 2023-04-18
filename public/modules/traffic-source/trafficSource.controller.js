(function() {
    'use strict';

    angular.module('materialApp')
        .controller('TrafficSourceController', TrafficSourceController);

    function TrafficSourceController($mdDialog, $timeout, trafficService) {
        var vm = this;
        vm.updateBalances = updateBalances;
        vm.stackToasts = [];
        vm.list = [];

        initialize();

        function initialize() {
            getBalances();
        }

        function updateBalances() {
            showLoading();
            trafficService.updateBalances().then(function(res){

                hideLoading();

                if (res.success) {                     
                    addToast(true, 'Balances updated successfully.');
                    getBalances();
                } else {
                    addToast(false, 'Failed to update balances. Please try again.');
                }
            }, function(err){
                addToast(false, 'Failed to update balances. Please try again.');  
                hideLoading();
            });
        }

        function getBalances() {
            trafficService.getBalances().then(function(res){

                if (res.data) { 

                    vm.list = res.data;
                    
                } else {
                    addToast(false, 'Failed to fetch balances. Please refresh the page.'); 
                }
            }, function(err){
                addToast(false, 'Failed to fetch balances. Please refresh the page.');  
            });
        }

        function showLoading(ev) {
            $mdDialog.show({
                templateUrl: 'modules/dialog/progress-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                escapeToClose: false,
            });
        }

        function hideLoading() {
            $mdDialog.hide();
        }

        function addToast(type, domain) {
            var msg = (type)?"Success: ":"Error: ";
            msg +="`"+domain+"`";
            var t = vm.stackToasts.length * 60;
            vm.stackToasts.push({msg: msg, success: type, style: {top: t+"px"}});

            $timeout(function() {
                vm.stackToasts.splice((vm.stackToasts.length - 1), 1);
            }, 3000);
        }

        function scrollTop() {
            $window.scrollTo(0, 0);
        }
    };
})();