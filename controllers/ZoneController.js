var config = require('../config');
var cf = require('cloudflare')({
    email: config.email,
    key: config.key
});
var request = require('request');
var HTTPStatus = require('http-status');
var zoneHelper = require('../helpers/zoneHelper');
var Json2csvParser = require('json2csv').Parser;
var fs = require('fs');
const axios = require("axios");
const baseUrl = 'https://api.cloudflare.com/client/v4';

var loadDomains = (page) => {
    return new Promise(async (resolve, reject) => {
        const param = {
            per_page: 1000,
            page: page
        };

        await cf.zones.browse(param).then(        
            (response) => {
                resolve(response);
            }, 
            (err) => {
                reject(err);
            }
        );
    });
};

var getAllCfDomains = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let domains = [];
            let page = 0;
            let data = null;

            do {
                page++;
                data = await loadDomains(page);

                if (data.success) {
                    domains = domains.concat(data.result);
                }

            } while (data.success && page < data.result_info.total_pages);

            resolve(domains);
        } catch (e) {
            reject(e);
        }
    });
};

const getDomainId = (domain) => {
    return axios.get(`${baseUrl}/zones?name=${domain}`, {
        headers: {
            'X-Auth-Email': 'vic@nexysmedia.com',
            'X-Auth-Key': '410e1a0096deb74f8170a06a27935c0d222fa',
            'Content-Type': 'application/json'
        }
    });
};

const getZoneAnalytics = (id, since, until) => {
    return axios.get(`${baseUrl}/zones/${id}/analytics/dashboard?since=${since}&until=${until}`, {
        headers: {
            'X-Auth-Email': 'vic@nexysmedia.com',
            'X-Auth-Key': '410e1a0096deb74f8170a06a27935c0d222fa',
            'Content-Type': 'application/json'
        }
    });
};

const getAnalaytics = async (domain, since, until) => {
    const response = await getDomainId(domain);
    if (response.data.result_info.count > 0) {
        let total = 0;
        const id = response.data.result[0].id;
        const analytics = await getZoneAnalytics(id, since, until);
        if (analytics.data.success) {
            total = analytics.data.result.totals.requests.all;
        }
        return {domain: domain, id: id, exist: true, requests: total};
    } else {
        return {domain: domain, exist: false, requests: 'Not found'};
    }
};

module.exports = {

    get_list:  function(req, res) {
        var params = {};
        if (req.params.filter){
            var filters = req.params.filter.split('&');

            for (var i = 0; i < filters.length; i++){
                var param = filters[i].split('=');
                
                params[param[0]] = param[1];
            }
        }
        cf.zones.browse(params).then(
        
            function (response) {

                res.status(200).json(response);
                
            }, 
            function(err){
                var error = {
                    "status":"ERROR",
                };
                res.status(500).json(error);
            }
        );
    },

    add: function(req, res) {
        cf.zones.add({
            name: req.body.name,
            organization: {
                id: config.cf_org_id,
                name: config.cr_org_name
            }
        }).then(
        
            function (response) {

                res.status(200).json(response);
                
            }, 
            function(err){
                var error = {
                    "status":"ERROR",
                    "resource": {
                            "name": req.body.name
                        }
                };
                res.status(500).json(error);
            }
        );
    },

    details: function(req, res) {
        cf.zones.read(req.params.id).then(

            function (response) {

                res.status(200).json(response);
                
            }, 
            function(err){
                var error = {
                    "status":"ERROR",
                };
                res.status(500).json(error);
            }
        );
    },

    get_dns_list: function(req, res) {
        cf.dnsRecords.browse(req.params.id).then(
        
            function (response) {

                res.status(200).json(response);
                
            },
            function(err){
                var error = {
                    "status":"ERROR",
                };
                res.status(500).json(error);
            }
        );
    },

    add_dns: function(req, res) {
        
        cf.dnsRecords.add(req.params.id, req.body).then(
        
            function (response) {

                res.status(200).json(response);
                
            }, 
            function(err){
                var error = {
                    "status":"ERROR",
                };
                res.status(500).json(error);
            }
        );
    },

    checker: function(req, res) {
        try {
            // send request
            request(req.body.domain, (error, response, body) => {
                // Website is up
                if (!error && (response.statusCode === 200 || response.status === 301 || response.status === 302 || response.status === 404) ) {
                    res.status(200).json({name: req.body.domain, status: true, detail: HTTPStatus[response.statusCode]});
                }
 
                // No error but website not ok
                else if (!error) {
                    res.status(200).json({name: req.body.domain, status: true, detail: HTTPStatus[response.statusCode]});
                }
 
                // Loading error
                else {
                    res.status(200).json({name: req.body.domain, status: false, detail: error.code});
                }
            });
        }
        catch (err) {
            res.status(200).json({name: req.body.domain, status: false, detail: err.code});            
        }
    },    

    check_ssl: async function(req, res) {

        try {
            if (req.body.domains) {
                var domains = req.body.domains.split(',');

                if (domains.length <= 50) {
                    var result = await zoneHelper.getDomainsSslSetting(domains);
                    res.status(200).json({settings: result});
                } else {
                   res.status(400).json({message: 'Cannot process at most 50 domains.'}); 
                }
            } else {
                res.status(400).json({message: 'Domains required'});
            }
        } catch(err) {
            res.status(500).json({message: 'Something went wrong!'});
        }
        
    },    

    disable_ssl: async function(req, res) {
        
        try {
            if (req.body.domains) {
                var domains = req.body.domains.split(',');

                if (domains.length <= 50) {
                    var result = await zoneHelper.disableDomainsSslSetting(domains);
                    res.status(200).json({settings: result});
                } else {
                   res.status(400).json({message: 'Cannot process at most 50 domains.'}); 
                }
            } else {
                res.status(400).json({message: 'Domains required'});
            }
        } catch(err) {
            res.status(500).json({message: 'Something went wrong!'});
        }

    },

    download_domains: async (req, res) => {
        try {

            const domains = await getAllCfDomains();
            const fields = ['name'];
            const json2csvParser = new Json2csvParser({ fields });
            const csv = json2csvParser.parse(domains);

            await fs.writeFile('./domains.csv', csv, function (err) {
                if (err) {
                    throw new Error();
                }
                res.download("./domains.csv");                
            });
            
        } catch(err) {
            res.status(500).json({message: 'Something went wrong. Please try again.'});
        }
    },

    check_analytics: async (req, res) => {
        req.setTimeout(500000);
        try {
            if (req.body.domains && req.body.since && req.body.until) {

                const domains = req.body.domains.split(',');
                let promises = [];
                if (domains.length <= 300 && domains.length > 0) {

                    let data = [];

                    for (let i = 0; i < domains.length; i++) {
                        const domain = domains[i].trim();
                        if (domain) {
                            promises.push(getAnalaytics(domain, req.body.since, req.body.until))
                        }
                    }

                    data = await Promise.all(promises);
                    res.status(200).json({data: data});
                } else {
                    res.status(400).json({message: 'Invalid number of domains'});
                }
                
            } else {
                res.status(400).json({message: 'Invalid request'});
            }
        } catch(err) {
            console.log(err);
            res.status(500).json({message: 'Something went wrong. Please try again.'});
        }
    }
}