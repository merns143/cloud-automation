(function () {
    'use strict';

    angular
        .module('materialApp')
        .service('trackingDomains', function ($resource, deffer, Utils) {

            var service = {
                getCredentials: getCredentials,
                deleteCredential: deleteCredential,
                addCredential: addCredential,

                getTrackingDomains: getTrackingDomains,
                addTrackingDomains: addTrackingDomains,

                viewLogs: viewLogs,
                downloadUrls: downloadUrls
            };
    
            return service;

            function getCredentials() {
                var request = {
                    url: '/api/tracking-credentials',
                    method: 'get'
                }
                return deffer.request(request,{});
            }

            function deleteCredential(id) {
                var request = {
                    url: '/api/tracking-credentials/'+id,
                    method: 'delete'
                }
                return deffer.request(request,{});
            }

            function addCredential(token) {
                var request = {
                    url: '/api/tracking-credentials',
                    method: 'post',
                    actions: {post: {method: 'POST'}}
                }

                return deffer.request(request,{credential_token: token});
            }


            function getTrackingDomains() {
                var request = {
                    url: '/api/tracking-domains',
                    method: 'get'
                }
                return deffer.request(request,{});
            }

            function addTrackingDomains(param) {
                var request = {
                    url: '/api/tracking-domains',
                    method: 'post',
                    actions: {post: {method: 'POST'}}
                }

                return deffer.request(request,{domains: param});
            }

            function viewLogs() {
                return 'https://trkalerts.glowlytics.com/logs';
            }

            function downloadUrls() {
                return 'https://trkalerts.glowlytics.com/api/download-urls';
            }
        });
})();