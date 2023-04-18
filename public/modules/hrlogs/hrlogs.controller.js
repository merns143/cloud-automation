
(function() {
    'use strict';

    angular.module('materialApp')
    .controller('HrlogsController', HrlogsController);

    function HrlogsController(hrlogs, $mdDialog, alertService, AuthService, moment, $window) {

        var vm = this;
        vm.users = [];
        vm.downloadRange = 'LAST_7_DAYS';
        vm.formatDate = formatDate;
        vm.deleteUser = deleteUser;
        vm.hideLoading = hideLoading;
        vm.submit = submit;
        vm.addUserDialog = addUserDialog;
        vm.download = download;
        vm.refreshList = refreshList;

        if (AuthService.isMasterAdmin()) {
            initialize();
        }

        function initialize() {
            showLoading();
            getList();
        }

        function getList() {
            hrlogs.getUsers().then(function(res){
                hideLoading();
                vm.users = res.data;
            }, function(err){
                hideLoading();
                alertService.show(`Failed to fetch users. ${err.data.msg}`); 
            });
        }

        function refreshList() {
            showLoading();
            getList();
        }

        function formatDate(date) {
            return moment(date).format('YYYY-MM-DD');
        }

        function deleteUser(user) {
            showLoading();
            hrlogs.deleteUser(user.user_id).then(function(res){
                alertService.show('User deleted');           
                getList();
            }, function(err){
                hideLoading();
                alertService.show(`Failed to delete user. ${err.data.msg}`); 
            });
        }

        function addUserDialog($event) {
            $mdDialog.show({
                contentElement: '#addUserDialog',
                parent: angular.element(document.body)
            });
        }

        function submit() {
            showLoading();
            hrlogs.createUser(vm.form).then(function(res){
                alertService.show('User created');
                getList();
            }, function(err){
                hideLoading();
                alertService.show(`Failed to create user. ${err.data.msg}`); 
            });
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

        function download() {
            $window.open(`/api/hrlogs/download-logs?range=${vm.downloadRange}&accessToken=${AuthService.getToken()}`, '_blank');
        }
    };

})();