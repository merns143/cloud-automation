const KeywordWatcher = require("../models/KeywordWatcher");
var config = require('../config');
var fs = require('fs');
const axios = require("axios");

const activeIdListing = async (keyword, property_types) => {
    try{
        var ids = [];
        var searchId = await axios.get(`https://api.flippa.com/v3/listings?query[keyword]=${keyword}&filter[property_type]=${property_types}&filter[status]=open`);
        for(var i = 0; i < searchId.data.data.length; i++ ){
            var id = searchId.data.data[i].id;
            ids.push(id);
        }
        return ids;
    }catch(error){
        console.log(error);
    }
};

module.exports = {

    getKeyword: async function(req, res){
        try{
            const getKeywords = await KeywordWatcher.find();
            res.status(200).json({getKeywords});
        }catch(error) {
            res.status(400).json({error});
        }
    },

    addKeyword: async function(req, res) {
        var keywords = req.body.keywords;
        var property_types = req.body.property_types.toString();
        try{
            if (keywords.length > 0 && property_types.length > 0) {
                let responds = [];
                for (var x=0;x<keywords.length;x++){
                    var keyword = keywords[x];
                    const searchKeyword = await KeywordWatcher.find({keyword});
                    const activeId_listing = await activeIdListing(keyword, property_types);
                    const search_count = activeId_listing.length;

                    if (searchKeyword <= 0 ){
                        const payload = {
                                keyword,
                                search_count,
                                activeId_listing,
                                property_types
                            }
                        await KeywordWatcher.create(payload);
                        let msg = `${keyword} Successfuly added_success`
                        responds.push(msg);
                    }else{
                        let msg = `${keyword} Keyword Exist_error`
                        responds.push(msg);
                    }
                }
                //send array of responds
                res.status(200).json({responds});
            } else {
                    errMsg = 'No Keyword or Property Type Added';
                    res.status(400).json({errMsg});
            }
        }catch(error) {
            res.status(400).json({error});
        }  
    },

    deleteKeyword: async function(req, res){
        var keyword = req.params.keyword;
        try {
            const response = await KeywordWatcher.deleteOne({keyword});
            if (response){
                let msg = `${keyword} Successfuly deleted`;      
                res.status(200).json({msg});
            }
        } catch (error) {
            res.status(400).json({msg: error.message});
        }
    }
}