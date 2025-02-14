
const { models: { Setting } } = require('../models/index');

module.exports = async function(req,res,next){
  
    const setting = {};

    const tempSetting = await Setting.findAll()
    
    for(const ts of tempSetting){
        setting[ts.key] = ts.value;
    }

    res.locals.__pass_data__.setting = setting;

    next();
}