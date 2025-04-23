const axios = require("axios");
const serverHelper = require('../helpers/serverHelper');
const https = require('https');

const message = 'Safebrowsing server is down. Server restarted.';

// At request level
const agent = new https.Agent({
    rejectUnauthorized: false
});

const alertSlack = async (message) => {
	try {
		// await axios.get(`https://hooks.zapier.com/hooks/catch/2286988/acgq55/?message=${message}`);	
		await axios.get(`https://cloud-automation.herokuapp.com/ms-teams-hooks/${message}`);	
		console.log('Alert sent:', message);
	} catch (error) {
		console.log('Failed to send alert to slack');
	}
};

const notifyDowntime = async () => {
	try {
		await serverHelper.restart_sbrow();
		await alertSlack(message);		
	} catch (error) {
		// await alertSlack('@here Safebrowsing server is down. Unable to restart the server.');
		console.log('Error')
	}
};

//-----------------------
// Sbrow health check--
//-----------------------

const sbrowHealthCheck = async () => {
	await axios.get('https://sbrow.glowlytics.com/api/health-check', { httpsAgent: agent })
		.then(async (res) => {

			if (res && res.data && res.data.success) {
				// safebrowsing is okay and up
			} else {
				await notifyDowntime();
			}
		})
		.catch( async (err) => {
			await notifyDowntime();
		});	
};


module.exports = sbrowHealthCheck;
