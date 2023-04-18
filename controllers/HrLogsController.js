const HrLogsUsers = require("../models/HrLogsUsers");
const HrLogs = require("../models/HrLogs");
const Json2csvParser = require('json2csv').Parser;
const helper = require("../helpers/hrlogsHelpers");
const fs = require('fs');
const moment = require("moment");

const getUserLogs = async (user, range) => {
    const x = {
        user_id: user.user_id,
        name: user.name,
        last_login: user.last_login,
        updated_date: user.updated_date
    };
    try {
        let logs = await HrLogs.find({
            user_id: user.user_id,
            logged_in: {
                $gte: range.start,
                $lt: range.end
            }
        });

        logs = logs.map(x => {
            return moment(x.logged_in).format('YYYY-MM-DD');
        });
        logs = [...new Set(logs)];
        return Object.assign({attempts: logs.length}, x);
    } catch (error) {
        return Object.assign({attempts: 'error'}, x);
    }
};

const getLogs = async (range) => {

    try {
        const rangeParams = helper.getTimeRange(range);
        let params = {};
        if (Object.keys(rangeParams).length > 0) {
            params.logged_in = {
                $gte: rangeParams.start,
                $lt: rangeParams.end
            };
        };

        const logs = await HrLogs.find(params);

        return logs;
    } catch (error) {
        return [];
    }
};

const deleteFile = function(file) {
    fs.unlink(`./${file}`, (err) => {
        if (err) throw err;
        console.log('path/file.txt was deleted');
    });
};

module.exports = {

    getUsers: async (req, res) => {
        let promises = [];
        let users = await HrLogsUsers.find();
        const range = helper.getTimeRange('LAST_7_DAYS');

        for (let i = 0; i < users.length; i++) {
            let user = users[i];            
            promises.push(getUserLogs(user, range));
        }

        const result = await Promise.all(promises);
        res.status(200).json({data: result});
    },

    addUser:  async (req, res) => {

        try {
            let errMsg = '';
            if (req.body.name && req.body.link && helper.checkValidLink(req.body.link)) {
                const link = req.body.link;
                const validJobSeeker = await helper.checkValidJobseeker(link);
                if (validJobSeeker) {
                    const user_id = helper.getId(link);
                    const users = await HrLogsUsers.find({user_id});

                    if (users.length <= 0) {
                        const last_login = await helper.getLastLogin(link);

                        const payload = {
                            user_id,
                            name: req.body.name,
                            link,
                            last_login
                        }
                        const user = await HrLogsUsers.create(payload);
                        return res.status(200).json({user});
                    } else {
                        errMsg = 'User exist.';
                    }    
                } else {
                    errMsg = 'Jobseeker not found';
                }
            } else {
                errMsg = 'Invalid request.';
            }

            res.status(400).json({msg: errMsg});
        } catch (error) {
            console.log(error.message);
            res.status(500).json({msg: error.message});
        }
    },

    deleteUser: async (req, res) => {
        try {
            const response = await HrLogsUsers.deleteOne({ user_id: req.params.id });            
            res.status(200).json({success: true, count: response.n});
        } catch (error) {
            console.log(error.message);
            res.status(500).json({msg: error.message});
        }
    },

    getLogs: async (req, res) => {
        try {
            const range = req.query.range || 'LAST_7_DAYS';
            const logs = await getLogs(range);
            const fields = [
                'user_id',
                'name',
                'logged_in',
                'created_date'
            ];
            const json2csvParser = new Json2csvParser({fields});
            const csv = json2csvParser.parse(logs);
            fs.writeFileSync('./logs.csv', csv);
            res.download('logs.csv');
        } catch (error) {
            console.log(error.message);
            res.status(500).json({msg: error.message});
        }
    }
}