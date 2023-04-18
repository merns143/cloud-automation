
(function() {
    'use strict';

    angular.module('materialApp')
    .controller('AddDnsController', AddDnsController);

    function AddDnsController($scope, $mdDialog, api, alertService, $timeout, $window) {
        var vm = this;
        vm.disabled = true;   
        vm.halt = false;
        vm.currentTab = 0;
        vm.form = {
            s: {},
            m: {}
        }
        vm.domain = {};
        vm.domains = [];         
        vm.stackToasts = [];
        vm.querySearch   = querySearch;
        vm.selectedItemChange = selectedItemChange;
        vm.searchTextChange   = searchTextChange;
        vm.showConfirmation = showConfirmation;
        vm.clearInputSingle = clearInputSingle;       
        vm.clearInputMultiple = clearInputMultiple; 
    
        // showLoading();
        loadDomains(1);

        $scope.$on("$destroy", function() {
            vm.halt = true;
        });

        function clearInputSingle(){
            vm.selectedItem='';
        }

        function clearInputMultiple(){
           
        }

        function querySearch (query) {
            var results = query ? vm.domains.filter( createFilterFor(query) ) : vm.domains,
                deferred;

            return results;
        }
    
        function searchTextChange(text) {
            //$log.info('Text changed to ' + text);
        }
    
        function selectedItemChange(item) {
           // $log.info('Item changed to ' + JSON.stringify(item));
            vm.domain = item;
            if(angular.isObject(item)){
                vm.form.s = {
                    type: 'CNAME',
                    proxy: false,
                    content: item.value
                };
                vm.form.s.content = item.value;
            } else {
                vm.form.s = {
                    type: '',                    
                    proxy: '',
                    content: ''
                };
            }
            
        }
    
        /**
         * Build `domain` list of key/value pairs
         */
        function loadDomains(page) {

            if (vm.halt) {
                return;
            }

            var param = {
                per_page: 1000,
                page: page
            };
            
            api.zoneList(param).then(function(res){
                
                if (res.success) {
                    angular.forEach(res.result, function(domain){
                        vm.domains.push({
                                value: domain.name,
                                id: domain.id,
                                display: domain.name
                        });
                    });
                }

                // hide();

                if(res.result_info.page < res.result_info.total_pages){
                    page++;

                    loadDomains(page);
                    return
                }
                
            }, function(err){
                alertService.show("Error occured when processing the request! ("+err.status+")");
                hide();
            });

            vm.disabled = false;
        }
    
        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
    
            return function filterFn(domain) {
            return (domain.value.indexOf(lowercaseQuery) === 0);
            };
    
        }

        function create(tab, ev) {
            showLoading(ev);

            vm.stackToasts = [];
            var data = getParseData(tab);
            
            angular.forEach(data, function(params){                
                api.addDns(params).then(function(data){
                    addToast(true, data.result.name);
                }, function(err){
                   addToast(false, err.resource.name);
                });               
            });

            hide();

            $window.scrollTo(0, 0);
            
        }

        function getParseData(tab) {
            var input;

            if (tab===0){
                input = angular.copy(vm.form.s);

                input.parameters = input.subs.split('\n').map(function(data){
                    
                    return {
                            type: input.type,
                            proxy: input.proxy,
                            name: (data.indexOf(vm.domain.value) === -1)?data+'.'+vm.domain.value:data,
                            content: input.content,
                            id: vm.domain.id
                    }
                    
                });
            } else {
                input = angular.copy(vm.form.m);
                
                input.parameters = input.subs.split('\n').map(function(data){
                    var dns = data.split('.');
                    var len = dns.length;
                    var domain = dns[(len-2)]+'.'+dns[(len-1)];
                    return {
                            type: input.type,
                            proxy: input.proxy,
                            name: data,
                            content: input.content,
                            id: vm.domains.filter(createFilterFor(domain)).map(function(el){
                                return el.id
                            })[0]
                    }
                    
                });
            }
            
            return input.parameters;
        }

        function showConfirmation(ev){
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                    .title('Continue adding sub domains?')
                    .textContent('Please double check every information provided!')
                    .ariaLabel('Confirmation')
                    .targetEvent(ev)
                    .ok('Continue')
                    .cancel('Cancel');
        
            $mdDialog.show(confirm).then(function() {                
                create(vm.currentTab);
            }, function() {
                // confirmation is cancelled
            });
        }

        function addToast(type, domain){
            var msg = (type)?"Success: ":"Error: ";
            msg +="`"+domain+"`";
            var t = vm.stackToasts.length * 60;
            vm.stackToasts.push({msg: msg, success: type, style: {top: t+"px"}});

            $timeout(function(){
                vm.stackToasts.splice((vm.stackToasts.length - 1), 1);
            }, 6000);
        }

        function showLoading(ev){
            $mdDialog.show({
                templateUrl: 'modules/dialog/progress-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                escapeToClose: false,
            });
        }

        function hide(){
            $mdDialog.hide();
        }
    };


})();