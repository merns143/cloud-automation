(function() {
    'use strict';

    angular
        .module('materialApp')
        .controller('UptimeCheckController', UptimeCheckController);

    /** @ngInject */
    function UptimeCheckController(api, $mdDialog, $q, alertService, $timeout, $window) {
        var vm = this;
        vm.list = [];
        vm.copy = {};
        vm.supported = true;
        vm.checkDomains = checkDomains;
        vm.copySuccess = copySuccess;
        vm.copyFail = copyFail;

        function checkDomains(ev) {
            showLoading(ev);

            $timeout(function(){
                setDomainList();         
                var promises = [];
                angular.forEach(vm.list, function(domain){
                    promises.push(api.checkDns(domain.name));
                });
                var promise = $q.all(promises);
    
                promise.then(function(res){
                    vm.list.up = res.filter(function(x){
                        return x.status;
                    });
    
                    vm.list.down = res.filter(function(x){
                        return !x.status;
                    });
    
                    vm.copy = {
                        up: (vm.list.up.length)?vm.list.up.map(function(domain){
                            return domain.name;
                        }).join('\n') : 'No result',
                        down: (vm.list.down.length)?vm.list.down.map(function(domain){
                            return domain.name;
                        }).join('\n') : 'No result'
                    };
    
                    hideLoading();
                    scrollTop();
                }).catch(function(err){
                    hideLoading();
                });
            }, 100);
            
        }

        function setDomainList() {
            vm.list = [];
            var list = angular.copy(vm.domains).split('\n');
            list = list.map(function(domain){
                return {name:  checkValidUrl(domain), status: false, detail: ''}
            });
            vm.list = list;
        }

        function checkValidUrl(domain) {
            return (domain.indexOf('http://') === -1 && domain.indexOf('https://') === -1) ? 'http://'+domain: domain;
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

       function copySuccess() {
        alertService.show("Copied to clipboard!");
       }

       function copyFail() {
        alertService.show("Please try again!");
       }

       function scrollTop() {
        $window.scrollTo(0, 0);
        }
    }
})();