(function() {
  "use strict";

  angular
    .module("materialApp")
    .service("safebrowsing", function($resource, deffer, Utils) {
      var service = {
        getCredentials: getCredentials,
        deleteCredential: deleteCredential,
        addCredential: addCredential,

        getVoluumCredentials: getVoluumCredentials,
        updateVoluumCredentials: updateVoluumCredentials,

        getAvailableUrls: getAvailableUrls,
        addAvailableUrls: addAvailableUrls,

        viewLogs: viewLogs,
        downloadUrls: downloadUrls,
        downloadDomains: downloadDomains,

        restartSbrowServer: restartSbrowServer,

        getDomainCounts: getDomainCounts,
        addDomains: addDomains
      };

      return service;

      function getCredentials() {
        var request = {
          url: "/api/credentials",
          method: "get"
        };
        return deffer.request(request, {});
      }

      function deleteCredential(id) {
        var request = {
          url: "/api/credentials/" + id,
          method: "delete"
        };
        return deffer.request(request, {});
      }

      function addCredential(token) {
        var request = {
          url: "/api/credentials",
          method: "post",
          actions: { post: { method: "POST" } }
        };

        return deffer.request(request, { credential_token: token });
      }

      function getVoluumCredentials() {
        var request = {
          url: "/api/voluum-credentials",
          method: "get"
        };
        return deffer.request(request, {});
      }

      function updateVoluumCredentials(params) {
        var request = {
          url: "/api/voluum-credentials/" + params.id,
          method: "put",
          actions: { put: { method: "PUT" } }
        };

        return deffer.request(request, {
          accessId: params.accessId,
          accessKey: params.accessKey
        });
      }

      function getAvailableUrls() {
        var request = {
          url: "/api/available-urls",
          method: "get"
        };
        return deffer.request(request, {});
      }

      function addAvailableUrls(param) {
        var request = {
          url: "/api/available-urls",
          method: "post",
          actions: { post: { method: "POST" } }
        };

        return deffer.request(request, { domains: param });
      }

      function addDomains(param) {
        var request = {
          url: "/api/domains",
          method: "post",
          actions: { post: { method: "POST" } }
        };

        return deffer.request(request, { domains: param });
      }

      function viewLogs() {
        return "https://sbrow.glowlytics.com/logs";
      }

      function downloadUrls() {
        return "https://sbrow.glowlytics.com/api/download-urls";
      }

      function downloadDomains() {
        return "https://sbrow.glowlytics.com/api/download-domains";
      }

      function restartSbrowServer() {
        var request = {
          url: "/api/server/sbrow/restart",
          method: "post",
          actions: { post: { method: "POST" } }
        };

        return deffer.request(request, {});
      }

      function getDomainCounts() {
        var request = {
          url: "/api/domains",
          method: "get"
        };
        return deffer.request(request, {});
      }
    });
})();
