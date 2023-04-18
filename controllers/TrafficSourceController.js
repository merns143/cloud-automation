var Balance = require("../models/Balance");
const trafficSourceBalance = require("../jobs/trafficSourceBalance");

module.exports = {

    getBalances: (req, res) => {
        try {
            Balance.find((error, data) => {
                if (error) res.status(500).json(error);
                res.status(200).json({data: data});
            });    
        } catch (error) {
            res.status(500).json(error);
        }        
    },

    updateBalance: async (req, res) => {
        try {
            await trafficSourceBalance();
            res.status(200).json({success: true, message: 'Balance update success'});
        } catch (error) {
            res.status(500).json(error);
        }
    }
}