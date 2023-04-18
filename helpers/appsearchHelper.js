const gplay = require('google-play-scraper');
const moment = require('moment');
const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');
var Client = require('ftp');
const AppSearchQueue = require("../models/AppSearchQueue");

const formatData = (rawData) => {
    return rawData.map(data => {
        return {
            appName: data.title,
            appId: data.appId,
            appUrl: data.url,
            description:data.description,
            released: data.released,
            updated: moment.unix((data.updated/1000)).format('MM/DD/YYYY HH:mm:ss'),
            installs: data.minInstalls,
            score: data.scoreText,
            rating: data.ratings,
            type: data.free ? 'free' : 'paid',
            contentRating: data.contentRating,
            monetizeType: getMonitizetype(data.adSupported, data.offersIAP),
            devName: data.developer,
            devEmail: data.developerEmail,
            devWebsite: data.developerWebsite ? data.developerWebsite : '',
            developerUrl: `https://play.google.com/store/apps/developer?id=${data.developer.trim().split(' ').join('+')}`
        };
    });
};

const sleep = (millis) => {
    return new Promise(resolve => setTimeout(resolve, millis));
}


const getMonitizetype = (adSupported, offersIAP) => {
    let res = '';

    if (adSupported && offersIAP) {
        res = 'Contains Ads·Offers in-app purchases';
    } else if (adSupported && !offersIAP) {
        res = 'Contains Ads';
    } else if (!adSupported && offersIAP) {
        res = 'Offers in-app purchases';
    }

    return res;
};

const upload = (filename) => {
    return new Promise((resolve, reject)=>{
        var c = new Client();
            c.on('ready', function() {
                var csvFile = fs.createReadStream(`./appscrapedata/${filename}`);
                c.put(csvFile, `/AppSearch/Android/${filename}`, function(err) {
                    if (err) { 
                        reject(err);
                    }else{
                        c.end();
                        fs.unlinkSync(`./appscrapedata/${filename}`);
                        resolve(true);
                    }
                });
            });

            // connect to ftp:21
            c.connect({host: '198.143.141.58', user: 'files@arctuslabs.com', password: '0KACJt6hFGORZ8vp'});
    });
};

const udpateQueue = async (appQueue, search_typeQueue, progress) => {
    try {
        const response = await AppSearchQueue.updateOne(
            {appQueue, search_typeQueue},
            {
                $set: {
                    progress
                }
            }
        ).exec();

        return response.ok;
    } catch (error) {
        throw new Error(`Failed to update ${appQueue}`);
    }
};

const deleteQueue = async (appQueue, search_typeQueue) => {
    try {
        const response = await AppSearchQueue.deleteOne({appQueue, search_typeQueue});
        if (response){
            return response;
        }
    } catch (error) {
        throw new Error(`Failed to delete ${appQueue}`);
    }
};

const search = async (appsearch) => {
    try {

        const terms = appsearch;
        var type = 'android';
        
        for (let i = 0; i < terms.length; i++) {
            const term = terms[i];
            await udpateQueue(term, type, 1);
            console.log(`Android Searching for ${term}`);

            const freeApp = gplay.search({term: term, num: 250, price: 'free', throttle: 10});
            const paidApp = gplay.search({term: term, num: 250, price: 'paid', throttle: 10});

            let apps = await Promise.all([freeApp, paidApp]);
            apps = apps[0].concat(apps[1]);

            if (apps.length) {
                let appsData = [];
            
                for (let x = 0; x < apps.length; x++) {
                    // console.log(`android ${x}`);
                    const app = apps[x];

                    try {
                        const data = await gplay.app({appId: app.appId});
                        if(data){
                            appsData.push(data);
                        }
                    } catch (error) {
                        console.log('Error app:', app.appId);
                    }

                    await sleep(3000);
                }
    
                const formatedData = formatData(appsData);

                const fields = [
                    'appName',
                    'appId',
                    'appUrl',
                    'description',
                    'released',
                    'updated',
                    'installs',
                    'score',
                    'rating',
                    'type',
                    'contentRating',
                    'monetizeType',
                    'devName',
                    'devEmail',
                    'devWebsite',
                    'developerUrl'
                ];
                const json2csvParser = new Json2csvParser({fields});
                const csv = json2csvParser.parse(formatedData);

                const random = moment().format('YYYYMMDD');

                fs.writeFileSync(`./appscrapedata/android-${term.split(' ').join('+')}-${random}.csv`, csv);
                await deleteQueue(term, type);
                await upload(`android-${term.split(' ').join('+')}-${random}.csv`);
                console.log(`Done Android Searching for ${term}`);
            } else {
                console.log('No apps found for:', term);
            }
        }

    } catch (error) {
        console.log('Error:', error);
    }
}

module.exports = { search }
