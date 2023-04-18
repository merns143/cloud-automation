(function() {
    'use strict';

    angular.module('materialApp')
    .controller('AppSearchController', AppSearchController)
    .filter('startFrom', startFrom);

    function startFrom(){
            return function(input, start) {
                start = +start; //parse to int
                return input.slice(start);
            }
    };

    function AppSearchController(appsearch, $mdDialog, $timeout, $window, AuthService) {
        var vm = this;
        vm.search = search;
        vm.getCsvFiles = getCsvFiles;
        vm.onTabSelected = onTabSelected;
        vm.download = download;
        vm.advanceSearch = advanceSearch;
        vm.advanceCsvDownload = advanceCsvDownload;
        vm.getAppSearchQueue = getAppSearchQueue;
        vm.copyLink = copyLink;
        vm.devSearch = devSearch;
        vm.stackToasts = [];
        vm.csvFiles = [];
        vm.appSearchQueues = [];

        vm.currentPage = 0;
        vm.pageSize = 10;
        vm.numberOfPages=function(){
            return Math.ceil(vm.csvFiles.length/vm.pageSize);          
        }

        function onTabSelected(tabId){
            if(tabId === 5) {
                getCsvFiles();
            }
            if(tabId === 2){
                getAppSearchQueue();
            }
        };

        function copyLink(id){
            var copyText = document.getElementById("myInput-"+id);
            copyText.select();
            copyText.setSelectionRange(0, 99999)
            document.execCommand("copy");
            alert("Link copied to clipboard!\n" + copyText.value);
        };

        async function devSearch(){
            showLoading();
            document.getElementById('devUrlsResults').style.display = 'none';
            let msg = '';
            var devUrlsList = [];

            var searchUrlList = vm.searchDevUrls.trim().split(/\r?\n/);
            if(searchUrlList.length <= 5 ){
                for(var i=0; i < searchUrlList.length; i++){
                    let devUrl = searchUrlList[i].trim();
                    devUrlsList.push(devUrl);
                }
                
                var devSearchResults = await appsearch.devUrlSearch(devUrlsList);
                if(devSearchResults){
                    hideLoading();
                    document.getElementById('devUrlsResults').style.display = 'block';
                    vm.devSearchResults = devSearchResults.devDatas;
                    for(var i=0; i < devSearchResults.msgs.length; i++){
                        msg = devSearchResults.msgs[i].split('_');
                        if(msg[1] == 's'){
                            addToast(true, msg[0]);
                        }else{
                            addToast(false, msg[0]);
                        }
                    }
                }
            }else{
                msg = 'The max limit of searches has been exceeded';
                hideLoading();
                addToast(false, msg);
            }
        };

        function advanceSearch(){
            showLoading();
            document.getElementById('searchResult').style.display = 'none';
            let msg = '';
            var appIds = [];

            if (!vm.checkboxModel){
                msg = 'Search Type Required!';
                hideLoading();
                addToast(false, msg);
            }else{
                var search_type = vm.checkboxModel;
                var advanceSearchApp = vm.appIds.trim().split(/\r?\n/);
                if(advanceSearchApp.length <= 8){
                    for (var i=0; i < advanceSearchApp.length; i++){
                        let appid = advanceSearchApp[i].trim();
                        if (appid.substr(0, 5) == 'https'){
                            let split = '';
                            let split2 = '';
                            if(search_type == "android"){
                                split = advanceSearchApp[i].split('=');
                                split2 = split[1].split('&');
                                appid = split2[0];
                            }else if(search_type == "ios"){
                                split = advanceSearchApp[i].split('id');
                                split2 = split[1].split('?');

                                if(split2[0]){
                                    appid = split2[0];
                                }else{
                                    appid = split[1];
                                }
                            }
                        }
                        appIds.push(appid);
                    }
                    appsearch.advanceSearch(appIds, search_type)
                    .then(function(res){
                        if (res.msgs){
                            for(var x=0; x<res.msgs.length;x++){
                                 addToast(false, res.msgs[x]);
                            }
                        }
                        if(res.scrapes.length > 0){
                            document.getElementById('searchResult').style.display = 'block';
                            vm.resultAppIds = res.scrapes;
                            msg = `Successfuly Search ${res.scrapes.length} apps`;
                            addToast(true, msg);
                        }
                        hideLoading();              
                    }), (function(err){
                        hideLoading();
                        console.log(err);
                        addToast(false, 'Error Searching');
                    });
                }else{
                    msg = 'The max limit of searches has been exceeded';
                    hideLoading();
                    addToast(false, msg);
                }
            }
        };

        function search(){
            try {
                    showLoading();
                    let msg = '';
                    if (!vm.searchBox){
                        msg = 'Search Type Required!';
                        hideLoading();
                        addToast(false, msg);
                    }else{
                        var apps = [];
                        var app = vm.apps.split(',');
                        var type = vm.searchBox;

                        for(var i=0; i < app.length; i++){
                            var trimApp = app[i];
                            trimApp = trimApp.replace(/^\s+/g, '');
                            apps.push(trimApp);
                        };
    
                        appsearch.addAppSearch(apps, type)
                        .then(function(success){
                            document.getElementById("textarea").value = "";
    
                            var responds = success.responds;
                            if(responds){
                                hideLoading();
                                for(var y=0; y<responds.length;y++){
                                    var msg = responds[y].split('_');
                                    if(msg[1] == 'success'){
                                        addToast(true, msg[0]);
                                    }else if(msg[1] == 'error'){
                                        addToast(false, msg[0]);
                                    }
                                }
                            }
                                         
                        }), (function(err){
                            hideLoading();
                            console.log(err);
                            addToast(false, 'Error Searching');
                        });
                    }
            } catch (error) {
                hideLoading();
                console.log(error);
            }  
        };

        async function getAppSearchQueue(){
            try{
                showLoading();
                var data = await appsearch.appSearchQueue();
                if(data){
                    vm.appSearchQueues = data.getQueues;
                }
                hideLoading();
            }catch(error){
                console.log(error);
            }
        };

        function getCsvFiles() {
            showLoading();
            var androidpath = '/AppSearch/Android';
            var iospath = '/AppSearch/IOS';
            var promises = [
                appsearch.getAppSearch(androidpath),
                appsearch.getAppSearch(iospath)
            ];

            Promise.all(promises).then(function(res) {
                let androidList = res[0].list;
                let iosList = res[1].list;

                // Remove the 2 directory from the list
                androidList.splice(0,2);
                iosList.splice(0,2);

                let csvs = androidList.concat(iosList);
                if (csvs.length) {         
                    vm.csvFiles = csvs;
                } else {
                    addToast(false, 'No CSV File');                    
                }
                hideLoading();

            }).catch(function(err){
                addToast(false, 'Failed fetching CSV Files');
                hideLoading();
            })
        };

        function download(filename){
            $window.open(`/api/download-csvFile?filename=${filename}&accessToken=${AuthService.getToken()}`, '_blank');
        };

        async function advanceCsvDownload(appdatas){
            var csv_file = await appsearch.exportCsv(appdatas);
            $window.open(`/api/advance-download?filename=${csv_file.advancecsv_name}&accessToken=${AuthService.getToken()}`, '_blank');
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
    };

})();