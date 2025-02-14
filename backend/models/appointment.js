
module.exports = (sequelize,datatypes) => {

    const Appointment = sequelize.define('appointment',{
        id: {
            type: datatypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
        },
        code:{
            type:datatypes.STRING,
            // defaultValue:function() {
            //     const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
            //     return nanoid();
            // }
        },
        time:{
            type:datatypes.STRING
        },
        member:{
            type:datatypes.JSON,
            defaultValue:[],
        },
        date:{
            
            type:datatypes.DATEONLY,
        },
        status:{
            type:datatypes.VIRTUAL,
            get(){
                const currentDate =new Date();
                const scheduleDate = new Date(this.getDataValue('date'));
                
                let y1 = parseInt(currentDate.getFullYear());
                let y2 = parseInt(scheduleDate.getFullYear());
                if(y1 != y2){
                    return y1-y2;
                }

                let m1 = parseInt(currentDate.getMonth());
                let m2 = parseInt(scheduleDate.getMonth());
                if(m1 != m2){
                    return m1-m2;
                }

                let d1 = parseInt(currentDate.getDate());
                let d2 = parseInt(scheduleDate.getDate());
                return d1-d2;

            }
        }
    },{

    })
    return Appointment;
};