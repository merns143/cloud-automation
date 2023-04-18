
(function() {
    'use strict';

    angular.module('materialApp')
    .controller('GeoController', GeoController);

    function GeoController(geo, $mdDialog, alertService, $timeout, $window, Utils) {

        var vm = this;
        vm.results;
        vm.languages;
        vm.display;
        vm.stackToasts = [];
        vm.languageCodeSubmit = languageCodeSubmit;
        vm.languageDisplay = languageDisplay;
        initialize();

        function initialize() {
            
        }

        function languageCodeSubmit(display) {
            vm.display = display;
            scrollTop();
            if (!vm.countries.length) {
                alertService.show("Please provide country names or country codes!");
            } else {

                var countries = vm.countries.split('\n');            
                var params = prepareParams(countries);
                showLoading();
                geo.query(params).then(function(res){

                    hideLoading();

                    if (res.data) { 

                        if (vm.display === 1) {

                            vm.results = cleanResponse(res.data);
                        }

                        if (vm.display === 1) {

                            vm.languages = languageDisplay(res.data);
                        }

                    } else {
                        addToast(false, 'Country Request Failed');
                        vm.results = null;
                    }
                }, function(err){
                    addToast(false, 'Country Request Failed');    
                    vm.results = null;
                    hideLoading();
                });
            }
        }

        function languageDisplay(data) {

            var languageList = [];
            var dlc = [];
            var plc = [];
            var ln = [];

            for (var i = 0; i < data.length; i++) {
                var country = data[i];

                if (country.country === "All") continue;

                dlc = dlc.concat(Utils.getCountryLanguageCodes(country));
                plc = plc.concat(Utils.getCountryLanguageCodes(country).map(x=>x.split(' ')[0].trim()));
                ln = ln.concat(Utils.getCountryLanguages(country).map(x=>x.split(' ')[0].trim()));
            }

            dlc = Utils.arrayUnique(dlc);
            plc = Utils.arrayUnique(plc);
            ln = Utils.arrayUnique(ln);


            for (var i = 0; i < dlc.length; i++) {
                languageList.push({
                    dlc: dlc[i] ? dlc[i] : '',
                    plc: plc[i] ? plc[i] : '',
                    ln: ln[i] ? ln[i] : ''
                });
            }

            return languageList;
        }

        function cleanResponse(res) {
            var data = res.map(function(country) {
                var ln = Utils.getCountryLanguages(country);
                country.language_names = Utils.arrayUnique(ln);

                var lc = Utils.getCountryLanguageCodes(country);
                country.language_codes = Utils.arrayUnique(lc);
                return country;
            });

            if (data.length > 0) {            
                var all_lc = data.map(function(x) {
                    return x.language_codes;
                });

                all_lc = [].concat.apply([], all_lc);
                
                data.push({
                    country: 'All',
                    country_code: '--',
                    language_codes: Utils.arrayUnique(all_lc)
                });
            }

            return data;
        }

        function prepareParams(countries) {
            var params = {
                country: [],
                country_code: []
            };

            for (var i = 0; i < countries.length; i++) {
                var country = countries[i];

                if (country.length > 2) {
                    params.country.push(country);
                } else {
                    params.country_code.push(country);
                }
            }

            return {
                country: params.country.join(','),
                country_code: params.country_code.join(',')
            };
        }

        function showLoading(ev) {
            $mdDialog.show({
                templateUrl: 'modules/dialog/progress-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                escapeToClose: false,
            });
        }

        function hideLoading() {
            $mdDialog.hide();
        }

        function addToast(type, domain) {
            var msg = (type)?"Success: ":"Error: ";
            msg +="`"+domain+"`";
            var t = vm.stackToasts.length * 60;
            vm.stackToasts.push({msg: msg, success: type, style: {top: t+"px"}});

            $timeout(function() {
                vm.stackToasts.splice((vm.stackToasts.length - 1), 1);
            }, 3000);
        }

        function scrollTop() {
            $window.scrollTo(0, 0);
        }

    };

})();