//-----------------------
// Required Packages ----
//-----------------------
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon')
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var axios = require("axios").default;

//-----------------------
// Getting Dependencies--
//-----------------------


var config = require('./config');
var authMiddleware = require('./middlewares/auth');
var authRoutes = require('./routes/auth');
var zoneRoutes = require('./routes/ZoneRoutes');
var safebrowsingRoutes = require('./routes/SafebrowsingRoutes');
var trackingDomainsRoutes = require('./routes/TrackingDomainsRoutes');
var trafficsource = require('./routes/TrafficSourceRoute');
var geoRoutes = require('./routes/GeoRoutes');
var doRoutes = require('./routes/DigitalOceanRoutes');
var hrLogsRoutes = require('./routes/HrLogsRoutes');
var speechtotextRoutes = require('./routes/SpeechToTextRoutes');
var appsearchRoutes = require('./routes/AppSearchRoutes');
var keywordwatcherRoutes = require('./routes/KeywordWatcherRoutes');
var adddomaincheckerRoutes = require('./routes/AddDomainCheckerRoutes');
var branchanalyticsRoutes = require('./routes/BranchAnalyticsRoutes');

//-----------------------
// Add scheduled jobs--
//-----------------------
require('./jobs');

//-------------------------------
// Connect To The Database ------
//-------------------------------
// mongodb+srv://heroku_c34cmh7n:prp8n47pm3b1t0b11t8cro9v6k@cluster-c34cmh7n.um1a5.mongodb.net/heroku_c34cmh7n?retryWrites=true&w=majority
// let prod_db_url = "mongodb://admin:BJ3Z1CoXwISt@ds247410.mlab.com:47410/heroku_c34cmh7n";
// let prod_db_url = "mongodb://admin:BJ3Z1CoXwISt@cluster-c34cmh7n-shard-00-00.um1a5.mongodb.net:27017,cluster-c34cmh7n-shard-00-01.um1a5.mongodb.net:27017,cluster-c34cmh7n-shard-00-02.um1a5.mongodb.net:27017/heroku_c34cmh7n?ssl=true&replicaSet=atlas-wijj8l-shard-0&authSource=admin&retryWrites=true&w=majority";
let prod_db_url = process.env.DB_URI;
mongoose.connect(prod_db_url, { useNewUrlParser: true }, function (err, res) {
    if (err) {
        console.log("ERROR IN CONNECTING TO DATABASE")
        throw err;
    }
    console.log("DATABASE CONNECTD");
});

//-----------------------
// Setting The App ------
//-----------------------
var app = express();
app.set('superSecret', config.secret); // secret variable
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.all('/app/*', function (req, res, next) {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

// From MS Teams Connectors URL
let msTeamsHookURL = process.env.MS_TEAMS_WEBHOOK;

app.get('/ms-teams-hooks/:message', (req, res) => {

    var msg = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "0076D7",
        "summary": "Summary",
        "sections": [{
            "activityTitle": req.params.message,
            "markdown": true
        }]
    }

    axios.post(msTeamsHookURL, msg)
    .then(() => {
        res.send("Success.");
    })
    .catch(function(err){
        res.send("Error: " + err);
    });
})

app.get('/restart-autorules', async(req, res) => {
    try {
        const link = `https://api.digitalocean.com/v2/droplets/339628324/actions`;
        const body = {
          "type": "reboot",
        };
        const headers = {
          "Authorization": `Bearer ${process.env.DIGITAL_OCEAN_TOKEN}`,
          "Content-Type": "application/json",
        };
    
        await axios.post(link, body, { headers });
    
        return true;
      } catch (error) {
        throw new Error(error.message);
      }
})

// auth router
authRoutes(app);

// authentication middleware
authMiddleware(app);

// zone router
zoneRoutes(app);

// safebrowsing router
safebrowsingRoutes(app);

// tracking domains router
trackingDomainsRoutes(app);

// geo routes
geoRoutes(app);

// do routes
doRoutes(app);

// traffic source routes
trafficsource(app);

// hrlogs routes
hrLogsRoutes(app);

// speechtotext routes
speechtotextRoutes(app);

// appsearch routes
appsearchRoutes(app);

// keywordwatcher routes
keywordwatcherRoutes(app);

// adddomainchecker routes
adddomaincheckerRoutes(app);

// branchanalytics routes
branchanalyticsRoutes(app);

//-----------------------
// error handlers -------
//-----------------------
app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

module.exports = app;
