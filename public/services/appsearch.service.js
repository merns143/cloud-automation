(function () {
    'use strict';

    angular
        .module('materialApp')
        .service('appsearch', function (deffer) {

            var service = {
                addAppSearch: addAppSearch,
                appSearchQueue: appSearchQueue,
                advanceSearch: advanceSearch,
                getAppSearch: getAppSearch,
                downloadCsvFile: downloadCsvFile,
                advanceDownload: advanceDownload,
                devUrlSearch: devUrlSearch,
                exportCsv: exportCsv
            };

            return service;

            function addAppSearch(apps, type){
                var request = {
                    url: '/api/appsearch',
                    method:'post',
                    actions: {post: {method: 'POST'}}
                }
                return deffer.request(request, {apps:apps, type:type});
            }

            function appSearchQueue(queues){
                var request = {
                    url: '/api/appsearch-queue',
                    method:'get',
                }
                return deffer.request(request, {queues:queues});
            }

            function devUrlSearch(devUrls){
                var request = {
                    url: '/api/devurlsearch',
                    method:'post',
                    actions: {post: {method: 'POST'}}
                }
                return deffer.request(request, {devUrls:devUrls});
            }

            function advanceSearch(appIds, search_type){
                var request = {
                    url: '/api/advancesearch',
                    method:'post',
                    actions: {post: {method: 'POST'}}
                }
                return deffer.request(request, {appIds:appIds, search_type:search_type});
            }

            function getAppSearch(path){
                var request = {
                    url: '/api/appsearch',
                    method:'get',
                }
                return deffer.request(request, {path:path});
            }

            function downloadCsvFile(filename){
                var request = {
                    url: '/api/download-csvFile',
                    method: 'get'
                }
                return deffer.request(request,{filename});
            }

            function exportCsv(appdatas){
                var request = {
                    url: '/api/export-csv',
                    method:'post',
                    actions: {post: {method: 'POST'}}
                }
                return deffer.request(request, {appdatas});
            }

            function advanceDownload(filename){
                var request = {
                    url: '/api/advance-download/api/advance-download',
                    method:'get'
                }
                return deffer.request(request,{filename});
            }

        });
})();