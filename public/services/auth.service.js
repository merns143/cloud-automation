(function () {
    'use strict';

    angular
        .module('materialApp')
        .service('AuthService', ['$window', 'jwtHelper', function ($window, jwtHelper) {
            var service = {
                setToken: setToken,
                getToken: getToken,
                removeToken: removeToken,
                isAuthenticated: isAuthenticated,
                isMasterAdmin: isMasterAdmin
            }
            return service;

            function setToken(token) {
                $window.localStorage.setItem('token', token);
            };
    
            function getToken() {

                var sessionToken = $window.localStorage.getItem('token');
    
                if (sessionToken !== undefined) {
                    return sessionToken;
                }
            };
    
           function removeToken() {               
                $window.localStorage.removeItem('token');
            };
    
            function isAuthenticated() {
                // Check if user is authenticated
                var token = getToken();
    
                if (token !== null && !jwtHelper.isTokenExpired(token)) {
                    return true;
                }

                return false;
            };

            function isMasterAdmin() {
                // Check if user is authenticated
                var token = getToken();
    
                if (token !== null) {
                    var user = jwtHelper.decodeToken(token);
                    return user.user === 'masteradmin' && user.role === 'masteradmin';
                }
    
                return false;
            };
        }]);
})();