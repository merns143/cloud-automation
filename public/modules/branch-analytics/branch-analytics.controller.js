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
                        document.getElementById("Button").disabled = false;
                    });
                });
            }
        };
    }]);

    angular.module('materialApp').filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
    });

    angular.module('materialApp').controller('BranchAnalyticsController', ['$mdDialog', '$timeout', '$window', '$http', 'branchanalytics', function($mdDialog, $timeout, $window, $http, branchanalytics){
                    
        var vm = this;
        vm.uploadFile = uploadFile;
        vm.myFile = [];
        vm.stackToasts = [];
        vm.branchData = [];
        vm.onTabSelected = onTabSelected;
        vm.getBranchDataList = getBranchDataList;
        vm.dateRange = '';

        vm.currentPage = 0;
        vm.pageSize = 10;
        vm.numberOfPages=function(){
            return Math.ceil(vm.branchData.length/vm.pageSize);          
        }

        function onTabSelected(tabId){
            if(tabId === 2) {
                getBranchDataList();
            }
        };

        function uploadFile(){
            showLoading();
            var file = vm.myFile;
            var uploadUrl = "/api/branchanalytics";
            var fullname = file.name.split('.');
            var extension = fullname[1];
            
            document.getElementById("file").disabled = true;
            document.getElementById("Button").disabled = true;
            
            if (extension != "csv"){
                hideLoading();
                document.getElementById("Button").disabled = false;
                addToast(false, "Unsupported File");  
            }else{
                    var fd = new FormData();
                    fd.append('file', file);
                    $http.post(uploadUrl, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })                        
                    .then(function(success){
                        var msg = success.data.message;
                        document.getElementById("file").value = "";
                        hideLoading();
                        document.getElementById("Button").disabled = true;
                        addToast(true, msg);                           

                    }), (function(err){
                        hideLoading();
                        console.log(err);
                        addToast(false, 'Error Uploading');
                    });
            };
        };

        async function getBranchDataList() {
            showLoading();
            var branchDataList = await branchanalytics.getBranchData();
            if (branchDataList.msg){
                hideLoading();
                addToast(false, 'No CSV File Uploaded');
            }else{
                branchDataList.importValue.splice(0,5);
                vm.branchData = branchDataList.importValue;
                getDateRange();
            }
        };

        async function getDateRange(){
            var range = await branchanalytics.getBranchData();
            vm.dateRange = range.importValue[0].installs;
            hideLoading();
        }
       
        function showLoading(ev) {
            $mdDialog.show({
                templateUrl: 'modules/dialog/progress-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                escapeToClose: false,
            });
        };

        function hideLoading() {
            $mdDialog.hide();
            document.getElementById("file").disabled = false;
        };

        function addToast(type, info){
            var msg = (type)?"Success: ":"Error: ";
            msg +="`"+info+"`";
            var t = vm.stackToasts.length * 60;
            vm.stackToasts.push({msg: msg, success: type, style: {top: t+"px"}});

            $timeout(function(){
                vm.stackToasts.splice((vm.stackToasts.length - 1), 1);
            }, 3000);
        };

    }]);
    
})();