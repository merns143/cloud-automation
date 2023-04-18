const axios = require("axios");
const serverHelper = require("../helpers/serverHelper");

module.exports = {
  restart_sbrow: async (req, res) => {
    try {
      await serverHelper.restart_sbrow();

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
