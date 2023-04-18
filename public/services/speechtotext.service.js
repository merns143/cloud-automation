(function () {
    'use strict';

    angular
        .module('materialApp')
        .service('speechtotext', function (deffer) {

            var service = {
                getSpeechToText: getSpeechToText,
                addSpeechToText: addSpeechToText,
                downloadTranscribe: downloadTranscribe
            };
    
            return service;

            function getSpeechToText() {
                var request = {
                    url: '/api/speechtotext',
                    method: 'get'
                }
                return deffer.request(request,{});
            }

            function addSpeechToText(filename) {
                var request = {
                    url: '/api/speechtotext',
                    method: 'post',
                    actions: {post: {method: 'POST'}}
                }

                return deffer.request(request, {filename: filename});
            }

            function downloadTranscribe(filename){
                var request = {
                    url: '/api/download-speechtotext',
                    method: 'get'
                }
                return deffer.request(request,{filename});
            }


        });
})();