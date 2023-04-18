
(function() {
    'use strict';

    angular
    .module('materialApp', [
        'ui.router',
        'ngMaterial',
        'ngResource',
        'ui.bootstrap',
        'angular-clipboard',
        'ngTableToCsv',
        'angularMoment',
        'angular-jwt'
    ]).config(function($mdThemingProvider) {
    $mdThemingProvider.theme('altTheme')
        .primaryPalette('blue')
        .accentPalette('pink');
    });
    
})();