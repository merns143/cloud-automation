var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HrLogsAlertsSchema = new Schema({
    user_id: { type: Number },
    created_date: { type: Date, default: Date.now }
}, { collection: 'hrlogsalerts' });

module.exports = mongoose.model("HrLogsAlerts", HrLogsAlertsSchema);