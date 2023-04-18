var config = require('../config');
var fs = require('fs');
var appsearchHelper = require('../helpers/appsearchHelper');
var iosAppsearchHelper = require('../helpers/iossearchHelper');
var Queue = require('better-queue');
const axios = require("axios");
var Client = require('ftp');
const gplay = require('google-play-scraper');
const astore = require('app-store-scraper');
const Mercury = require('@postlight/mercury-parser');
const Json2csvParser = require('json2csv').Parser;
const AppSearchQueue = require("../models/AppSearchQueue");
const cheerio = require('cheerio'); 
const puppeteer = require('puppeteer');     


const formatData = (rawData) => {
    return rawData.map(data => {
        return {
            appName: data.title,
            downloaded: data.downloaded.replace(/\s+/g, ""),
            revenue: data.monthly_revenue.replace(/\s+/g, ""),
            devName: data.developer,
            devLink: data.urlPublisher,
            appUrl: data.url
        };
    });
};

var q = new Queue(async (input, cb) => {
    try{
        await appsearchHelper.search(input);
        cb();
    
    } catch (error) {
        console.log('FILE ERROR:', input);
        console.log(error);
    }
});

var iosq = new Queue(async (input, cb) => {
    try{
        await iosAppsearchHelper.search(input);
        cb();
    
    } catch (error) {
        console.log('FILE ERROR:', input);
        console.log(error);
    }
});

const webScrape = async (searchData, search_type) => {
    if(search_type == 'android'){
        var search_appId = searchData.appId;
        var search_publisher = searchData.developer.replace(/\s+/g, "+");
    }else{
        var search_appId = searchData.id;
        var search_publisher = searchData.developerId;
    }

    var search_dev = searchData.developer.toLowerCase().replace(/[^a-zA-Z0-9]/g,'-').replace(/-{2,}/g,'-');
    var search_title = searchData.title.toLowerCase().replace(/[^a-zA-Z0-9]/g,'-').replace(/-{2,}/g,'-');
    
    try{
        const url=`https://sensortower.com/${search_type}/US/${search_dev}/app/${search_title}/${search_appId}/overview`;
        const urlPublisher = `https://sensortower.com/${search_type}/publisher/${search_dev}/${search_publisher}`;
        const webData = await Mercury.parse(url);

        if (webData){
            var raw = webData.excerpt;
            
            var split = raw.split('earned');
            var split2 = split[1].split('.');
            var split3 = split2[0].split('in');
            var monthly_revenue = await changeParsing(split3[0]);

            var split4 = split2[0].split('downloaded');
            var split5 = split4[1].split('times in');
            var downloaded = await changeParsing(split5[0]);

            return ({search_type, monthly_revenue, downloaded, title: searchData.title, developer:searchData.developer, icon:searchData.icon, url:searchData.url, urlPublisher});
            
        }
    }catch(error){
        return '';
    }
};

const scrapePublisher = async (devUrl) => {
    try {
        // open the headless browser
        var browser = await puppeteer.launch({ 
            headless: true,
            'args' : [
                          '--no-sandbox',
                          '--disable-setuid-sandbox'
                        ]
        });
        // open a new page
        var page = await browser.newPage();
        // enter url in page
        await page.goto(devUrl);
    
        var publisherDatas = await page.evaluate(() => {
          var scrapeVal = document.querySelectorAll('h3'); 
          var datas = [];
          for (var i = 0; i < 3; i++) {
            let data = scrapeVal[i].innerText.trim();
            var lastVar = data.slice(-1);
            var dot = data.split('.');

            if (dot.length > 1){
                if (lastVar == 'k'){
                    data = data.replace('.', ',').replace('k', '00');
                }
                if (lastVar == 'm'){
                    data = data.replace('.', ',').replace('m', '00,000');
                }
            }else{
                if (lastVar == 'k'){
                    data = data.replace('k', ',000');
                }
                if (lastVar == 'm'){
                    data = data.replace('m', ',000,000');
                }
            }

            datas.push(data);
          }
          return datas;
        });
        await browser.close();
        // console.log("Browser Closed");

        return (publisherDatas);
      } catch (err) {
        // Catch and display errors
        console.log(error(err));
        await browser.close();
        console.log(error("Browser Closed"));
      }
};

const changeParsing = async (variable) => {

    var scrapeData = variable.trim();
    var lastVar = scrapeData.slice(-1);
    var dot = scrapeData.split('.');

    if (dot.length > 1){
        if (lastVar == 'k'){
        scrapeData = scrapeData.replace('.', ',').replace('k', '00');
        }
        if (lastVar == 'm'){
        scrapeData = scrapeData.replace('.', ',').replace('m', '00,000');
        }
    }else{
        if (lastVar == 'k'){
        scrapeData = scrapeData.replace('k', ',000');
        }
        if (lastVar == 'm'){
        scrapeData = scrapeData.replace('m', ',000,000');
        }
    }

    return (scrapeData);
};

const checkQueue = async (apps, type) => {
    var final_apps = [];
    var responds = [];
    var search_typeQueue = type;

    for (var x=0;x<apps.length;x++){
        try{
            var appQueue = apps[x];
            const checkAppQueue = await AppSearchQueue.find({appQueue, search_typeQueue});
    
            if (checkAppQueue <= 0){
                const Queue = {
                        appQueue,
                        search_typeQueue,
                        progress: 0
                    }
                await AppSearchQueue.create(Queue);
                let msg = `${appQueue} for ${search_typeQueue} searching was Successfuly added_success`
                responds.push(msg);
                final_apps.push(appQueue);
            }else{
                let msg = `${appQueue} for ${search_typeQueue} searching is on Queue_error`
                responds.push(msg);
            }
        }catch(error){
            console.log(error);
        }
    }

    return ({final_apps, responds});
}

