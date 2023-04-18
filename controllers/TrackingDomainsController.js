var config = require('../config');
var axios = require("axios").default;
var baseUrl = config.trackingDomainsUrl;
module.exports = {

    get_credentials:  function(req, res) {        
        var link = baseUrl +'/credentials';
        axios.get(link).then(function(response) {
            res.status(200).json(response.data);
        }).catch(function(err){
            var error = {
                "status":"ERROR"
            };
            res.status(500).json(error);
        });
    },

    add_credential: function(req, res) {

        var link = baseUrl +'/credentials';
        var body = {
            token: req.body.credential_token
        };
        axios.post(link, body).then(function(response) {
            res.status(200).json(response.data);
        }).catch(function(err){
            var error = {
                "status":"ERROR"
            };
            res.status(500).json(error);
        });        
    },

    delete_credential: function(req, res) {
        var link = baseUrl +'/credentials/'+ req.params.id;

        axios.delete(link).then(function(response) {
            res.status(200).json(response.data);
        }).catch(function(err){
            var error = {
                "status":"ERROR"
            };
            res.status(500).json(error);
        });
    },

    get_tracking_domains: function(req, res) {
        var link = baseUrl +'/tracking-domains';
        axios.get(link).then(function(response) {
            res.status(200).json(response.data);
        }).catch(function(err){
            var error = {
                "status":"ERROR"
            };
            res.status(500).json(error);
        });
    },

    add_tracking_domains: function(req, res) {
        var link = baseUrl +'/tracking-domains';
        var body = {
            domains: req.body.domains
        };
        axios.post(link, body).then(function(response) {
            res.status(200).json(response.data);
        }).catch(function(err){
            var error = {
                "status":"ERROR"
            };
            res.status(500).json(error);
        });   
    }
}