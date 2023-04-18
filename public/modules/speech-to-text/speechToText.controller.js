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

        angular.module('materialApp').controller('SpeechToTextController', ['$mdDialog', '$timeout', '$window', '$http', 'speechtotext', 'AuthService', function($mdDialog, $timeout, $window, $http, speechtotext, AuthService){
                    
                    var vm = this;
                    vm.uploadFile = uploadFile;
                    vm.myFile = [];
                    vm.stackToasts = [];
                    vm.textFiles = [];
                    vm.onTabSelected = onTabSelected;
                    vm.getTranscribeList = getTranscribeList;
                    vm.download = download;

                    vm.currentPage = 0;
                    vm.pageSize = 10;
                    vm.numberOfPages=function(){
                        return Math.ceil(vm.textFiles.length/vm.pageSize);          
                    }

                    function onTabSelected(tabId){
                        if(tabId === 2) {
                            getTranscribeList()
                        }
                    };

                    function uploadFile(){
                        showLoading();
                        var file = vm.myFile;
                        var uploadUrl = "/api/speechtotext";
                        var fullname = file.name.split('.');
                        var extension = fullname[1];

                        console.log('file is ' );
                        console.dir(file);
                        
                        document.getElementById("file").disabled = true;
                        document.getElementById("Button").disabled = true;
                        
                        if (extension != "flac"){
                            hideLoading();
                            console.log("Unsupported File");
                            document.getElementById("Button").disabled = false;
                            addToast(false, "Unsupported File");  
                        }else{
                                console.log(file);
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
                                    addToast(false, 'Flac File not Uploaded');
                                });
                        };
                    };

                    function getTranscribeList() {
                        showLoading();
                        var promises = [
                            speechtotext.getSpeechToText()
                        ];

                        Promise.all(promises).then(function(res) {

                            let speechToTextList = res[0].list;

                            // Remove the 2 directory from the list
                            speechToTextList.splice(0,2);

                            if (speechToTextList) {                    
                                vm.textFiles = speechToTextList;
                            } else {
                                addToast(false, 'No Data');                    
                            }
                            hideLoading();
                        }).catch(function(err){
                            addToast(false, 'Failed fetching Text Files');
                            hideLoading();
                        })
                    };

                    function download(filename){
                        $window.open(`/api/download-speechtotext?filename=${filename}&accessToken=${AuthService.getToken()}`, '_blank');
                    };
                   
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