const config = require('../config');
const axios = require("axios");

const getPropellerAds = async () => {
    try {
        const response = await axios.get(
            `${config.ts_pr_url}/api/user_status?key=${config.ts_pr_key}`,
            {
                headers: {
                    'Accept': '*/*'
                }
            }
        );
        return response.data.user.balance;
    } catch(error) {
        throw new Error(error.message);
    }
};

const loginClickadu = async () => {
    try {
        const response =  await axios.post(
            `${config.ts_cla_url}/login_check`,
            {
                "username": config.ts_cla_username,
                "password": config.ts_cla_password,
                "gRecaptchaResponse": null,
                "type": "ROLE_ADVERTISER",
                "fingerprint": ""
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );;

        return response.data.result.accessToken;
    
    } catch (error) {
        throw new Error(error.message);
    }
};

const getClickadu = async () => {
    try {
        const token = await loginClickadu();
        const response = await axios.get(
            `${config.ts_cla_url}/advertiser/dashboard/`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data.result.balance;
    } catch(error) {
        throw new Error(error.message);
    }
};

const getAdsterraAdt = async () => {
    try {
        const response = await axios.get(
            `${config.ts_adsterra_url}/advertiser/${config.ts_adt_key}/balance.json`,
        );
        return response.data.item;
    } catch(error) {
        throw new Error(error.message);
    }
};

const getAdsterraAtc = async () => {
    try {
        const response = await axios.get(
            `${config.ts_adsterra_url}/advertiser/${config.ts_atc_key}/balance.json`,
        );
        return response.data.item;
    } catch(error) {
        throw new Error(error.message);
    }
};

const getPopAds = async () => {
    try {
        const response = await axios.get(
            `${config.ts_pa_url}/api/user_status?key=${config.ts_pa_key}`,
        );
        return response.data.user.balance;
    } catch(error) {
        throw new Error(error.message);
    }
};

const getPopCash = async () => {
    try {
        const response = await axios.get(
            `${config.ts_pc_url}/me?apikey=${config.ts_pc_key}`,
        );
        return response.data.currentBalance;
    } catch(error) {
        throw new Error(error.message);
    }
};

const loginExoclick = async () => {
    try {
        const response =  await axios.post(
            `${config.ts_ec_url}/v2/login`,
            {
                "username": config.ts_ec_username,
                "password": config.ts_ec_password,
                "api_token": config.ts_ec_key
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );;

        return response.data.token;
    
    } catch (error) {
        throw new Error(error.message);
    }
};

const getExoclick = async () => {
    try {
        const token = await loginExoclick();
        const response = await axios.get(
            `${config.ts_ec_url}/v2/user`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data.result.balance;
    } catch(error) {
        throw new Error(error.message);
    }
};

const loginTonic = async () => {
    try {
        const response =  await axios.post(
            `${config.ts_to_url}/auth/login`,
            {
                "username": config.ts_to_username,
                "password": config.ts_to_password,
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );;

        return response.data.apiKey;
    
    } catch (error) {
        throw new Error(error.message);
    }
};

const getTonic = async () => {
    try {
        const token = await loginTonic();
        const response = await axios.get(
            `${config.ts_to_url}/metadata`,
            {
                headers: {
                    'apiKey': token
                }
            }
        );
        return response.data.balance;
    } catch(error) {
        throw new Error(error.message);
    }
};

const getZeropark = async () => {
    try {
        const response = await axios.get(
            `${config.ts_zp_url}/api/user/details`,
            {
                headers: {
                    'api-token': config.ts_zp_token
                }
            }
        );

        return response.data.userInfo.accountBalance;
    } catch(error) {
        throw new Error(error.message);
    }
};

module.exports = { 
    getPropellerAds,
    getClickadu,
    getAdsterraAdt,
    getAdsterraAtc,
    getPopAds,
    getPopCash,
    getExoclick,
    getTonic,
    getZeropark
};