var axios = require("axios").default;
var _sendRequest =  async function(urls) {
    return new Promise((resolve, reject) => {

        var _KEYS = [
            "AIzaSyCuzDUWkpN92BHuL8sHoMu7_TkuZMoZ42g",
            "AIzaSyAh-B4MY2XpM3EH2KnSl9VDg1xtX_vup2M",
            "AIzaSyAoEYMXJm-kwbz-XiOMD5TDyOU_0ossLrg",
            "AIzaSyBsalzlCl5jRC9AKP6jbpP_LLvCKL23pZQ",
        ];

        var _API_KEY = _KEYS[Math.floor(Math.random() * _KEYS.length)];

        //Change the api key


        var LINK = "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=" + _API_KEY;
        var headers = { "Content-Type": "application/json" };
        var body = {
            "client": {
                "clientId": "nexysMedia",
                "clientVersion": "1.0"
            },
            "threatInfo": {
                "threatTypes": ["THREAT_TYPE_UNSPECIFIED", "MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                "platformTypes": ["WINDOWS", "OSX", "ANDROID", "IOS"],
                "threatEntryTypes": ["URL"],
                "threatEntries": []
            }
        };
        //Adding the links to the request objects
        urls.forEach((u) => {
            if (u)
                body.threatInfo.threatEntries.push({
                    "url": u.trim()
                });
        });
        

        try {
            //Send the request to the goolge api
            axios.post(LINK, body, {
                headers
            }).then((data) => {
                if (!data.data.matches) {
                    resolve(domainMap(urls, []));
                    return;
                }
                var response = data.data.matches.map(o => o.threat.url.trim());
                var set = new Set(response);
                var unique_list_flagged = Array.from(set);
                urls = domainMap(urls, unique_list_flagged);

                resolve(urls);

            }, (err) => {
                resolve(domainMap(urls, []));
            }).catch(err => {
                resolve(domainMap(urls, []));
            });
            
        } catch (err) {
            resolve(domainMap(urls, []));
        }
        

    }); //End New Promise
}

var domainMap = function(domains, flagged)  {
    return domains.map(url => {
        var data = {
            'url': url,
            'flagged': flagged.indexOf(url.trim()) !== -1
        };

        return data;
    });
}

module.exports = async function GetFlaggedUrls(urls) {
    return new Promise(async (resolve,reject)=>{
        try{
            var domains = [];
            
            if (urls.length <= 500) {
                domains = await _sendRequest(urls);
            } else {
                while (urls.length != 0) {
                    var data = urls.slice(0, 500);
                    urls = urls.slice(500);
        
                    var checked = await _sendRequest(data);
                    domains = domains.concat(checked);
                }
            }

            resolve(domains);
        }
        catch(err){
            console.log(err);
            reject([]);
        }
    });

}