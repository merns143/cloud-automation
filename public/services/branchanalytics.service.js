(function () {
    'use strict';

    angular
        .module('materialApp')
        .service('branchanalytics', function (deffer) {
        
        var service = {
            getBranchData: getBranchData
        };

        return service;

        function getBranchData() {
            var request = {
                url: '/api/branchanalytics',
                method: 'get'
            }
            return deffer.request(request,{});
        }

    });
})();