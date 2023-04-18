
// (function() {
//     'use strict';

//     angular.module('materialApp')
//     .controller('ProgressDialogController', ProgressDialogController);

//     function ProgressDialogController($mdDialog, data, $timeout, api, $q) {
//         var vm = this;
//         vm.hide = hide;
//         vm.cancel = cancel;
//         vm.logs = [];

//         var ParentPromises = [];
//         var ChildPromises = [];

//         angular.forEach(data, function(zone){

//             ParentPromises.push(api.addZone({name: zone.domain}));

//         });

//         var parent = $q.all(ParentPromises);

//         parent.then(function(res){
//             angular.forEach(data, function(zone, key){
//                 var result = res[key];
//                 var zid = result.result.id;
//                 if (result.status === 'ERROR'){
//                     //vm.logs.push("domain: "+zone.domain+";  status: failed;");
//                 } else{
//                     angular.forEach(zone.subs, function(sub){
//                         ChildPromises.push(api.addDns({id:zid,type:zone.type,content:zone.content,name:sub}));
//                     });
//                 }
//             });
//         });

//         var child = $q.all(ChildPromises);

//         child.then(function(res){
//             hide();
//         })
        
//         $timeout(function(){
//            // hide();
//         }, 2000);
//         function hide() {
//             $mdDialog.hide();
//         }

//         function cancel() {
//             $mdDialog.cancel();
//         }

//     };


// })();