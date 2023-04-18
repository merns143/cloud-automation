
(function() {
    'use strict';

    angular.module('materialApp')
    .controller('ListController', ListController);

    function ListController(api, $mdDialog, alertService, $window, AuthService) {

        var vm = this;
        vm.paginationOpts = {
            totalItems: 0,
            currPage: 1,
            pageChange: pageChange
        };
        vm.exportDomains = exportDomains;

        function exportDomains() {
            $window.open(`/api/zones/download/domains?accessToken=${AuthService.getToken()}`, '_blank');
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

        function pageChange() {
            getPageContents({page: vm.paginationOpts.currPage, per_page: 100});
        }

        function getPageContents(param) {
            showLoading();
            api.zoneList(param).then(function(res){
                vm.domains = res.result;
                vm.paginationOpts.totalItems = res.result_info.total_count;
                vm.paginationOpts.currPage = res.result_info.page;
                vm.paginationOpts.numPages = res.result_info.total_pages;
                hideLoading();
            }, function(err){
                hideLoading();
                alertService.show("Error occured! ("+err.status+")");
            });
        }       

        function initializeList() {
            pageChange();
        }

        // initializeList()
    };

})();