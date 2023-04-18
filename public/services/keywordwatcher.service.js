(function () {
    'use strict';

    angular
        .module('materialApp')
        .service('keywordwatcher', function (deffer) {

            var service = {
                getKeyword: getKeyword,
                deleteKeyword: deleteKeyword,
                addKeyword: addKeyword                
            };

            return service;

            function getKeyword(){
                var request = {
                    url: '/api/keywordwatcher',
                    method:'get',
                }
                return deffer.request(request, {});
            }

            function addKeyword(keywords, property_types){
                var request = {
                    url: '/api/keywordwatcher',
                    method:'post',
                    actions: {post: {method: 'POST'}}
                }
                return deffer.request(request, {keywords:keywords, property_types:property_types});
            }

            function deleteKeyword(keyword) {
                var request = {
                    url: '/api/keywordwatcher/'+keyword,
                    method: 'delete'
                }
                return deffer.request(request,{});
            }
        });
})();