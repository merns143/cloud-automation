
(function() {
    'use strict';

    angular.module('materialApp')
    .controller('SettingsDialogController', SettingsDialogController);

    function SettingsDialogController($mdDialog) {
        var vm = this;

        vm.hide = hide;
        vm.cancel = cancel;

        function hide() {
            $mdDialog.hide();
        }

        function cancel() {
            $mdDialog.cancel();
        }

    };


})();