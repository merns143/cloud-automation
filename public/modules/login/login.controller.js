(function() {
    'use strict';

    angular
        .module('materialApp')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(
        alertService,
        $state,
        api,
        AuthService
    ) {
        var vm = this;
        
        vm.submit = submit;
        
        AuthService.removeToken();

        function submit(){
            
            api.login(vm.form).then(function(res){
                if (res.success) {
                    AuthService.setToken(res.token);
                    alertService.show("Authentication success!");
                    $state.go('app.home');
                } else {
                    alertService.show(res.message);
                }
            }, function(err){
                alertService.show("Error occured when processing the request! ("+err.status+")");
            });
        }
    }
})();