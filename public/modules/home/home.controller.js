
(function() {
    'use strict';

    angular.module('materialApp')
    .controller('HomeController', HomeController);

    function HomeController($mdSidenav, $stateParams, $rootScope, $scope, $state, $location, $interval, $mdDialog, AuthService, api, alertService) {
        var vm = this;
        vm.showSettings = showSettings;
        vm.toggleLeft = toggleLeft;
        vm.goTo = goTo;
        vm.showLogOut = showLogOut;
        vm.masterAdmin = AuthService.isMasterAdmin();

        stateChange();
        
        // Update title using rootscope
        function stateChange() {

            if (AuthService.isAuthenticated()) {

                var path = $location.path();

                vm.title = $stateParams.title;

                if (path.indexOf('hrlogs') !== -1 && !AuthService.isMasterAdmin()) {
                    $location.path('/app/home');
                    alertService.show('Not Authorized.');
                }

            } else {
                $location.path('/app/login'); 
            }
        }

        function toggleLeft() {
            $mdSidenav('left').toggle();
        }

        function showSettings(ev) {
            var modalInstance = $mdDialog.show({
                controller: 'SettingsDialogController',
                controllerAs: 'vm',
                templateUrl: 'modules/home/settings-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
            });

        }

        function showLogOut(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                    .title('Log out')
                    .textContent('Are you sure you want to log out?')
                    .ariaLabel('Confirmation')
                    .targetEvent(ev)
                    .ok('Continue')
                    .cancel('Cancel');
        
            $mdDialog.show(confirm).then(function() {
                AuthService.removeToken();
                $state.go('app.login');
            }, function() {
                console.log('cancelled');
            });
        }

        function goTo(state) {
            $state.go(state);
        }
        
        // Run updateTitle on each state change
        $rootScope.$on('$stateChangeSuccess', stateChange);

    };


})();