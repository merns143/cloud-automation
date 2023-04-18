var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GeoSchema = new Schema({
    country: { type: String },
	country_code: { type: String },
	language_1: { type: String },
	language_1_code: { type: String },
	language_2: { type: String },
	language_2_code: { type: String },
	language_3: { type: String },
	language_3_code: { type: String },	
	primary_language: { type: String }
}, { collection: 'geo' });

// GeoSchema.index([{ country: 'text' }, { country_code: 'text' }]);
// GeoSchema.index({ country: 1 });
// GeoSchema.index({ country_code: 1 });

module.exports = mongoose.model("Geo", GeoSchema);