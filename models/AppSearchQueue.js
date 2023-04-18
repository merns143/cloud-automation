var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//AppSearchQueue Database
var AppSearchQueueSchema = new Schema({
    appQueue: { type: String},
    search_typeQueue: { type: String},
    progress: { type: Number}
}, { collection: 'appSearchQueue' });

module.exports = mongoose.model("AppSearchQueue", AppSearchQueueSchema);