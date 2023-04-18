(function () {
    'use strict';

    angular
        .module('materialApp')
        .factory('Utils', function ($httpParamSerializer) {
            return {
                
                // Convert json to URL parameter
                jsonToUrlParam: function (json) {

                    var url = decodeURIComponent($httpParamSerializer(json));
                    
                    url = url.replace(/=all($|&)/g , "=&");

                    return url;
                },

                hashIt: function(param) {
                    return btoa(param);
                },

                arrayUnique: function(array) {
                    return [...new Set(array)];
                },

                getCountryLanguages: function(country) {
                    var languages = [];

                    if (country.hasOwnProperty('language_1'))
                        languages.push(country.language_1);
                    if (country.hasOwnProperty('language_2'))
                        languages.push(country.language_2);
                    if (country.hasOwnProperty('language_3'))
                        languages.push(country.language_3);

                    return languages;
                },

                getCountryLanguageCodes: function(country) {
                    var codes = [];

                    if (country.hasOwnProperty('language_1_code'))
                        codes.push(country.language_1_code);
                    if (country.hasOwnProperty('language_2_code'))
                        codes.push(country.language_2_code);
                    if (country.hasOwnProperty('language_3_code'))
                        codes.push(country.language_3_code);

                    return codes;
                }
            };
        });
})();