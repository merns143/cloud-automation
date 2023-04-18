(function () {
    'use strict';

    angular
        .module('materialApp')
        .service('adddomainchecker', function (deffer) {
            var service = {
                domainchecker: domainchecker
            };
    
            return service;

            function domainchecker(domain) {
                var request = {
                    url: '/api/add-domain-checker',
                    method: 'post',
                    actions: {post: {method: 'POST'}}
                }

                return deffer.request(request,{domain: domain});
            }

        });
})();