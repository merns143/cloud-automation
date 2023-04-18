const config = require('../config');
const Balance = require('../models/Balance');
const helper = require('../helpers/balanceHelper');
const moment = require('moment');

const trafficSource = [
    {
        code: 'PR',
        api: helper.getPropellerAds
    },
    {
        code: 'CLA',
        api: helper.getClickadu
    },
    {
        code: 'ADT',
        api: helper.getAdsterraAdt
    },
    {
        code: 'ATC',
        api: helper.getAdsterraAtc
    },
    {
        code: 'PA',
        api: helper.getPopAds
    },
    {
        code: 'PC',
        api: helper.getPopCash
    },
    {
        code: 'EC',
        api: helper.getExoclick
    },
    {
        code: 'TO',
        api: helper.getTonic
    },
    {
        code: 'ZP',
        api: helper.getZeropark
    }
];

const updateBalance = async (code, api) => {
    try {

        let source = await getTrafficSource(code);
        let data = await api();

        // const previous = parseFloat(data) === source.current ? source.previous : source.current;
        const previous = source.current;
        const result = await updateTrafficSource(code, parseFloat(data), previous );
        
        return { success: true, source: code, msg: `Traffic source ${source.source} - ${code} updated successfully.` };
    } catch (error) {
        return { success: false, source: code, msg: error.message };
    }
};

const getTrafficSource = async (code) => {
    try {
        const query = await Balance.findOne({ code: code }).exec();
        return query;
    } catch (error) {
        throw new Error('Traffic source not found.');
    }
};

const updateTrafficSource = async (code, current, previous) => {
    try {
        const query = await Balance.updateOne(
            { code: code },
            {
                $set: {
                    current,
                    previous,
                    last_updated: moment().utc().format('MM-DD-YYYY HH:mm:ss')
                }
            }
        ).exec();
        return query;
    } catch (error) {
        throw new Error('Failed to update traffic source.');
    }
};

module.exports = async () => {

    try {
        let promises = [];

        for (let i = 0; i < trafficSource.length; i++) {
            const source = trafficSource[i];
            promises.push(updateBalance(source.code, source.api));
        }
        // for future logging
        const result = await Promise.all(promises);    

        console.log(result);
    } catch (error) {
        console.log(error);

        // possible to put alerts on this
    }
    
};