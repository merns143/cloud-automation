var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HrLogsSchema = new Schema({
    user_id: { type: Number },
    name: { type: String},
    logged_in: { type: Date },
	created_date: { type: Date, default: Date.now }
}, { collection: 'hrlogs' });

module.exports = mongoose.model("HrLogs", HrLogsSchema);