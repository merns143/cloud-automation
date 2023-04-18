(function () {
    'use strict';

    angular
        .module('materialApp')
        .service('deffer', function ($q, $resource) {
            var service = {
                request: request
            }
            return service;

            function request(obj, params) {

                // Create a new deferred object
                var deferred = $q.defer();

                // Generate the $resource object based on the stored API object
                var resourceObject = $resource(obj.url, obj.paramDefaults, obj.actions, obj.options);

                // Make the call...
                resourceObject[obj.method](params,

                    // Success
                    function (response)
                    {
                        deferred.resolve(response);
                    },

                    // Error
                    function (response)
                    {
                        deferred.reject(response);

                    }
                );

                // Return the promise
                return deferred.promise;

            }
        });
})();