
module.exports = (sequelize,datatypes) => {

    const Role = sequelize.define('role',{
   
        name:{
            type:datatypes.STRING,
            
            primaryKey:true
        },
        permission:{
            type:datatypes.JSON,
        },
    },{

    })
    return Role;
};