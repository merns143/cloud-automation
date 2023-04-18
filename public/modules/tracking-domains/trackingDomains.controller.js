
(function() {
    'use strict';

    angular.module('materialApp')
    .controller('TrackingDomainsController', TrackingDomainsController);

    function TrackingDomainsController(trackingDomains, $mdDialog, alertService, $timeout, $window) {

        var vm = this;
        vm.deleteCredential = deleteCredential;
        vm.addCredential = addCredential;
        vm.create = create;                       
        vm.gotToLogs = gotToLogs;
        vm.downloadUrls = downloadUrls;
        vm.trackingDomainsList = {};
        vm.newtoken = '';
        vm.logs = trackingDomains.viewLogs();
        vm.download = trackingDomains.downloadUrls();
        vm.stackToasts = [];
        vm.credentials = [];

         initialize();

        function initialize() {
            setCredentialsList();
            setTrackingDomainsCounts();
        }

        function setCredentialsList() {
            trackingDomains.getCredentials().then(function(res){

                if (res.success) {                    
                    vm.credentials = res.data;
                } else {
                    addToast(false, 'Safeborwsing Tokens');                    
                }
            }, function(err){
                addToast(false, 'Safeborwsing Tokens');
            });
        }

        function setTrackingDomainsCounts() {
            showLoading();
            setTrackingDomainsDefaultCounts();
            trackingDomains.getTrackingDomains().then(function(res){
                if (res.success) { 
                    res.data.forEach(function(url) {
                        if(!url.broken) {
                            vm.trackingDomainsList.available = url.counts;
                        } else {
                            vm.trackingDomainsList.broken = url.counts;
                        }
                    });

                    hideLoading();

                } else {
                    addToast(false, 'Available Urls'); 
                    
                    hideLoading();
                }
            }, function(err){
                addToast(false, 'Available Urls');    
                
                hideLoading();
            });
        }

        function setTrackingDomainsDefaultCounts() {
            vm.trackingDomainsList.available = 0;
            vm.trackingDomainsList.broken = 0;
        }

        function create(ev){
            scrollTop();
            if (!vm.domains.length) {
                alertService.show("Please provide correct and up domains!");
            } else {

                var domains = vm.domains.split('\n').join(',');            
                
                var confirm = $mdDialog.confirm()
                .title('Add Tracking Domains')
                .textContent('Are you sure you want to continue?')
                .ariaLabel('Confirmation')
                .targetEvent(ev)
                .ok('Continue')
                .cancel('Cancel');
    
                $mdDialog.show(confirm).then(function() {
                    showLoading();

                    trackingDomains.addTrackingDomains(domains).then(function(res){
                        
                        hideLoading();

                        if (res.success) {
                            setTrackingDomainsCounts();
                            addToast(true, 'Add Tracking Domains');
                        } else {
                            addToast(false, 'Add Tracking Domains');
                        }
                    }, function(err) {
                        addToast(false, 'Add Tracking Domains');
                        hideLoading();
                    });
                }, function() {
                    console.log('cancelled');
                });
            }
        }

        function deleteCredential(id, ev) {
            scrollTop();
            if (vm.credentials.length <= 2) {
                alertService.show("Cannot empty list of tokens!");
            } else {
                var confirm = $mdDialog.confirm()
                .title('Delete Token')
                .textContent('Are you sure you want to continue?')
                .ariaLabel('Confirmation')
                .targetEvent(ev)
                .ok('Continue')
                .cancel('Cancel');
    
                $mdDialog.show(confirm).then(function() {
                    trackingDomains.deleteCredential(id).then(function(res){
                        if (res.success) {
                            setCredentialsList();
                            addToast(true, 'Delete Token');
                        } else {
                            addToast(false, 'Delete Token');
                        }
                    }, function(err) {
                        addToast(false, 'Delete Token');
                    });
                }, function() {
                    console.log('cancelled');
                });
            }
            
        }

        function addCredential() {
            scrollTop();
            if (vm.newtoken && vm.newtoken.length) {
                trackingDomains.addCredential(vm.newtoken).then(function(res){
                    if (res.success) {
                        setCredentialsList();
                        addToast(true, 'Add Token');

                        vm.newtoken = '';
                    } else {
                        addToast(false, 'Add Token');
                    }
                }, function(err){
                    addToast(false, 'Add Token');
                });
            } else {
                alertService.show("No token provided!");
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

        function addToast(type, domain){
            var msg = (type)?"Success: ":"Error: ";
            msg +="`"+domain+"`";
            var t = vm.stackToasts.length * 60;
            vm.stackToasts.push({msg: msg, success: type, style: {top: t+"px"}});

            $timeout(function(){
                vm.stackToasts.splice((vm.stackToasts.length - 1), 1);
            }, 3000);
        }

        function scrollTop() {
            $window.scrollTo(0, 0);
        }

        function gotToLogs() {
            $window.open(vm.logs, '_blank');
        }

        function downloadUrls() {
            $window.open(vm.download, '_blank');
        }
    };

})();