var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HrLogsUsersSchema = new Schema({
    user_id: { type: Number },
    name: { type: String},
    link: { type: String },
    last_login: { type: Date },
    updated_date: { type: Date, default: Date.now },
	created_date: { type: Date, default: Date.now }
}, { collection: 'hrlogsusers' });

module.exports = mongoose.model("HrLogsUsers", HrLogsUsersSchema);