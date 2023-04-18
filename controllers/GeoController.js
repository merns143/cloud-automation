var Geo = require("../models/Geo");

var isNotEmpty = function(str) {
    return (str.length && str.length > 0);
};

module.exports = {

    all:  function(req, res) {
        Geo.find((error, data) => {
            if (error) res.status(500).json(error);
            res.status(200).json({data: data});
        });        
    },

    query: function(req, res) {
        var country = req.query.country || '';
        var code = req.query.country_code || '';
        if  (
                (country && isNotEmpty(country)) ||
                (code && isNotEmpty(code))
            ) {

            var countries = isNotEmpty(country) ? country.split(',') : [];
            var codes = isNotEmpty(code) ? code.split(',') : [];
            var conditions = [];

            for (var i = 0; i < countries.length; i++) {
                conditions.push(
                    { country: { $regex: countries[i], $options: 'i' } }
                );
            }

            for (var i = 0; i < codes.length; i++) {
                conditions.push(
                    { country_code: { $regex: codes[i], $options: 'i' } }
                );
            }

            Geo.find({
                $or: conditions
            }, (error, data) => {
                if (error) res.status(500).json(error);
                res.status(200).json({data: data});
            });
        } else {
            res.status(400).json({msg: 'Should provide country or country codes.'});
        }
    }
}