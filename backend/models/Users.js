
module.exports = (sequelize,datatypes) => {

    const User = sequelize.define('user',{
        googleId:{
            type:datatypes.STRING,
            primaryKey:true
        },
        picture:{
            type:datatypes.STRING,
        },
        name:{
            type:datatypes.STRING,
        },
        email:{
            type:datatypes.STRING,
        },
        isBlock:{
            type:datatypes.BOOLEAN,
            defaultValue:false,
        },
        isAdmin:{
            type:datatypes.BOOLEAN,
            defaultValue:false,     
        },
        canCreateAppointment:{
            type:datatypes.BOOLEAN,
            defaultValue:true,         
        }
    },{

    })
    return User;
};