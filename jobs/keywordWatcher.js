const KeywordWatcher = require("../models/KeywordWatcher");
const axios = require('axios');
const moment = require('moment');

const alertSlack = async (message) => {
	try {
        await axios.get(`https://hooks.zapier.com/hooks/catch/2286988/vk00kj/?message=${message}`);
	} catch (error) {
		console.log('Failed to send alert to slack');
	}
};

const updateKeyword = async (keyword, activeId_listing) => {
    try {
        var search_count = activeId_listing.length;
        const response = await KeywordWatcher.updateOne(
            { keyword },
            {
                $set: {
                    search_count,
                    activeId_listing,
                    updated_date: moment().utc()
                }
            }
        ).exec();

        return response.ok;
    } catch (error) {
        throw new Error('Failed to update keyword.');
    }
};

const search = async (keyword_data) => {
    try{
        let keyword = keyword_data.keyword;
        let property_types = keyword_data.property_types;
        let dbActiveId = JSON.parse("[" + keyword_data.activeId_listing + "]");

        var new_search = await axios.get(`https://api.flippa.com/v3/listings?query[keyword]=${keyword}&filter[property_type]=${property_types}&filter[status]=open`);
        var count = new_search.data.meta.total_results;
        var ids = [];

        if (count > 0){
            for(var i=0; i < count; i++){
                let id = new_search.data.data[i].id;
                let current_price = new_search.data.data[i].current_price;
                let buy_it_now_price = new_search.data.data[i].buy_it_now_price;
                let reserve = new_search.data.data[i].reserve_met;
                let match = 0;
                var msg_reserve = '';

                if(reserve == true){
                    msg_reserve = 'WITH RESERVE';
                }else{
                    msg_reserve = 'NO RESERVE';
                }

                if(dbActiveId.length > 0){
                    for(var x=0; x < dbActiveId.length; x++){
                        let db_id = dbActiveId[x];
                        if(db_id == id){
                            match = 1;
                        }
                    }
                    if(match == 0){
                        let msg = `New listing added to "${keyword}" keyword, current price: $${current_price}, buy it now price: $${buy_it_now_price} ${msg_reserve} link: https://flippa.com/${id}`;
                        alertSlack(msg);
                    }
                }else{
                    let msg = `New listing added to "${keyword}" keyword, current price: $${current_price}, buy it now price: $${buy_it_now_price} ${msg_reserve} link: https://flippa.com/${id}`;
                    alertSlack(msg);
                }
                ids.push(id);
            }
        }

        const update = await updateKeyword(keyword, ids);
        return update;

    }catch(error) {
        console.log(error);
    }
};

const keywordWatcher  = async () => {
    try{
        console.log('Keyword Watcher Running....');
        const keywords = await KeywordWatcher.find();
        
        if(keywords){
            for (i=0; i<keywords.length; i++){
                let keyword_data = keywords[i];
                try{
                    await search(keyword_data);
                }catch(error) {
                    console.log(`${keyword} Update Error:`, error);
                }
            }
            console.log('Keyword Watcher Updated!');
        }
    }catch(error){
        console.log(error);
    }
};

module.exports = keywordWatcher