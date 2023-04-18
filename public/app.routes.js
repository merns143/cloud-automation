
(function() {
    'use strict';

    angular.module('materialApp')
    .config(config);

    function config($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/app/home');

        // UI Router States
        // Inserting Page title as State Param
        $stateProvider       
                   
        .state('app', {
            abstract: true,
            url: '/app',
        }) 
        .state('app.home', {
            url: '/home',
            views: {
                'main@': {                    
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.home': {
                    templateUrl: '/modules/list/list.html',
                    controller: 'ListController as vm'
                }
            },
            params: {
                title: "Flutter+"
            }
        }) 
        .state('app.login', {
            url: '/login',
            views: {
                'main@': {                    
                    templateUrl: '/modules/login/login.html',
                    controller: 'LoginController as vm'
                }
            }
        }) 
        .state('app.addGroup', {
            url: '/add-group',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.addGroup': {
                    templateUrl: '/modules/add-group/add-group.html',
                    controller: 'AddGroupController as vm'
                }
            },
            params: {
                title: "Add Domains and DNS"
            }
        })
        .state('app.addDomain', {
            url: '/add-domain',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.addDomain': {
                    templateUrl: '/modules/add-domain/add-domain.html',
                    controller: 'AddDomainController as vm'
                }
            },
            params: {
                title: "Add Domains"
            }
        })
        .state('app.addDomainChecker', {
            url: '/add-domain-checker',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.addDomainChecker': {
                    templateUrl: '/modules/add-domain-checker/add-domain-checker.html',
                    controller: 'AddDomainCheckerController as vm'
                }
            },
            params: {
                title: "Add Domain Checker"
            }
        })
        .state('app.addDns', {
            url: '/add-dns',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.addDns': {
                    templateUrl: '/modules/add-dns/add-dns.html',
                    controller: 'AddDnsController as vm'
                }
            },
            params: {
                title: "Add DNS"
            }
        })
        .state('app.uptimeCheck', {
            url: '/uptime-check',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.uptimeCheck': {
                    templateUrl: '/modules/uptime-check/uptime-check.html',
                    controller: 'UptimeCheckController as vm'
                }
            },
            params: {
                title: "DNS Uptime Check"
            }
        })
        .state('app.safeBrowsing', {
            url: '/safe-browsing',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.safeBrowsing': {
                    templateUrl: '/modules/safe-browsing/safe-browsing.html',
                    controller: 'SafeBrowsingController as vm'
                }
            },
            params: {
                title: "Safe Browsing"
            }
        })
        .state('app.trackingDomains', {
            url: '/tracking-domains',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.trackingDomains': {
                    templateUrl: '/modules/tracking-domains/tracking-domains.html',
                    controller: 'TrackingDomainsController as vm'
                }
            },
            params: {
                title: "Tracking Domains"
            }
        })
        .state('app.domainCheck', {
            url: '/domain-check',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.domainCheck': {
                    templateUrl: '/modules/domain-check/domain-check.html',
                    controller: 'DomainCheckController as vm'
                }
            },
            params: {
                title: "Domain Check"
            }
        })
        .state('app.geo', {
            url: '/geo',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.geo': {
                    templateUrl: '/modules/geo/geo.html',
                    controller: 'GeoController as vm'
                }
            },
            params: {
                title: "Geo"
            }
        })
        .state('app.sslDisable', {
            url: '/universal-ssl-disable',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.sslDisable': {
                    templateUrl: '/modules/ssl-disable/sslDisable.html',
                    controller: 'SslDisableController as vm'
                }
            },
            params: {
                title: "Disable Universal SSL"
            }
        })
        .state('app.domainAnalytics', {
            url: '/domain-analytics',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.domainAnalytics': {
                    templateUrl: '/modules/domain-analytics/domain-analytics.html',
                    controller: 'DomainAnalyticsController as vm'
                }
            },
            params: {
                title: "Domain Analytics"
            }
        })
        .state('app.trafficSource', {
            url: '/traffice-source',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.trafficSource': {
                    templateUrl: '/modules/traffic-source/traffic-source.html',
                    controller: 'TrafficSourceController as vm'
                }
            },
            params: {
                title: "Traffic Source"
            }
        })
        .state('app.hrlogs', {
            url: '/hrlogs',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.hrlogs': {
                    templateUrl: '/modules/hrlogs/hrlogs.html',
                    controller: 'HrlogsController as vm'
                }
            },
            params: {
                title: "HR Logs"
            }
        })
        .state('app.speechtotext', {
            url: '/speechtotext',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.speechtotext': {
                    templateUrl: '/modules/speech-to-text/speech-to-text.html',
                    controller: 'SpeechToTextController as vm'
                }
            },
            params: {
                title: "Speech To Text"
            }
        })
        .state('app.appsearch', {
            url: '/appsearch',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.appsearch': {
                    templateUrl: '/modules/app-search/app-search.html',
                    controller: 'AppSearchController as vm'
                }
            },
            params: {
                title: "Sensortower App Search"
            }
        })
        .state('app.keywordwatcher', {
            url: '/keywordwatcher',
            views: {
                'main@': {
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.keywordwatcher': {
                    templateUrl: '/modules/keyword-watcher/keyword-watcher.html',
                    controller: 'KeywordWatcherController as vm'
                }
            },
            params: {
                title: "Flippa Keyword Watcher"
            }
        })
        .state('app.branchanalytics', {
            url: '/branchanalytics',
            views:{
                'main@':{
                    templateUrl: '/modules/home/home.html',
                    controller: 'HomeController as vm'
                },
                'content@app.branchanalytics':{
                    templateUrl: '/modules/branch-analytics/branch-analytics.html',
                    controller: 'BranchAnalyticsController as vm'
                }
            },
            params:{
                title: "Branch Analytics"
            }
        });

        $locationProvider.html5Mode(true);

    };

})();