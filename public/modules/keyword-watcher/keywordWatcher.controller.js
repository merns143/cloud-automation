(function() {
    'use strict';

    angular.module('materialApp')
    .controller('KeywordWatcherController', KeywordWatcherController)
    .filter('startFrom', startFrom);

    function startFrom(){
            return function(input, start) {
                start = +start; //parse to int
                return input.slice(start);
            }
    };

    function KeywordWatcherController($mdDialog, $timeout, keywordwatcher) {
        var vm = this;
        vm.stackToasts = [];
        vm.add = add;
        vm.onTabSelected = onTabSelected;
        vm.getKeywordList = getKeywordList;
        vm.delKeyword = delKeyword;
        vm.dbKeywords = [];

        vm.currentPage = 0;
        vm.pageSize = 10;
        vm.numberOfPages=function(){
            return Math.ceil(vm.dbKeywords.length/vm.pageSize);          
        }

        // Load when tab selected
        function onTabSelected(tabId){
            if(tabId === 2) {
                getKeywordList();
            }
        };

        async function delKeyword(keyword){
            var confirm = $mdDialog.confirm()
            .title(`Delete '${keyword}' from Keyword Watcher`)
            .textContent('Are you sure you want to continue?')
            .ariaLabel('Confirmation')
            .targetEvent(keyword)
            .ok('Continue')
            .cancel('Cancel');

            try{
                var alert = await $mdDialog.show(confirm);
                if (alert){
                    showLoading();
                    try{
                        var del = await keywordwatcher.deleteKeyword(keyword);
                        if(del){
                            hideLoading();
                            addToast(true, del.msg);
                            getKeywordList();
                        }else{
                            hideLoading();
                            addToast(false, del.msg);
                        }
                    }catch{
                        hideLoading();
                        addToast(false, 'Error Deleting Keyword');
                    }
                }
            } catch(error){
                console.log('cancelled');
            }
        }

        async function getKeywordList(){
            try{
                showLoading();
                var data = await keywordwatcher.getKeyword();
                if(data){
                    vm.dbKeywords = data.getKeywords;
                }
                hideLoading();
            }catch(error){
                console.log(error);
            }

        }

        async function add(){
            showLoading();
            var keywords = [];
            var keyword = vm.keywords.split(',');
            var property_types = [];

            if(vm.checkboxModel){
                for(var x=0;x<6;x++){
                    var property_type = vm.checkboxModel[x];
                    if (property_type){
                        property_types.push(property_type);
                    }
                }
            }else{
                hideLoading();
                addToast(false, 'Property Type required!');
            }
            
            for(var i=0; i < keyword.length; i++){
                var trimKeyword = keyword[i];
                trimKeyword = trimKeyword.replace(/^\s+/g, '');
                keywords.push(trimKeyword);
            };

            if(keywords.length > 0 && property_types.length > 0){
                keywordwatcher.addKeyword(keywords, property_types)
                .then(function(success){
                    var responds = success.responds;

                    document.getElementById("textarea").value = "";
                    hideLoading();

                    for (i=0; i<responds.length;i++ ){
                        var respond_data = responds[i].split('_');
                        var respond_msg = respond_data[0];
                        var type = respond_data[1];

                        if (type === 'success'){
                            addToast(true, respond_msg); 
                        }else{
                            addToast(false, respond_msg);
                        }
                    }
                }), (function(err){
                    hideLoading();
                    console.log(err);
                    addToast(false, 'Error Searching');
                });
            }
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