const sleep = (millis) => {
    return new Promise(resolve => setTimeout(resolve, millis));
};


module.exports = {

    getAppSearch: function(path, res){
        var c = new Client();
                c.on('ready', function() {
                    c.list(path.query.path, function(err, list) {
                        if (err) throw err;
                        res.status(200).json({list});
                        c.end();
                });
            });

            // connect to localhost:21
            c.connect({host: '198.143.141.58', user: 'files@arctuslabs.com', password: '0KACJt6hFGORZ8vp'});
    },

    addAppSearch: async function(req, res) {
        try {
                var apps = req.body.apps;
                var type = req.body.type;

                var appQueue = await checkQueue(apps, type);

                if(appQueue){
                    var responds = appQueue.responds;
                    var final_apps = appQueue.final_apps;

                    if(type == "android"){
                        q.push(final_apps, async () => {
                            try {
                                var message = `Done Android App Scraping for ${final_apps}.`;
                                axios.get(`https://hooks.zapier.com/hooks/catch/2286988/vk00kj/?message=${message}`);
                            } catch (error) {
                                console.log('Alert error');
                            }
                        });
                    }

                    if(type == "ios"){
                        iosq.push(final_apps, async () => {
                            try {
                                var message = `Done iOS App Scraping for ${final_apps}.`;
                                axios.get(`https://hooks.zapier.com/hooks/catch/2286988/vk00kj/?message=${message}`);
                            } catch (error) {
                                console.log('Alert error');
                            }
                        });
                    }
                }
                   
                res.status(200).json({responds});
        } catch (error) {
            res.status(500).json(error);
        }   
    },

    appSearchQueue: async function(req, res){
        try{
            const getQueues = await AppSearchQueue.find();
            res.status(200).json({getQueues});
        }catch(error) {
            res.status(400).json({error});
        }
    },

    advanceSearch: async function(req, res){
        
        var search_type = req.body.search_type;
        var appIds = req.body.appIds;
        let search = '';
        let msg = '';
        var msgs = [];
        var scrapes = [];

        for(var i=0; i<appIds.length; i++){
            try{
                var appId = appIds[i].trim();
                if (search_type == 'android'){
                    search = await gplay.app({appId:appId});
                }else{
                    search = await astore.app({id:appId});
                }

                if(search){
                    var scrape = await webScrape(search, search_type);
                    if(scrape){
                        scrapes.push(scrape);
                    }else{
                        msg = `No estimated revenue and dowloaded for ${appId}`;
                        msgs.push(msg);
                    }
                }

                await sleep(2500);
            }catch(error){
                msg = `No App found for ${appId}`;
                msgs.push(msg);
            }
        }

        res.status(200).json({msgs, scrapes});
    },

    devUrlSearch: async function (req, res){
        var devDatas = [];
        let msg = '';
        var msgs = [];
        var devUrls = req.body.devUrls;
        for(var i=0; i < devUrls.length; i++){
            var devUrl = devUrls[i].split('/');
            if (devUrl.length == 7){
                    var searchType = devUrl[3];
                    var devName = devUrl[5].replace(/-/g, ' ').toUpperCase();
                    var devDetails = await scrapePublisher(devUrls[i]);
    
                    if(devDetails.length > 0){
                        devDatas.push({devName, searchType, devDetails});
                        msg = `Searched Dev Url #${i+1}!_s`;
                        msgs.push(msg);
                    }else{
                        msg = `No Details for Dev Url #${i+1}!_e`;
                        msgs.push(msg);
                    }
            }else{
                msg = `Error Dev Url #${i+1} Format!_e`;
                msgs.push(msg);
            }
        }

        res.status(200).json({devDatas, msgs});
    },

    downloadCsvFile: function(req, res){
        var filename = req.query.filename;
        var name = filename.split(' ').join('+');
        var checkSearchType = filename.split('-');
        var searchType = checkSearchType[0];
        let path = '';

        if (searchType === 'android'){
            path = '/AppSearch/Android';
        }else{
            path = '/AppSearch/IOS';
        }
        var c = new Client();
            c.on('ready', function() {
                c.get(`${path}/${name}`, function(err, stream) {
                    if (err) {console.log(err);
                    }else{
                        stream.once('close', function() {
                            res.download(`./download/${name}`, name,function(err){
                                if (err) {console.log('---------- error downloading file: ' + err);
                                }else{
                                    fs.unlinkSync(`./download/${name}`);
                                    c.end();
                                };
                            });
                        });
                        stream.pipe(fs.createWriteStream(`./download/${name}`));
                    }
                });
            });

            // connect to localhost:21 as anonymous
            c.connect({host: '198.143.141.58', user: 'files@arctuslabs.com', password: '0KACJt6hFGORZ8vp'});
    },

    exportCsv: function(req, res){
        var appdatas = req.body.appdatas;
        var search_type = appdatas[0].search_type;

        const formatedData = formatData(appdatas);

        const fields = [
            'appName',
            'downloaded',
            'revenue',
            'devName',
            'devLink',
            'appUrl'
        ];
        const json2csvParser = new Json2csvParser({fields});
        const csv = json2csvParser.parse(formatedData);

        // const random = Date.now();
        var advancecsv_name = `advanceSearch_${search_type}.csv`;

        fs.writeFileSync(`./appscrapedata/${advancecsv_name}`, csv);
        res.status(200).json({advancecsv_name});

    },

    advanceDownload: function(req,res){
        var filename = req.query.filename;

        res.download(`./appscrapedata/${filename}`, `${filename}`,function(err){
            if (err) {console.log('---------- error downloading file: ' + err);
            }else{
                fs.unlinkSync(`./appscrapedata/${filename}`);
            };
        });

    }

}