// var config = require('./config');
// var cf = require('cloudflare')({
//     email: config.email,
//     key: config.key
// });
// //https://dash.cloudflare.com/api/v4/zones?per_page=20&account.id=86675069087be5d7c539a82e9f7d7a18
// cf.zones.browse({per_page: 1000, 'account.id': '86675069087be5d7c539a82e9f7d7a18'}).then(
    
//         function (response) {

            
//            //  console.log(response.result);
//             console.log(response.result.length);
//             let domains = response.result;  
//             for(let i=0; i<domains.length;i++) {
//                 cf.zones.del(domains[i].id).then(
                
//                     function (response) {
        
//                         console.log(domains[i].name + ' - deleted');
                        
//                     }, 
//                     function(err){
//                         console.log(domains[i].name + ' - not deleted');
//                     }
//                 );
//             }
            
//         }, 
//         function(err){
//             console.log(err);
//         }
//     );

// var isoCountries = {
//     'AF' : 'Afghanistan'
// };

// var codes = Object.keys(isoCountries);
// var mongoose = require('mongoose');
// console.log('codes:', codes.length);
// var Geo = require("./models/Geo");

// // codes = codes.slice(0, 10);
// var connectDb = async function() {
//     let prod_db_url = "mongodb://admin:BJ3Z1CoXwISt@ds247410.mlab.com:47410/heroku_c34cmh7n";
//     await mongoose.connect(prod_db_url,  {useNewUrlParser: true }, function(err, res) {
//         if (err) {
//             console.log("ERROR IN CONNECTING TO DATABASE")
//             throw err;
//         }
//         console.log("DATABASE CONNECTD");
//     });
// }

// var check = async function () {
//     for (var i = 0; i < codes.length; i++) {

//         var code = codes[i];
//         var country = isoCountries[code];
//         console.log(code, '- checking');
//         await Geo.find( { country_code: code }).exec().then(async (data) => {
//             if (data.length <= 0) {
//                 var newCountry = {
//                     country: country.trim(),
//                     country_code: code
//                 };

//                 var newCountryRequest = new Geo(newCountry);
//                 var promise = newCountryRequest.save();
//                 await promise.then(function (doc) {
//                     console.log('created country:', doc);
//                 });

//             }
//         }).catch((err)=>{
//             console.log(err);
//         });
//         console.log(code, '- checked');
//     }
// }

// var start = async function() {
//     console.log('start..');
//     await connectDb();
//     await check();
//     console.log('end..');
// }

// start();


var config = require('./config');
var domains = require('./broken-domains.js');
var cf = require('cloudflare')({
    email: config.email,
    key: config.key
});

var axios = require("axios");
axios.defaults.headers.common['X-Auth-Email'] = 'vic@nexysmedia.com';
axios.defaults.headers.common['X-Auth-Key'] = '410e1a0096deb74f8170a06a27935c0d222fa';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// domains = domains.splice(0, 15);

var domainUpdateSuccessCounter = 0;
var failedDomains = [];
var notfoundDomains = [];

var getHostName = function (url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    } else {
        return null;
    }
}

var getDomainId = async function (domain) {
    var link = `https://api.cloudflare.com/client/v4/zones?name=${domain}`;
    return axios.get(link).then(function(response) {
        if (response.data && response.data.result && response.data.result.length > 0) {
            return response.data.result[0].id;
        } else {
            return null;
        }
    }).catch(function(err){
        return null;
    });
}

var disableSsl = async function (id) {
    var link = `https://api.cloudflare.com/client/v4/zones/${id}/ssl/universal/settings`;
    return axios.patch(link, {"enabled":false}).then(function(response) {
        return response.data.success;
    }).catch(function(err){
        return null;
    });
}


var proccessDisable = async function (domain) {
    var id = await getDomainId(domain);
    if (id) {
        // var success = await disableSsl(id);
        // var success = true;
        // if (success) {
        //     domainUpdateSuccessCounter++;
        //     console.log(`Domain ${domain} - success  ${(new Date).toTimeString()}`);
        // } else {
        //     failedDomains.push(domain);
        //     console.log(`Domain ${domain} - fail  ${(new Date).toTimeString()}`);
        // }
    } else {
        notfoundDomains.push(domain);
        console.log(`Domain ${domain} not found.  ${(new Date).toTimeString()}`);
    }  
}

var processDomains = async function (domains) {
    for (var i = 0; i < domains.length; i++) {
        var domain = domains[i];
        await proccessDisable(domain.trim());
    }
}

function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

async function load () {

    try {

        console.log('Running function');

        failedDomains = [];

        var max = Math.ceil(domains.length / 500);

        for (var i = 0; i < max; i++) {
            var list = domains.splice(0, 500);
            await processDomains(list);

            if (list.length >= 500) {
                await delay(300000);
            }
            
        }

        // console.log(`
        //         successfull: ${domainUpdateSuccessCounter}
        //         failed: ${failedDomains.length}
        //         not found: ${notfoundDomains.length}
        // `);

        if (failedDomains.length > 0) {
            domains = failedDomains;
            load();
        }

        if (notfoundDomains.length > 0) {
            console.log(`Not found domains:`, notfoundDomains);
        }

    } catch(e) {
        console.log(e);
    }
    
}

load();
