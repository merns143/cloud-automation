var config = require('../config');
var axios = require("axios");
var baseUrl = 'https://api.cloudflare.com/client/v4';
var headers = {
	'Content-Type': 'application/json',
	'X-Auth-Email': config.email,
	'X-Auth-Key': config.key
};

var getDomainId = async function (domain) {
    var link = `${baseUrl}/zones?name=${domain}`;
    return axios.get(link, { headers: headers }).then(function(response) {
        if (response.data && response.data.result && response.data.result.length > 0) {
            return response.data.result[0].id;
        } else {
            return null;
        }
    }).catch(function(err){
        return null;
    });
}

var	disableSsl = async function (id) {
    var link = `${baseUrl}/zones/${id}/ssl/universal/settings`;
    return axios.patch(link, {"enabled":false}, { headers: headers }).then(function(response) {
        return response.data.result.enabled;
    }).catch(function(err){
        return null;
    });
}

var getSslSetting = async function (id) {
    var link = `${baseUrl}/zones/${id}/ssl/universal/settings`;
    return axios.get(link, { headers: headers }).then(function(response) {
        return response.data.result.enabled;
    }).catch(function(err){
        return null;
    });
}

var	getDomainsSslSetting = async function (domains) {
	var result = [];
    for (var i = 0; i < domains.length; i++) {
        var domain = domains[i];        
        var id = await getDomainId(domain.trim());

        result.push({
        	domain: domain,
        	ssl: id ? await getSslSetting(id) : 'not found'
        });
    }

    return result;
}

var	disableDomainsSslSetting = async function (domains) {
	var result = [];
    for (var i = 0; i < domains.length; i++) {
        var domain = domains[i];        
        var id = await getDomainId(domain.trim());

        result.push({
        	domain: domain,
        	ssl: id ? await disableSsl(id) : 'not found'
        });
    }

    return result;
}

module.exports = { getDomainsSslSetting, disableDomainsSslSetting }