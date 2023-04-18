(function () {
    'use strict';

    angular
        .module('materialApp')
        .service('RequestInterceptor', ['AuthService', '$location', '$q', function (AuthService, $location, $q) {
            var service = this;

            service.request = function (config) {

                if (AuthService.getToken()) {
                    config.headers['x-access-token'] = AuthService.getToken();
                } else {
                    delete config.headers['x-access-token'];
                                        
                    $location.path('/app/login');                    
                }
                return config;
            };

            service.responseError = function (response) {

                // if ( response.status === 401 || response.status === 402 || response.status === 403 ) {
                    
                //     AuthService.removeToken();
                    
                //     $location.path('/app/login'); 
                // }

                return $q.reject(response);
            };

        }])
        .config(['$httpProvider', '$qProvider', function ($httpProvider, $qProvider) {              
            $httpProvider.interceptors.push('RequestInterceptor');

            // Disable reporting of unhandled rejections
            $qProvider.errorOnUnhandledRejections(false);
        }]);

})();