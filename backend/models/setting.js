
module.exports = (sequelize,datatypes) => {

    const Setting = sequelize.define('setting',{
        
        key:{
            type:datatypes.STRING,
            primaryKey:true            
        },

        value:{
            type:datatypes.STRING(1000),
            get(){
                const key = this.getDataValue('key');  
                let value = this.getDataValue('value');
                
                return JSON.parse(value);
                
            }
        }
        
    },{

    })
    return Setting;
};