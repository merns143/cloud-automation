const config = require("../config");
const axios = require("axios");
const https = require('https');

// At request level
const agent = new https.Agent({
  rejectUnauthorized: false
});

const restart_sbrow = async () => {
  try {
    const link = `${config.digitalOceanApi}/v2/droplets/${config.sbrowServerId}/actions`;
    const body = {
      "type": "reboot",
    };

    const headers = {
      "Authorization": `Bearer ${process.env.DIGITAL_OCEAN_TOKEN}`,
      "Content-Type": "application/json",
    };

    await axios.post(link, body, { httpsAgent: agent, headers });

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  restart_sbrow,
};
