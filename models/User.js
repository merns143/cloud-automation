var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String },
	password: { type: String },
	role: { type: String }
}, { collection: 'users' });

module.exports = mongoose.model("User", UserSchema);