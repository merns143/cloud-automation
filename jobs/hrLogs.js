const axios = require("axios");
const moment = require("moment");
const HrLogsUsers = require("../models/HrLogsUsers");
const HrLogsAlerts = require("../models/HrLogsAlerts");
const HrLogs = require("../models/HrLogs");
const hrlogsHelper = require("../helpers/hrlogsHelpers");

const alertSlack = async (message) => {
	try {
		await axios.get(`https://hooks.zapier.com/hooks/catch/2286988/0thru2/?message=${message}`);	
	} catch (error) {
		console.log('Failed to send alert to slack');
	}
};

const getUsers = async () => {
    try {
        const users = await HrLogsUsers.find();
        return users;
    } catch (error) {
        return [];
    }
};

const insertLog = async (user, last_login) => {
    try {
        const payload = {
            user_id: user.user_id,
            name: user.name,
            logged_in: last_login
        };
        await HrLogs.create(payload);
    } catch (error) {
        throw new Error('Failed to insert logs.');
    }
};

const updateUser = async (user_id, last_login) => {
    try {
        const response = await HrLogsUsers.updateOne(
            { user_id },
            {
                $set: {
                    last_login,
                    updated_date: moment().utc()
                }
            }
        ).exec();

        return response.ok;
    } catch (error) {
        throw new Error('Failed to update user.');
    }
};

const checkUserLogs = async (user, range) => {
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

        return logs;

    } catch (error) {
        console.log(error.message);
        throw new Error('Failed to get logs.');
    }
};

const getAlert = async (user_id) => {
    try {
        const result = await HrLogsAlerts.findOne({ user_id });
        return result;
    } catch (error) {
        throw new Error('Traffic source not found.');
    }
};

//-----------------------
// Update Hrlogs--
//-----------------------

const hrLogsUpdate = async () => {

    try {
        const users = await getUsers();
        const sendAlertUsers = [];

        if (users.length > 0) {
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                const range = hrlogsHelper.getTimeRange('LAST_7_DAYS');
                const last_login = await hrlogsHelper.getLastLogin(user.link);

                await Promise.all([
                    insertLog(user, last_login),
                    updateUser(user.user_id, last_login)
                ]);

                const result = await Promise.all([
                    checkUserLogs(user, range),
                    getAlert(user.user_id)
                ]);

                const logs = result[0];
                const alert = result[1];
                
                if (logs.length >= 3) {

                    // Create alert record and send alert
                    if (!alert) {
                        await HrLogsAlerts.create({ user_id: user.user_id});
                        sendAlertUsers.push(user);
                    }
                } else {

                    // Delete alert record if exist
                    if (alert) {
                        await HrLogsAlerts.deleteOne({ user_id: user.user_id });
                    }
                }
                
            }

            console.log(`Logged success: ${users.length} users`);

            if (sendAlertUsers.length > 0) {
                let alertMessage = `@here Active Users: `;

                for (let i = 0; i < sendAlertUsers.length; i++) {
                    const user = sendAlertUsers[i];
                    alertMessage += ((i === 0) ? '' : ', ' ) + user.name;
                }

                await alertSlack(alertMessage);
            }
        }
    } catch (error) {
        await alertSlack(`@here Something went wrong. Error: ${error.message}`);  
    }
	
};

module.exports = hrLogsUpdate
