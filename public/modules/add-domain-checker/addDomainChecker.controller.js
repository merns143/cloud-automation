(function() {
    'use strict';

    angular
        .module('materialApp')
        .controller('AddDomainCheckerController', AddDomainCheckerController);

    /** @ngInject */
    function AddDomainCheckerController(adddomainchecker, $mdDialog, alertService, $q, $timeout, $window) {
        var vm = this;
        vm.list = [];
        vm.addDomainCheck = addDomainCheck;

        vm.copy = {};
        vm.supported = true;
        vm.copySuccess = copySuccess;
        vm.copyFail = copyFail;

        function addDomainCheck(ev) {
            showLoading(ev);

            $timeout(function(){
                setDomainList();         
                var promises = [];
                angular.forEach(vm.list, function(domain){
                    promises.push(adddomainchecker.domainchecker(domain.name));
                });
                var promise = $q.all(promises);
    
                promise.then(function(res){
                    vm.list.added = res.filter(function(x){
                        return x.status;
                    });
    
                    vm.list.notadded = res.filter(function(x){
                        return !x.status;
                    });
    
                    vm.copy = {
                        added: (vm.list.added.length)?vm.list.added.map(function(domain){
                            return domain.name;
                        }).join('\n') : 'No result',
                        notadded: (vm.list.notadded.length)?vm.list.notadded.map(function(domain){
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
                return {name:  domain, status: false, detail: ''}
            });
            vm.list = list;
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