const astore = require('app-store-scraper');
const moment = require('moment');
const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');
var Client = require('ftp');
const AppSearchQueue = require("../models/AppSearchQueue");

const formatData = (rawData) => {
    return rawData.map(data => {
        return {
            appName: data.title,
            id: data.id,
            appId: data.appId,
            appUrl: data.url,
            description: data.description,
            released: moment(data.released).format('MM/DD/YYYY HH:mm:ss'),
            updated: moment(data.updated).format('MM/DD/YYYY HH:mm:ss'),
            appSize: data.size,
            score: data.score,
            rating: data.ratings,
            type: data.free ? 'free' : 'paid',
            contentRating: contentRating(data.contentRating),
            devName: data.developer,
            devWebsite: data.developerWebsite ? data.developerWebsite : '',
            developerUrl: data.developerUrl
        };
    });
};

const sleep = (millis) => {
    return new Promise(resolve => setTimeout(resolve, millis));
};

const contentRating = (rating) => {
    let res = '';

    if (rating === "4+") {
        res = 'Everyone';
    } else if (rating === "9+") {
        res = 'May contain content unsuitable for children under the age of 9';
    } else if (rating === "12+") {
        res = 'May contain content unsuitable for children under the age of 12';
    } else if (rating === "17+") {
        res = 'May contain content unsuitable for children under the age of 17';
    }

    return res;
};

const upload = (filename) => {
    return new Promise((resolve, reject)=>{
        var c = new Client();
            c.on('ready', function() {
                var csvFile = fs.createReadStream(`./appscrapedata/${filename}`);
                c.put(csvFile, `/AppSearch/IOS/${filename}`, function(err) {
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

        return response;
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

const search = async (iosappsearch) => {
    try {
        const terms = iosappsearch;
        var type = 'ios';

        for (let i = 0; i < terms.length; i++) {
                const term = terms[i];
                await udpateQueue(term, type, 1);
                console.log(`iOS Searching for ${term}`);
                let appsData = [];
                
                let iosapp = await astore.search({term: term, num:200});
                let iosappPage2 = await astore.search({term: term, num:200, page:2});
                let iosappPage3 = await astore.search({term: term, num:100, page:3});

                let apps = await Promise.all([iosapp, iosappPage2, iosappPage3]);
                apps = apps[0].concat(apps[1]).concat(apps[2]);

                if (apps.length) {
                    for (let x = 0; x < apps.length; x++) {
                        // console.log(`ios ${x}`);
                        const app = apps[x];

                        try {
                            const data = await astore.app({appId: app.appId, ratings: true});
                            if(data){
                                appsData.push(data);
                            }
                        } catch (error) {
                            console.log('Error app:', app.appId);
                        }
    
                        await sleep(3000);
                    }

                } else{
                    console.log('No apps found for:', term);
                }

            const formatedData = formatData(appsData);

            const fields = [
                'appName',
                'id',
                'appId',
                'appUrl',
                'description',
                'released',
                'updated',
                'score',
                'rating',
                'type',
                'contentRating',
                'devName',
                'devWebsite',
                'developerUrl'
            ];
            const json2csvParser = new Json2csvParser({fields});
            const csv = json2csvParser.parse(formatedData);

            const random = moment().format('YYYYMMDD');

            fs.writeFileSync(`./appscrapedata/ios-${term.split(' ').join('+')}-${random}.csv`, csv);
            await deleteQueue(term, type);
            await upload(`ios-${term.split(' ').join('+')}-${random}.csv`);
            console.log(`Done iOS Searching for ${term}`);
        }
    } catch (error) {
        console.log('Error:', error);
    }
}

module.exports = { search }