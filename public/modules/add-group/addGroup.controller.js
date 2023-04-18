
(function() {
    'use strict';

    angular.module('materialApp')
    .controller('AddGroupController', AddGroupController);

    function AddGroupController($mdDialog, api, $timeout, $window) {
        var vm = this;
        vm.form = {};
        vm.step =1;
        vm.stackToasts = [];
        vm.newDomains = [];
        vm.createDomain = createDomain;
        vm.addDns = addDns;        
        vm.clearInput = clearInput;
        
        function createDomain(ev){
            showLoading(ev);
            vm.stackToasts = [];            
            var domains = vm.domains.split('\n');
            angular.forEach(domains, function(domain){
                
                api.addZone({name: domain}).then(function(data){
                    vm.step = 2;
                    addToast(true, data.result.name);
                    vm.newDomains.push({name: data.result.name, id: data.result.id});
                }, function(err){
                    addToast(false, err.resource.name);
                });               
               
            });

            $mdDialog.hide();
        }

        function addDns(domain, form, ev){
            showLoading(ev);
            vm.stackToasts = [];
            var data = getParseData(domain, form);

            angular.forEach(data, function(params){                
                api.addDns(params).then(function(data){
                    addToast(true, data.result.name);
                }, function(err){
                   addToast(false, err.resource.name);
                });               
            });

            $mdDialog.hide();
            $window.scrollTo(0, 0);
        }

        function getParseData(domain, form) {
            var input = angular.copy(form);
            input.parameters = input.subs.split('\n').map(function(data){
                
                return {
                        type: input.type,
                        proxy: input.proxy,
                        name: (data.indexOf(domain.name) === -1)?data+'.'+domain.name:data,
                        content: input.content,
                        id: domain.id
                }
                
            });

            return input.parameters;
        }

        function clearInput(id){
            vm.form[id] = {};
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