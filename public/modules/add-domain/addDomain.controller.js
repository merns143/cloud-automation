(function() {
    'use strict';

    angular.module('materialApp')
    .controller('AddDomainController', AddDomainController);

    function AddDomainController($mdDialog,  api, $timeout) {
        var vm = this;
        vm.stackToasts = [];
        vm.create = create;
        vm.added = [];
        vm.notAdded = [];

        function addToast(type, domain){
            var msg = (type)?"Success: ":"Error: ";
            msg +="`"+domain+"`";
            var t = vm.stackToasts.length * 60;
            vm.stackToasts.push({msg: msg, success: type, style: {top: t+"px"}});

            $timeout(function(){
                vm.stackToasts.splice((vm.stackToasts.length - 1), 1);
            }, 6000);
        }

        function create(ev){
            vm.added = [];
            vm.notAdded = [];
            vm.stackToasts = [];
            showLoading();

            var domains = vm.domains.split('\n');
            angular.forEach(domains, function(domain){
            
            api.addZone({name: domain}).then(function(data){
                // addToast(true, data.result.name);
                vm.added.push(data.result.name)
            }, function(err){
                // addToast(false, err.resource.name);
                vm.notAdded.push(err.resource.name)
            });               
           
            });
           
            hideLoading();
        }

        function showLoading() {
            $mdDialog.show({
                templateUrl: 'modules/dialog/progress-dialog.html',
                parent: angular.element(document.body),
                targetEvent: '',
                clickOutsideToClose: false,
                escapeToClose: false,
            });
        }

        function hideLoading() {
            $mdDialog.hide();
        }
        
    };


})();