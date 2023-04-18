const node_schedule = require("node-schedule");
const trafficSourceBalance = require("./trafficSourceBalance");
const sbrowHealthCheck = require("./sbrowHealthCheck");
const hrLogsUpdate = require("./hrLogs");
const keywordWatcher = require("./keywordWatcher");

(async () => {
    // node_schedule.scheduleJob("*/1 * * * *", trafficSourceBalance);

    // traffic source balance : run job everyday at midnight
    node_schedule.scheduleJob("0 0 * * *", trafficSourceBalance);

    // sbrow server health check : run job every hour
    node_schedule.scheduleJob("* */1 * * *", sbrowHealthCheck);

    // update hrlogs : run job everyday at midnight
    node_schedule.scheduleJob("0 0 * * *", hrLogsUpdate);

    // keyword watcher : run job everyday at midnight
    node_schedule.scheduleJob("0 0 * * *", keywordWatcher);

    // update hrlogs : run job everyday 10 second
    node_schedule.scheduleJob("*/10 * * * *", () => {
        console.log('Scheduler health-check');
    });

})();