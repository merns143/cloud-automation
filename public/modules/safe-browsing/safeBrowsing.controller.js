
(function() {
    'use strict';

    angular.module('materialApp')
    .controller('SafeBrowsingController', SafeBrowsingController);

    function SafeBrowsingController(safebrowsing, $mdDialog, $scope, alertService, $timeout, $window) {

        var vm = this;
        vm.deleteCredential = deleteCredential;
        vm.addCredential = addCredential;
        vm.updateVoluumCredential = updateVoluumCredential;  
        vm.create = create;                       
        vm.gotToLogs = gotToLogs;
        vm.downloadUrls = downloadUrls;
        vm.restartSbrowServer = restartSbrowServer;
        vm.availableUrls = {
            available: [],
            broken: []
        };
        vm.newtoken = '';
        vm.logs = safebrowsing.viewLogs();
        vm.download = safebrowsing.downloadUrls();
        vm.stackToasts = [];
        vm.credentials = [];
        vm.domainsCount = {
            up: 0,
            broken: 0
        };
        vm.downloadDomains = downloadDomains;
        vm.ddownload = safebrowsing.downloadDomains();
        vm.dcreate = dcreate;
        vm.onTabSelected = onTabSelected;

        function onTabSelected(tabId){
            if(tabId === 1) {
                setAvailableUrlsCounts();
            } else if (tabId === 2) {
                setDomainsCounts();
            } else if (tabId === 3) {
                getCredentialsData();
            } else {
                console.log('Tab id not found');
            }
        };


        function setDomainsCounts() {
            showLoading();
            safebrowsing.getDomainCounts().then(function(res){

                if (res.success) {                    
                    res.data.forEach(function(url) {

                        if(!url.broken) {
                            vm.domainsCount.up = url.count;
                        } else {
                            vm.domainsCount.broken = url.count;
                        }
                    });

                    hideLoading();

                } else {
                    addToast(false, 'Available Domains'); 
                    
                    hideLoading();
                }
            }, function(err){
                addToast(false, 'Available Domains');    
                
                hideLoading();
            });
        }

        function dcreate(ev){
            scrollTop();
            if (!vm.domains.length) {
                alertService.show("Please provide domains and expiry date!");
            } else {

                var domains = [];
                var domain = vm.domains.split('\n'); 

                for(var i=0; i < domain.length; i++){
                    var data = domain[i].split(',');
                    var data = {
                        domain : data[0],
                        expiry : data[1]
                    };
                    domains.push(data);
                };

                var confirm = $mdDialog.confirm()
                .title('Add Domains with Expiry Date')
                .textContent('Are you sure you want to continue?')
                .ariaLabel('Confirmation')
                .targetEvent(ev)
                .ok('Continue')
                .cancel('Cancel');
    
                $mdDialog.show(confirm).then(function() {

                     showLoading();
                     safebrowsing.addDomains(domains).then(function(res){
                        
                         hideLoading();
                        if (res.success) {
                            setDomainsCounts();
                            vm.domains = " ";
                            addToast(true, 'Added Domains with Expiry Date');
                        } else {
                            addToast(false, 'Add Domains with Expiry Date');
                        }
                    }, function(err) {
                        addToast(false, 'Add Domains with Expiry Date');
                        hideLoading();
                     });
                }, function() {
                     console.log('cancelled');
                 });
            }
        }

        function restartSbrowServer(ev) {

            var confirm = $mdDialog.confirm()
            .title('Restart Safebrowsing Server')
            .textContent('Are you sure you want to continue?')
            .ariaLabel('Confirmation')
            .targetEvent(ev)
            .ok('Continue')
            .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                showLoading();

                safebrowsing.restartSbrowServer().then(function(res){

                    if (res.success) {                    
                        hideLoading();

                        addToast(true, 'Safebrowsing server restarted'); 
                        
                    } else {

                        hideLoading();
                        addToast(false, 'Failed to restart Safebrowsing server');                    
                    }
                }, function(err){
                    hideLoading();
                    addToast(false, 'Failed to restart Safebrowsing server');
                });
            }, function() {
                console.log('cancelled');
            });

            
        }

        function getCredentialsData() {
            showLoading();

            var promises = [
                safebrowsing.getCredentials(),
                safebrowsing.getVoluumCredentials()
            ];

            Promise.all(promises).then(function(res) {
                if (res[0].success) {                    
                    vm.credentials = res[0].data;
                } else {
                    addToast(false, 'Safeborwsing Tokens');                    
                }

                if (res[1].success) {                    
                    vm.voluum = res[1].data;
                } else {
                    addToast(false, 'Voluum Credentials');                    
                }
                hideLoading();
            }).catch(function(err){
                addToast(false, 'Failed fetching credentials');
                hideLoading();
            });
        }

        function setCredentialsList() {
            safebrowsing.getCredentials().then(function(res){

                if (res.success) {                    
                    vm.credentials = res.data;
                } else {
                    addToast(false, 'Safeborwsing Tokens');                    
                }
            }, function(err){
                addToast(false, 'Safeborwsing Tokens');
            });
        }

        function setVoluumCredentials() {
            safebrowsing.getVoluumCredentials().then(function(res){
                if (res.success) {                    
                    vm.voluum = res.data;
                } else {
                    addToast(false, 'Voluum Credentials');                    
                }
            }, function(err){
                addToast(false, 'Voluum Credentials');
            });
        }

        function setAvailableUrlsCounts() {
            showLoading();
            setAvailableUrlsDefaultCounts();
            safebrowsing.getAvailableUrls().then(function(res){
                if (res.success) {                    
                    res.data.forEach(function(url) {
                        var type = url.type.replace(':', '');
                        if(!url.broken) {
                            vm.availableUrls.available[type] = url.counts;
                        } else {
                            vm.availableUrls.broken[type] = url.counts;
                        }
                    });
                    // console.log(vm.availableUrls);
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

        function setAvailableUrlsDefaultCounts() {
            vm.availableUrls.available['https'] = 0;
            vm.availableUrls.available['http'] = 0;
            vm.availableUrls.broken['https'] = 0;
            vm.availableUrls.broken['http'] = 0;
        }

        function create(ev){
            scrollTop();
            if (!vm.domains.length) {
                alertService.show("Please provide correct and up domains!");
            } else {

                var domains = vm.domains.split('\n').join(',');            
                
                var confirm = $mdDialog.confirm()
                .title('Add Replacement Domains')
                .textContent('Are you sure you want to continue?')
                .ariaLabel('Confirmation')
                .targetEvent(ev)
                .ok('Continue')
                .cancel('Cancel');
    
                $mdDialog.show(confirm).then(function() {
                    showLoading();

                    safebrowsing.addAvailableUrls(domains).then(function(res){
                        
                        hideLoading();

                        if (res.success) {
                            setAvailableUrlsCounts();
                            addToast(true, 'Add Replacement Domains');
                        } else {
                            addToast(false, 'Add Replacement Domains');
                        }
                    }, function(err) {
                        addToast(false, 'Add Replacement Domains');
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
                    safebrowsing.deleteCredential(id).then(function(res){
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
        
        function updateVoluumCredential(ev) {
            scrollTop();
            if (!vm.voluum.accessId.length || !vm.voluum.accessKey.length) {
                alertService.show("Invalid Credentials!");
            } else {
                var confirm = $mdDialog.confirm()
                .title('Update Voluum Credentails')
                .textContent('Are you sure you want to continue?')
                .ariaLabel('Confirmation')
                .targetEvent(ev)
                .ok('Continue')
                .cancel('Cancel');
    
                $mdDialog.show(confirm).then(function() {
                    safebrowsing.updateVoluumCredentials(vm.voluum).then(function(res){
                        if (res.success) {                    
                            vm.voluum = res.data;
                            addToast(true, 'Voluum Credentials Update');  
                        } else {
                            addToast(false, 'Voluum Credentials Update');                    
                        }
                    }, function(err) {
                        addToast(false, 'Voluum Credentials Update');  
                    });
                }, function() {
                    console.log('cancelled');
                });
            }
        }

        function addCredential() {
            scrollTop();
            if (vm.newtoken && vm.newtoken.length) {
                safebrowsing.addCredential(vm.newtoken).then(function(res){
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

        function downloadDomains() {
            $window.open(vm.ddownload, '_blank');
        }

        
    };

})();