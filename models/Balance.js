var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BalanceSchema = new Schema({
    source: { type: String },
	code: { type: String },
	current: { type: Number },
    previous: { type: Number },
    last_updated: { type: String }
}, { collection: 'balances' });

// BalanceSchema.index({ code: 1 });
module.exports = mongoose.model("Balance", BalanceSchema);