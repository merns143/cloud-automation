var config = require('../config');
var fs = require('fs');
var axios = require("axios").default;
var baseUrl = config.safebrowsingUrl;
var GetFlaggedUrls = require('../safeBrowsing_api');
const Json2csvParser = require('json2csv').Parser;
const fields = ['url', 'flagged'];


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

    get_voluum_credentials: function(req, res) {
        var link = baseUrl +'/voluum-credentials';
        axios.get(link).then(function(response) {
            res.status(200).json(response.data);
        }).catch(function(err){
            var error = {
                "status":"ERROR"
            };
            res.status(500).json(error);
        });
    },

    update_voluum_credentials: function(req, res) {
        var link = baseUrl +'/voluum-credentials/'+ req.params.id;
        var body = {
            accessId: req.body.accessId,
            accessKey: req.body.accessKey
        };
        axios.put(link, body).then(function(response) {
            res.status(200).json(response.data);
        }).catch(function(err){
            var error = {
                "status":"ERROR"
            };
            res.status(500).json(error);
        });   
    },

    get_avaiable_urls: function(req, res) {
        var link = baseUrl +'/available-urls';
        axios.get(link).then(function(response) {
            res.status(200).json(response.data);
        }).catch(function(err){
            var error = {
                "status":"ERROR"
            };
            res.status(500).json(error);
        });
    },

    add_avaiable_urls: function(req, res) {
        var link = baseUrl +'/available-urls';
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
    },

    get_domains: function(req, res) {
        var link = baseUrl +'/domains';
        axios.get(link).then(function(response) {
            res.status(200).json(response.data);
        }).catch(function(err){
            var error = {
                "status":"ERROR"
            };
            res.status(500).json(error);
        });
    },

    add_domains: function(req, res) {
        var link = baseUrl +'/domains';
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
    },

    handle_domains_checking: async function(domains, res) {

        try {            
            domains = await GetFlaggedUrls(domains);

            const json2csvParser = new Json2csvParser({ fields });
            const csv = json2csvParser.parse(domains);
            let response = true;
            fs.writeFile('./result.csv', csv, function (err) {
                if (err) {
                    response = false;
                }
                
            });           
            
            res.status(200).json({success: true, domains: domains, downloadAvailabe: response});
        } catch (err) {
            console.log(err);
            res.status(500).json({success: false});
        }
    }

}