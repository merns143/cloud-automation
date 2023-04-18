const config = require("../config");
const axios = require("axios");

const restart_sbrow = async () => {
  try {
    const link = `${config.digitalOceanApi}/v2/droplets/${config.sbrowServerId}/actions`;
    const body = {
      "type": "reboot",
    };
    console.log(link);

    const headers = {
      "Authorization": `Bearer ${config.digitalOceanToken}`,
      "Content-Type": "application/json",
    };

    await axios.post(link, body, { headers });

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  restart_sbrow,
};
