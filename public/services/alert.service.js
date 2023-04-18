(function () {
    'use strict';

    angular
        .module('materialApp')
        .service('alertService', function ($mdToast, $mdDialog) {

            return {
                confirmation: function (data, action, confirmMessage, successMessage) {
                    var self = this;

                    var confirm = $mdDialog.confirm()
                        .title(confirmMessage)
                        .ok('Yes')
                        .cancel('Cancel');

                    $mdDialog.show(confirm).then(function () {
                        self.show(successMessage);
                    }, function (error) {
                        console.log(error);
                    });
                },

                show: function (message) {

                    var last = {
                        bottom: false,
                        top: true,
                        left: false,
                        right: false,
                        center: true
                    };

                    var toastPosition = angular.extend({}, last);

                    var getToastPosition = function () {
                        sanitizePosition();

                        return Object.keys(toastPosition)
                            .filter(function (pos) {
                                return toastPosition[pos];
                            })
                            .join(' ');
                    };

                    function sanitizePosition() {
                        var current = toastPosition;
                    }

                    var pinTo = getToastPosition();

                    return $mdToast.show(
                        $mdToast.simple()
                            .textContent(message)
                            .position(pinTo)
                            .hideDelay(3000)
                    );

                }
            };

        });
})();