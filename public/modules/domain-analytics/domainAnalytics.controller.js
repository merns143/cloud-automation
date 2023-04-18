(function() {
    'use strict';

    angular
        .module('materialApp')
        .controller('DomainAnalyticsController', DomainAnalyticsController);

    /** @ngInject */
    function DomainAnalyticsController(api, $mdDialog, alertService, $timeout, $window, moment) {
        var vm = this;
        vm.list = [];
        vm.copy = '';
        vm.supported = true;
        vm.interval = null;
        vm.checkDomains = checkDomains;
        vm.copySuccess = copySuccess;
        vm.copyFail = copyFail;

        function checkDomains(ev) {
            scrollTop();
            if (vm.domains && vm.interval) {
                var domains = vm.domains.split('\n');

                domains = domains
                .map(function(x){
                    var domain = x.trim();

                    if (domain) {
                        var match = /([a-z0-9]+\.)*([a-z0-9]+\.[a-z.]+)/g.exec(domain);
                        if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
                            return match[2];
                        }
                        else {
                            return domain;
                        }
                    }
                    
                })
                .filter(filterDomains);

                console.log(domains);
                if (domains.length > 300) {
                    alertService.show("Please provide atmost 300 domains!");
                    return;
                } else {
                    showLoading();

                    var params = getParams(domains, vm.interval);
                    api.domainAnalytics(params).then(function(res){

                        hideLoading();

                        if (res.data) { 

                            vm.results = res.data;
                            vm.copy = res.data.map(function(x){
                                return `${x.domain} - ${x.requests}`;
                            }).join('\n');
                        } else {
                            addToast(false, 'Request Failed, please try again.');
                            vm.results = null;
                        }

                    }, function(err){
                        addToast(false, 'Request Failed, please try again.');    
                        vm.results = null;
                        hideLoading();
                    });
                }
            } else {
                alertService.show("Please provide atmost 300 domains and time interval!");
            } 
        }

        function filterDomains(value, index, self) { 
            return value && self.indexOf(value) === index;
        }

        function getParams(domains, interval) {
            var params = {
                domains: domains.join(','),
                until: moment().utc().format('YYYY-MM-DDTHH:mm:00')
            };

            if (interval == 1) {
                params.since = moment(params.until).subtract(30, 'minutes').format('YYYY-MM-DDTHH:mm:00')
            }

            if (interval == 2) {
                params.since = moment(params.until).subtract(6, 'hours').format('YYYY-MM-DDTHH:mm:00')
            }

            if (interval == 3) {
                params.since = moment(params.until).subtract(24, 'hours').format('YYYY-MM-DDTHH:mm:00')
            }

            if (interval == 4) {
                params.since = moment(params.until).subtract(7, 'days').format('YYYY-MM-DDTHH:mm:00')
            }
            
            params.until += 'Z';    
            params.since += 'Z';
            // params.until = `${params.until}Z`;
            // params.since = `${params.since}Z`;
            return params;
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

       function copySuccess() {
        alertService.show("Copied to clipboard!");
       }

       function copyFail() {
        alertService.show("Please try again!");
       }

       function scrollTop() {
        $window.scrollTo(0, 0);
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
    }
})();