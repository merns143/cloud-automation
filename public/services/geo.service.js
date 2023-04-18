(function () {
    'use strict';

    angular
        .module('materialApp')
        .service('geo', function ($resource, deffer, Utils) {

            var service = {
                all: all,
                query: query
            };
    
            return service;

            function all() {
                var request = {
                    url: '/api/geo/all',
                    method: 'get'
                }
                return deffer.request(request,{});
            }

            function query(param) {
                param = Utils.jsonToUrlParam(param);     
                var request = {
                    url: '/api/geo/query?'+param,
                    method: 'get'
                }
                return deffer.request(request,{});
            }
        });
})();