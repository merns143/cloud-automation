(function () {
    'use strict';

    angular
        .module('materialApp')
        .service('hrlogs', function ($resource, deffer, Utils) {

            var service = {
                getUsers: getUsers,
                deleteUser: deleteUser,
                createUser: createUser
            };
    
            return service;

            function getUsers() {
                var request = {
                    url: '/api/hrlogs/users',
                    method: 'get'
                }
                return deffer.request(request,{});
            }

            function deleteUser(id) {
                var request = {
                    url: '/api/hrlogs/'+id,
                    method: 'delete'
                }
                return deffer.request(request,{});
            }

            function createUser(params) {
                var request = {
                    url: '/api/hrlogs/add-user',
                    method: 'post',
                    actions: {post: {method: 'POST'}}
                }
                return deffer.request(request, params);
            }
        });
})();