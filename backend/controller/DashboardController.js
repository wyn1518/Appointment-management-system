const { models: { Schedule ,Appointment,User,Setting} ,sequalize} = require('../models/index');

const { Op, where,QueryTypes,Sequalize} = require('sequelize');
module.exports = {
    read:async function(req,res){
        res.locals.content = 'dashboard';
        const stat = res.locals.admin.dashboard.stat = (await sequalize.query(`
            SELECT 
                SUM(1) AS totalAppointment,
                SUM(ROUND((LENGTH(mubadb.appointments.member) - 
                    LENGTH(REPLACE(mubadb.appointments.member, ', "gender": "m"', ''))) / CHAR_LENGTH(', "gender": "m"}'))) AS male,
                SUM(ROUND((LENGTH(mubadb.appointments.member) - 
                    LENGTH(REPLACE(mubadb.appointments.member, ', "gender": "f"', ''))) / CHAR_LENGTH(', "gender": "f"}'))) AS female
                    
                FROM mubadb.appointments
            `, {
            type: QueryTypes.SELECT,
          }))[0];
        stat.female = parseInt(stat.female)
        stat.male = parseInt(stat.male)
        stat.totalAppointment = parseInt(stat.totalAppointment)
        res.locals.admin.dashboard.setting = (await Setting.findAll()).reduce((obj,row)=>{
            obj[row.key] = row.value;
            return obj
        },{});
        res.render('./admin/drawer');
    },
    updateSetting:async function(req,res){
        const {appointment} = req.body;

        appointment.isAvailable = typeof(appointment.isAvailable) != 'undefined';
        appointment.defaultWeekdayAppointmentStatus = {
            0:typeof(appointment.defaultWeekdayAppointmentStatus['_0']) != 'undefined',
            1:typeof(appointment.defaultWeekdayAppointmentStatus['_1']) != 'undefined',
            2:typeof(appointment.defaultWeekdayAppointmentStatus['_2']) != 'undefined',
            3:typeof(appointment.defaultWeekdayAppointmentStatus['_3']) != 'undefined',
            4:typeof(appointment.defaultWeekdayAppointmentStatus['_4']) != 'undefined',
            5:typeof(appointment.defaultWeekdayAppointmentStatus['_5']) != 'undefined',
            6:typeof(appointment.defaultWeekdayAppointmentStatus['_6']) != 'undefined'
        };
        appointment.range.min = Math.max(parseInt(appointment.range.min),1);
        appointment.range.max = parseInt(appointment.range.max);
        appointment.defaultTimeOptions = {
            '08:00:00': { maxVisitors: Math.max(0,Math.min(20,parseInt(appointment.defaultTimeOptions['08:00:00'].maxVisitors))) },
            '09:00:00': { maxVisitors: Math.max(0,Math.min(20,parseInt(appointment.defaultTimeOptions['09:00:00'].maxVisitors))) },
            '10:00:00': { maxVisitors: Math.max(0,Math.min(20,parseInt(appointment.defaultTimeOptions['10:00:00'].maxVisitors))) },
            '11:00:00': { maxVisitors: Math.max(0,Math.min(20,parseInt(appointment.defaultTimeOptions['11:00:00'].maxVisitors))) },
            '13:00:00': { maxVisitors: Math.max(0,Math.min(20,parseInt(appointment.defaultTimeOptions['13:00:00'].maxVisitors))) },
            '14:00:00': { maxVisitors: Math.max(0,Math.min(20,parseInt(appointment.defaultTimeOptions['14:00:00'].maxVisitors))) },
            '15:00:00': { maxVisitors: Math.max(0,Math.min(20,parseInt(appointment.defaultTimeOptions['15:00:00'].maxVisitors))) }
        }
        await Setting.update({
            value:JSON.stringify(appointment)
        },{
            where:{
                key:'appointment'
            }
        })
        res.redirect('/admin/dashboard');
    }
}