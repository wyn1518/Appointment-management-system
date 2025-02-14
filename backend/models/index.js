require('dotenv').config()
const Sequelize = require('sequelize');

const sequalize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host:process.env.DATABASE_HOST,
        dialect:process.env.DATABASE_DIALECT
    }
);

const db = {};
db.sequalize = sequalize;
db.models = {};

db.models.Image = require('./image.js')(sequalize,Sequelize.DataTypes);
db.models.User = require('./Users.js')(sequalize,Sequelize.DataTypes);
db.models.Schedule = require('./schedule.js')(sequalize,Sequelize.DataTypes);
db.models.Setting = require('./setting.js')(sequalize,Sequelize.DataTypes);
db.models.Appointment = require("./appointment.js")(sequalize,Sequelize.DataTypes);
db.models.Role = require('./role.js')(sequalize,Sequelize.DataTypes);

db.models.Role.hasMany(db.models.User);
db.models.User.belongsTo(db.models.Role);

db.models.User.hasMany(db.models.Appointment);
db.models.Appointment.belongsTo(db.models.User);

// db.models.Schedule.hasMany(db.models.Appointment,{constraints: false});
// db.models.Appointment.belongsTo(db.models.Schedule,{constraints: false});

(async () => {
    await db.sequalize.sync({ alter: true})
    .then(()=>{
        db.models.Setting.bulkCreate([
            {
                key:"appointment",
                value:JSON.stringify({
                    defaultUserMaximumAppointment:0,
                    defaultTimeOptions:{
                        '08:00:00':{
                            isAvailable:false,
                            maxVisitors:15
                        },
                        '09:00:00':{
                            isAvailable:false,
                            maxVisitors:15
                        },
                        '10:00:00':{
                            isAvailable:false,
                            maxVisitors:15
                        },
                        '11:00:00':{
                            isAvailable:false,
                            maxVisitors:15
                        },
                        '13:00:00':{
                            isAvailable:false,
                            maxVisitors:15
                        },
                        '14:00:00':{
                            isAvailable:false,
                            maxVisitors:15
                        },
                        '15:00:00':{
                            isAvailable:false,
                            maxVisitors:15
                        },
                    },
                    defaultWeekdayAppointmentStatus:{
                        0:false,
                        1:true,
                        2:true,
                        3:true,
                        4:true,
                        5:true,
                        6:false,
                    },
                    isAvailable:true,
                    range:{
                        min:1,
                        max:200
                    },
                })
            },
           
        ], {
            ignoreDuplicates: true, // Prevents errors if records already exist
        });
    })
   
})()
module.exports = db;
