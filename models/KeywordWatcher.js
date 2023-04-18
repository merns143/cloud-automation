var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//KeywordWatcher Database
var KeywordWatcherSchema = new Schema({
    keyword: { type: String},
    search_count: { type: String},
    activeId_listing: { type: String},
    property_types: { type: String},
    updated_date: { type: Date, default: Date.now },
	created_date: { type: Date, default: Date.now }
}, { collection: 'keywordWatcher' });

module.exports = mongoose.model("KeywordWatcher", KeywordWatcherSchema);