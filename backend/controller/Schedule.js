const { models: { Schedule ,Appointment} } = require('../models/index');
const { Op } = require('sequelize');
const calendar = require('../utility/calendar');
module.exports = {
    updateAvailability:{
        range:async function(req,res){
            let start = new Date(req.body.startDate);
            let end = new Date(req.body.endDate);
             
            let cursor = new Date(start);

            let data = [];
            while(cursor <= end){
                data.push({date:new Date(cursor),isAvailable:req.body.isAvailable?true:false});
                cursor.setDate(cursor.getDate()+1);
            }

            await Schedule.bulkCreate(data,{
                updateOnDuplicate: ["isAvailable"]
            });
            req.flash('success',`${req.body.choseDate}  is updated.`)
            res.redirect('/admin/appointment');
        },
        individual:async function(req,res){
            let chosenDate = new Date(req.body.date);
    
            await Schedule.create({
                date:chosenDate,
                isAvailable:!!req.body.isAvailable
            },{
                updateOnDuplicate: ["isAvailable"]
            });
            
            req.flash('success',`${req.body.date} is updated.`)
            res.redirect('/admin/appointment');
        }
    },
    currentMonthSchedule: async (req,res)=>{
        let currentDate = new Date();
        let yearFilter = +req.query.yearFilter || currentDate.getFullYear();
        let monthFilter = +req.query.monthFilter || currentDate.getMonth()+1;

        let startDate = new Date(yearFilter, +monthFilter-1, 1);
        let endDate = new Date(+yearFilter, +monthFilter , 0);
        let calendar = {};
        let cursor = new Date(startDate);

        while(cursor <= endDate){
            calendar[cursor.toLocaleString('default', { month:'long',day: 'numeric',year:'numeric' })] = null;
            cursor.setDate(cursor.getDate()+1);
        }
        
        let schedules = await Schedule.findAll({
            where:{
                date:{[Op.between]:[startDate,endDate]}
            }
        });

        for(const schedule of schedules){
            calendar[(new Date(schedule.date)).toLocaleString('default',{ month:'long',day: 'numeric',year:'numeric' })] = schedule;
        }

        // console.log(schedules)
        res.render('drawer', {
            adminContent:"appointment",
            content:"admin/adminDrawer",
            yearFilter,
            monthFilter,
            schedules,
            calendar
        });
    }
}