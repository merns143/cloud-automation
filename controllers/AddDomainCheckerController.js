var fs = require('fs');
const axios = require("axios");
const baseUrl = 'https://api.cloudflare.com/client/v4';


const getDomainDetails = (domain) => {
    return axios.get(`${baseUrl}/zones?name=${domain}`, {
        headers: {
            'X-Auth-Email': 'vic@nexysmedia.com',
            'X-Auth-Key': '410e1a0096deb74f8170a06a27935c0d222fa',
            'Content-Type': 'application/json'
        }
    });
};

module.exports = {

    domainchecker: async function(req, res){
        var domain = req.body.domain;
        var respond = await getDomainDetails(domain);
        if (respond.data.result.length > 0){
            res.status(200).json({name: req.body.domain, status: true});
        }else{
            res.status(200).json({name: req.body.domain, status: false});
        }
    }
    
}