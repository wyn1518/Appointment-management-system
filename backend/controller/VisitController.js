const { models: { Schedule ,Appointment,User,Setting} ,sequalize} = require('../models/index');
const { Op, where,Sequelize} = require('sequelize');

const {
    compareByYearMonthDay
} = require('../helper/mubadate')
module.exports = {
    
 
    readAppointment:async function(req,res){
        const setting = (await Setting.findAll()).reduce((obj,row)=>{
            obj[row.key] = row.value;
            return obj
        },{});

        res.locals.content  = "visit/appointment";
        res.locals.admin.appointment.timeOption =setting.appointment.defaultTimeOptions; 
        const {code} = res.locals.admin.appointment.input;
        res.locals.admin.appointment.appointments = await Appointment.findAll({
            where:{
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('appointment.date')), res.locals.admin.appointment.input.year),
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('appointment.date')), res.locals.admin.appointment.input.month+1),
                ],
                
            },
            include:{
                model:User,
                attributes:['email']
            },
            order:[
                [
                    Sequelize.literal(`(appointment.code LIKE '%${code}%')`),
                    'DESC'
                ],
                [
                    Sequelize.literal(`ROUND (   
                        (
                            LENGTH('${code}')
                            - LENGTH( REPLACE (appointment.code, UPPER('${code}'), "") ) 
                        ) / LENGTH("value")        
                    ) `),
                    'DESC'
                ],
                [
                    'date',
                    'ASC'
                ],
            ]
        });
        res.render('./admin/drawer');
    },
    updateAppointment: async function(req,res){
        const {id,date,time,members} = req.body;
        await Appointment.update(
            {
                date:date,
                member:JSON.parse(members),
                time:time
            },
            {
                where:{
                    id:id
                }
            }
        );
        console.log(members);
        req.flash('success',`Appointment is updated successfuly.`);
        res.redirect('/admin/visit/appointment')
    },
    deleteAppointment: async function(req,res){

        await Appointment.destroy({
            where:{
                id:req.body.slctdAppointments || []
            }
        }); 
        
        req.flash('success',`Appointments are deleted successfuly.`);
        res.redirect('/admin/visit/appointment');
    },
    readSchedule:async function(req,res){
        const setting = (await Setting.findAll()).reduce((obj,row)=>{
            obj[row.key] = row.value;
            return obj
        },{});

        const currentDate = new Date();
        
        const startAvailableDate  = new Date(Date.UTC(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate()+(setting.appointment.range.min),0,0,0,0));
        const endAvailableDate = new Date(Date.UTC(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate()+((setting.appointment.range.min)+ (setting.appointment.range.max-2)),23,59,59,999));

        const slctdYear =  res.locals.admin.schedule.input.year;
        const slctdMonth = res.locals.admin.schedule.input.month+1;    
    
        let start = new Date(Date.UTC(slctdYear, slctdMonth-1, 1,0,0,0,0));
        let end = new Date(Date.UTC(slctdYear, slctdMonth , 0,0,0,0,0));
        let schedules = res.locals.admin.schedule.schedules = {};

        let cursor = new Date(start);
        while(cursor <= end){
            schedules[cursor.toISOString().split('T')[0]] = {
                isAvailable:setting.appointment.defaultWeekdayAppointmentStatus[cursor.getDay()],
                default:true,
                holiday:null,
                inRange: (compareByYearMonthDay(cursor,startAvailableDate) >= 0 && compareByYearMonthDay(cursor,endAvailableDate) <= 0 )
            }
            cursor.setUTCDate(cursor.getDate() +1)
        }
        
        // 1 January 1    | New Year's Day
        // 2 February 9   | Chinese New Year
        // 3 March 30     | Black Saturday
        // 3 March 28     | Maundy Thursday
        // 3 March 29     | Good Friday
        // 4 April 9      | Araw ng Kagitingan (Day of Valor)
        // 4 April 10     | Eid'l Fitr (End of Ramadan)
        // 5 May 1        | Labor Day
        // 6 June 12      | Independence Day
        // 6 June 17      | Eid'l Adha (Feast of Sacrifice)
        // 8 August 26    | National Heroes Day (Last Monday of August)
        // 8 August 23    | Ninoy Aquino Day (Adjusted from August 21)
        // 11November 1   | All Saints' Day
        // 11November 2   | All Souls' Day
        // 11November 30  | Bonifacio Day
        // 12December 8   | Feast of the Immaculate Conception of Mary
        // 12December 24  | Christmas Eve
        // 12December 25  | Christmas Day
        // 12December 30  | Rizal Day
        // 12December 31  | Last Day of the Year

        
        (await Schedule.findAll()).forEach((el)=>{
            if(!((new Date(el.date)).toISOString().split('T')[0] in schedules)) return
            schedules[(new Date(el.date)).toISOString().split('T')[0]].isAvailable = el.isAvailable;
            schedules[(new Date(el.date)).toISOString().split('T')[0]].default = false;
                
                
            
        });
        switch (slctdMonth) {
            case 1:
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-01`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-01`].holiday = "New Year's Day";
                break;
            case 2:
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-09`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-09`].holiday = "Chinese New Year";
                break;
            case 3:
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-28`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-28`].holiday = "Maundy Thursday";

                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-29`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-29`].holiday = "Good Friday";

                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-30`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-30`].holiday = "Black Saturday";
                break;

            case 4:
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-09`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-09`].holiday = "Araw ng Kagitingan (Day of Valor)";
                
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-10`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-10`].holiday = "Eid'l Fitr (End of Ramadan)";
                break;
            case 5:
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-01`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-01`].holiday = "Labor Day";
                break;
            case 6:
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-12`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-12`].holiday = "Independence Day";
                
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-17`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-17`].holiday = "Eid'l Adha (Feast of Sacrifice)";
                break;
            case 8:
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-23`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-23`].holiday = "Ninoy Aquino Day (Adjusted from August 21)";
                
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-26`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-26`].holiday = "National Heroes Day (Last Monday of August)";
                break;
            case 11:
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-01`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-01`].holiday = "All Saints' Day";

                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-02`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-02`].holiday = "All Souls' Day";

                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-30`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-30`].holiday = "Bonifacio Day";
                break;
            case 11:
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-01`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-01`].holiday = "All Saints' Day";

                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-02`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-02`].holiday = "All Souls' Day";

                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-30`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-30`].holiday = "Bonifacio Day";
                break;
            case 12:
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-08`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-08`].holiday = "Feast of the Immaculate Conception of Mary";

                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-24`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-24`].holiday = "Christmas Eve";

                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-25`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-25`].holiday = "Christmas Day";
                
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-30`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-30`].holiday = "Rizal Day";

                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-31`].isAvailable = false;
                schedules[`${slctdYear}-${String(slctdMonth).padStart(2,'0')}-31`].holiday = "Last Day of the Year";
                break;
            default:
                break;
        }
        
        res.locals.content  = "visit/schedule";
        res.render('./admin/drawer');
    },
    
    updateScheduleAvailability:async function(req,res){
         const setting = (await Setting.findAll()).reduce((obj,row)=>{
            obj[row.key] = row.value;
            return obj
        },{});
        const {slctdSchedules} =  req.body;
        const h = `
            INSERT INTO schedules(date,isAvailable,createdAt,updatedAt)
	            SELECT * FROM (
        `;
        const slctdSchedulesJoined = slctdSchedules.map(el=>`
            SELECT 
                '${el}' as date,
               	${setting.appointment.defaultWeekdayAppointmentStatus[(new Date(el)).getDay()]?0:1} as isAvailable,
                NOW() as createdAt,
                NOW() as updatedAt
        `).join('UNION ALL');
        const f = `
                ) as derived_table 
            ON DUPLICATE KEY UPDATE 
                schedules.isAvailable = (CASE WHEN schedules.isAvailable = 1 THEN 0 ELSE 1 END),
                schedules.updatedAt = NOW();

        `
        const sqlStmt = (h + slctdSchedulesJoined + f).replace(/\n|\s{2,}/g, ' ')
        await sequalize.query(sqlStmt);
        // await Schedule.destroy({
        //     where:sequalize.literal(` (SELECT IF(JSON_EXTRACT(mubadb.settings.value,CONCAT('$.defaultWeekdayAppointmentStatus."',DAYOFWEEK(mubadb.schedules.date)-1,'"')),1,0) = mubadb.schedules.isAvailable FROM mubadb.settings) = (1)`)
        // })
        req.flash('success','Schedules are updated successfuly.')
        res.redirect('/admin/visit/schedule');
    },
    scheduleDelete:async function(req,res){
        
        const {slctdSchedules} =  req.body;
        await Schedule.destroy({
            where:{
                date:slctdSchedules || []
            }
        })
        req.flash('success','Schedules are updated successfuly.')
        res.redirect('/admin/visit/schedule');
    }
    
}