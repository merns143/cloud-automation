const axios = require("axios");
const moment = require("moment");

const getProfile = (link) => {
    return axios.get(link);
};

const cleanBody = (body) => {
    return body.replace(/\s+/g, "");
}

const checkValidLink = (link) => {
    return link.indexOf('https://www.onlinejobs.ph/jobseekers/info/') !== -1;
};

const checkValidJobseeker = async (link) => {
    try {
        const res = await getProfile(link);
        const body = cleanBody(res.data);
        const matched = /Jobseekernotfound!/g.exec(body);
        return !matched;
    } catch (error) {
        return false;
    }
};

const getLastLogin = async (link) => {
    try {
        const res = await getProfile(link);
        const body = cleanBody(res.data);
        const matched = /<thscope="row">LastActive<\/th><td><strong>(.*?)<\/strong><\/td>/g.exec(body);
        return matched[1];    
    } catch (error) {
        return null;
    }
};

const getId = (link) => {
    const arr = link.split('/');
    const id = arr.pop();
    return id;
};

const getTimeRange = (range) => {
    let param = {};

    if (range === 'LAST_7_DAYS') {
        param.start = moment().subtract(7, 'days').format('YYYY-MM-DDT00:00:00');
        param.end = moment().add(1, 'day').format('YYYY-MM-DDT00:00:00');
    }

    return param;
};

module.exports = {
    checkValidJobseeker,
    getLastLogin,
    checkValidLink,
    getId,
    getTimeRange
}