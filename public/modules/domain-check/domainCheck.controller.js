(function() {
    'use strict';

    angular.module('materialApp').directive('fileModel', ['$parse', function ($parse) {
        return {
           restrict: 'A',
           link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;
              
              element.bind('change', function(){
                 scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                 });
              });
           }
        };
     }]);


    angular.module('materialApp')
    .controller('DomainCheckController', DomainCheckController);

    function DomainCheckController($mdDialog,  api, $timeout, $scope, $http, alertService) {
        var vm = this;
        vm.showTable = false;
        vm.copy = {};
        vm.domains = {};
        vm.domainsFineDisplay = [];
        vm.domainsFlaggedDisplay = [];
        vm.submit = submit;
        vm.paginationOpts = {
            domainsFineDisplay : {                
                totalItems: 0,
                currPage: 1,
                pageChange: pageChangeFine,
                perPage: 50
            },
            domainsFlaggedDisplay : {                
                totalItems: 0,
                currPage: 1,
                pageChange: pageChangeFlag,
                perPage: 50
            }
        };
        vm.copySuccess = copySuccess;
        vm.copyFail = copyFail;
        vm.download = download;
        vm.downloadAvailable = false;

        function pageChangeFine() {
            var begin = ((vm.paginationOpts.domainsFineDisplay.currPage - 1) * vm.paginationOpts.domainsFineDisplay.perPage)
            , end = begin + vm.paginationOpts.domainsFineDisplay.perPage;
            vm.domainsFineDisplay = vm.domains.fine.slice(begin, end);
        }

        function pageChangeFlag() {
            var begin = ((vm.paginationOpts.domainsFlaggedDisplay.currPage - 1) * vm.paginationOpts.domainsFlaggedDisplay.perPage)
            , end = begin + vm.paginationOpts.domainsFlaggedDisplay.perPage;
            vm.domainsFlaggedDisplay = vm.domains.flagged.slice(begin, end);
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

        function submit(form){
            showLoading();
            var file = $scope.myFile;
            
            var fd = new FormData();
            fd.append('file', file);
            $http.post('/api/domain-file-check',fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(success){

               if (success.data.domains.length > 0) {
                var domains = success.data.domains;
                vm.downloadAvailable = success.data.downloadAvailabe;
                vm.domains.fine = getFlag(domains, false);
                vm.domains.flagged = getFlag(domains, true);

                vm.paginationOpts.domainsFineDisplay.totalItems = vm.domains.fine.length;
                vm.domainsFineDisplay = vm.domains.fine.slice(0, vm.paginationOpts.domainsFineDisplay.perPage);
                
                vm.paginationOpts.domainsFlaggedDisplay.totalItems = vm.domains.flagged.length;
                vm.domainsFlaggedDisplay = vm.domains.flagged.slice(0, vm.paginationOpts.domainsFlaggedDisplay.perPage);

                vm.copy = {
                    fine: (vm.domains.fine.length)?vm.domains.fine.map(function(domain){
                        return domain.url;
                    }).join('\n') : 'No result',
                    flagged: (vm.domains.flagged.length)?vm.domains.flagged.map(function(domain){
                        return domain.url;
                    }).join('\n') : 'No result'
                };
               } else {
                addToast(true, 'No domains detected from the file.');
               }
               vm.showTable = true;
               hideLoading();
               
            }, function(err){
                hideLoading();
                addToast(false, 'Something went wrong. Please try again.');
            });                 
        }

        function getFlag(array, condition) {
            return array.filter(url=>url.flagged === condition);
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

        function copySuccess() {
            alertService.show("Copied to clipboard!");
        }

        function copyFail() {
            alertService.show("Please try again!");
        }

        function download() {
            showLoading();

            $http.post('/api/domain-file-check/download', {domains: vm.domainsAll})
            .then(function(success){
                hideLoading();
               console.log('download success');
               
            }, function(err){
                hideLoading();
                addToast(false, 'Something went wrong. Please try again.');
            }); 
        }
        
    };


})();