(function() {
    'use strict';
    angular
        .module('materialApp')
        .service('trafficService', function($resource, deffer, Utils) {
            
            var service = {
                getBalances: getBalances,
                updateBalances: updateBalances
            };

            return service;

            function getBalances() {
                var request = {
                    url: '/api/traffic-source/balances',
                    method: 'get'
                }
                return deffer.request(request,{});
            }

            function updateBalances(token) {
                var request = {
                    url: '/api/traffic-source/balances/update',
                    method: 'post',
                    actions: {post: {method: 'POST'}}
                }

                return deffer.request(request,{});
            } 
            
        });
})();