
(function() {
    'use strict';

    angular.module('materialApp')
    .controller('SslDisableController', SslDisableController);

    function SslDisableController(api, $mdDialog, alertService, $timeout, $window) {

        var vm = this;
        vm.results;
        vm.showDisableConfirmation = showDisableConfirmation;
        vm.checkSsl = checkSsl;

        initialize();

        function initialize() {
            
        }   

        function checkSsl() {
            scrollTop();
            if (vm.domains) {
                var domains = vm.domains.split('\n');      
                if (domains.length > 50) {
                    alertService.show("Please provide atmost 50 domains!");
                    return;
                } else {
                    showLoading();
                    api.checkSsl(domains.join(',')).then(function(res){

                        hideLoading();

                        if (res.settings) { 

                            vm.results = res.settings;

                        } else {
                            addToast(false, 'Request Failed, please try again.');
                            vm.results = null;
                        }

                    }, function(err){
                        addToast(false, 'Request Failed, please try again.');    
                        vm.results = null;
                        hideLoading();
                    });
                }
            } else {
                alertService.show("Please provide atmost 50 domains!");
            }            
        }

        function disableSsl(domains) {
            scrollTop();
            
            showLoading();
            api.disableSsl(domains.join(',')).then(function(res){

                hideLoading();

                if (res.settings) { 

                    vm.results = res.settings;

                } else {
                    addToast(false, 'Request Failed, please try again.');
                    vm.results = null;
                }

            }, function(err){
                addToast(false, 'Request Failed, please try again.');    
                vm.results = null;
                hideLoading();
            });
                        
        }

        function showDisableConfirmation(ev){

            if (vm.domains) {
                var domains = vm.domains.split('\n');      
                if (domains.length > 50) {
                    alertService.show("Please provide atmost 50 domains!");
                    return;
                } else {
                    // Appending dialog to document.body to cover sidenav in docs app
                    var confirm = $mdDialog.confirm()
                            .title('Disable SSL')
                            .textContent('Continue disabling universal ssl for these domains?')
                            .ariaLabel('Confirmation')
                            .targetEvent(ev)
                            .ok('Continue')
                            .cancel('Cancel');
                
                    $mdDialog.show(confirm).then(function() {                
                        disableSsl(domains);
                    }, function() {
                        // confirmation is cancelled
                    });
                }
            } else {
                alertService.show("Please provide atmost 50 domains!");
            }    
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