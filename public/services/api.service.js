(function () {
    'use strict';

    angular
        .module('materialApp')
        .service('api', function ($resource, deffer, Utils) {
            var service = {
                zoneList: zoneList,
                addZone: addZone,
                addDns: addDns,
                login: login,
                checkDns: checkDns,
                verifyToken: verifyToken,
                domainFileCheck: domainFileCheck,
                checkSsl: checkSsl,
                disableSsl: disableSsl,
                domainAnalytics: domainAnalytics
            };
    
            return service;
    
            function zoneList(param) {
                param = Utils.jsonToUrlParam(param);                
                var request = {
                    url: '/api/zones/'+param,
                    method: 'get'
                }

                return deffer.request(request,{});
            }

            function addZone(param) {
                var request = {
                    url: '/api/zones/',
                    method: 'post',
                    actions: {post: {method: 'POST'}}
                }

                return deffer.request(request,{name: param.name});
            }

            function addDns(param) {
                var request = {
                    url: '/api/zones/'+param.id+'/dns_records',
                    method: 'post',
                    actions: {post: {method: 'POST'}}
                }
                param.proxy = (param.proxy==="true"||param.proxy===true)? true: false;
                return deffer.request(request, {type: param.type, name: param.name, content: param.content, proxied: param.proxy, proxiable:param.proxy, ttl: 1});
            }

            function login(param) {
                
                var request = {
                    url: '/api/auth',
                    method: 'post',
                    actions: {post: {method: 'POST'}}
                }

                return deffer.request(request,param);
            }

            function verifyToken(token) {
                
                var request = {
                    url: '/api/auth/verify',
                    method: 'post',
                    actions: {post: {method: 'POST'}}
                }

                return deffer.request(request, {token: token});
            }

            function checkDns(domain) {
                var request = {
                    url: '/api/zones/check',
                    method: 'post',
                    actions: {post: {method: 'POST'}}
                }

                return deffer.request(request,{domain: domain});
            }

            function domainFileCheck(file) {
                var request = {
                    url: '/api/domain-file-check',
                    method: 'post',
                    actions: {post: {method: 'POST'}}
                }

                return deffer.request(request,{file: file});
            }

            function checkSsl(domains) {
                var request = {
                    url: '/api/zones/check-ssl',
                    method: 'post',
                    actions: {post: {method: 'POST'}}
                }

                return deffer.request(request,{domains: domains});
            }

            function disableSsl(domains) {
                var request = {
                    url: '/api/zones/disable-ssl',
                    method: 'post',
                    actions: {post: {method: 'POST'}}
                }

                return deffer.request(request,{domains: domains});
            }

            function domainAnalytics(params) {
                var request = {
                    url: '/api/zones/check-analytics',
                    method: 'post',
                    actions: {post: {method: 'POST'}}
                }

                return deffer.request(request,params);
            }

        });
})();