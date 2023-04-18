var config = require('../config');
var fs = require('fs');
const XLSX = require('xlsx');

module.exports = {

    getBranchData: function (req,res){
        try{
            const workbook = XLSX.readFile('branch-data-import.csv');
            const sheet_name_list = workbook.SheetNames;

            const importValue = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {header:['country', 'installs', 'start_trial']});
            res.status(200).json({importValue});
        }catch (error) {
            res.status(200).json({msg: error.message});
        }
    }
}