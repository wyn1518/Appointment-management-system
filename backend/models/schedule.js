module.exports = (sequelize,datatypes) => {

    const Schedule = sequelize.define('schedule',{
        date:{
            type:datatypes.DATEONLY,
            allowNull:false,
            unique:true,
            primaryKey:true
        },
        humanizeDate:{
            type:datatypes.VIRTUAL,
            get(){
                const date = new Date(this.getDataValue('date'));
                return date.toLocaleString('default', { month:'long',day: 'numeric',year:'numeric' });
            }
        },
        isAvailable:{
            type:datatypes.BOOLEAN,
            defaultValue:true,
            
        },
        // timeOptions:{
        //     type:datatypes.JSON,
        //     defaultValue:{
        //         "8-9am":{
        //             isAvailable:true,
        //             maxVisitors:15,
        //         },
        //         "9-10am":{
        //             isAvailable:true,
        //             maxVisitors:15,
        //         },
        //         "10-11am":{
        //             isAvailable:true,
        //             maxVisitors:15,
        //         },
        //         "11-12am":{
        //             isAvailable:true,
        //             maxVisitors:15,
        //         },
        //         "1-2pm":{
        //             isAvailable:true,
        //             maxVisitors:15,
        //         },
        //         "2-3pm":{
        //             isAvailable:true,
        //             maxVisitors:15,
        //         },
        //         "3-4pm":{
        //             isAvailable:true,
        //             maxVisitors:15,
        //         }
        //     },
        // },

    },{

    })
  
    return Schedule;
};

