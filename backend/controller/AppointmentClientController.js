
require('dotenv').config()
const { models: { Appointment,Setting,Schedule,User },sequalize } = require('../models/index');
const { Op , where,Sequelize} = require('sequelize');
const nodemailer = require("nodemailer");
const { customAlphabet } = require('nanoid');

const {
    minByMonthAndYear,
    maxByMonthAndYear,
    compareByYear,
    compareByYearMonth,
    compareByYearMonthDay
} = require('../helper/mubadate')





module.exports = {
    manage:async function(req,res){
        const user = req.user;
       
        
        const setting = (await Setting.findAll()).reduce((obj,row)=>{
            obj[row.key] = row.value;
            return obj
        },{});
        
        const currentDate = new Date();
        
        const startAvailableDate  = new Date(Date.UTC(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate()+(setting.appointment.range.min),0,0,0,0));
        const endAvailableDate = new Date(Date.UTC(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate()+(setting.appointment.range.min)+ (setting.appointment.range.max-2),23,59,59,999));
        const upcomingAppointment = ((await sequalize.query(`
            SELECT sum(1) as upcomingAppointment FROM mubadb.appointments 
            where userGoogleId=${req.user.googleId}
                AND mubadb.appointments.date >= '${currentDate.toISOString().split('T')[0]}';    
        `))[0][0].upcomingAppointment);

        if(upcomingAppointment > 0){
            req.flash('info',`You have ongoing appointment, please check you email messages for appointment info.`)
            res.redirect('/');
            return;    
        }
        
        if(!setting.appointment.isAvailable){
            req.flash('info',`Appointment is not available.`)
            res.redirect('/');
            return;
        }
        
        if(res.locals.appointment.input.year === null){
            const listOfYear = res.locals.listOfYear = [];
            
            let cursor = new Date(startAvailableDate);
            
            while(compareByYear(cursor,endAvailableDate) <= 0){
                listOfYear.push(new Date(cursor));
                cursor.setFullYear(parseInt(cursor.getFullYear())+1);
            }
              
            res.render('page/appointmentGetYear');
            return;
        }
        
        const chosenYear = res.locals.appointment.input.year;
        if(chosenYear < parseInt(startAvailableDate.getFullYear()) || chosenYear > parseInt(endAvailableDate.getFullYear())){
            req.session.appointment.input.year = null;
            req.session.appointment.input.day = null;
            req.session.appointment.input.month = null;
    
            req.flash('info',`Chosen year is not available.`)
            
            res.redirect('/appointment/');
            return;
        }
     

        if(res.locals.appointment.input.month === null){
            let listOfMonth = res.locals.listOfMonth = [];
     
        
            const chosenYear = res.locals.appointment.input.year;
    
    
            let cursor = maxByMonthAndYear(startAvailableDate,new Date(chosenYear,0,1));
            let end = minByMonthAndYear(endAvailableDate,new Date(chosenYear,11,31))
        
    
            while( compareByYearMonth(cursor,end) <= 0){            
                listOfMonth.push(new Date(cursor));
                
                cursor.setMonth(cursor.getMonth()+1);
            }
    
        
            res.render('page/appointmentGetMonth');
            return;
        }
    
    
        const chosenMonth =  new Date(Date.UTC(res.locals.appointment.input.year,res.locals.appointment.input.month,1,0,0,0,0));

        if(compareByYearMonth(chosenMonth,startAvailableDate) < 0 || compareByYearMonth(chosenMonth,endAvailableDate) > 0 ){
            req.session.appointment.input.day = null;
            req.session.appointment.input.month = null;
            req.flash('info',`Chosen month is not available.`)
            res.redirect('/appointment');
            return;
        }
        if(res.locals.appointment.input.day === null){
            res.locals.chosenDate = new Date(Date.UTC(res.locals.appointment.input.year,res.locals.appointment.input.month,1,0,0,0,0));
        
   
            let start = new Date(Date.UTC(res.locals.appointment.input.year,res.locals.appointment.input.month,1));
            
            let end = new Date(Date.UTC(res.locals.appointment.input.year,res.locals.appointment.input.month+1,0));
            let cursor = new Date(start);
            
            let isAllDayAvailable = res.locals.isAllDayAvailable = parseInt(end.getDate());

            res.locals.padding =  +cursor.getDay();
            const calendar = res.locals.calendar = {};
            for(let d = 1;d <= parseInt(end.getDate());d++){
                
                calendar[d] = {
                    isAvailable:false,
                    default:true,
                    holiday:null,
                    isFull:false,
                }
            }
           
            
           
            (await Schedule.findAll({
                where:{
                    date:{
                        [Op.between]:[
                            (start.toISOString().split('T')[0]),
                            (end.toISOString().split('T')[0])
                        ]
                    }
                }
            })).forEach((element,index)=>{
                calendar[new Date(element.date).getDate()].isAvailable = element.isAvailable;
                calendar[new Date(element.date).getDate()].default = false;
            });
            let totalPerDay = 0;
            for (let key in setting.appointment.defaultTimeOptions) {
                totalPerDay+=setting.appointment.defaultTimeOptions[key].maxVisitors;
              }
            while(cursor <= end){         
                // console.log(cursor + ' ' + startAvailableDate + ' ' + endAvailableDate);
                let isInRange = (compareByYearMonthDay(cursor,startAvailableDate) >= 0 && compareByYearMonthDay(cursor,endAvailableDate) <= 0 );
                let isGloballyAvailable = setting.appointment.defaultWeekdayAppointmentStatus[cursor.getDay()];
                let cd = cursor.getDate();
                if(isInRange){
                    if(calendar[cd].default){
                        calendar[cd].isAvailable = isGloballyAvailable;    
                    }
                    if(calendar[cd].isAvailable){
                        const members= await Appointment.findAll({
                            where:{
                                date:cursor.toISOString().split('T')[0]
                                
                            }
                        });
                        let totalMembers = 0;
                        members.forEach(e=>totalMembers+=e.member.length);
                        
                        calendar[cd].isFull = totalPerDay <= totalMembers;
                    }
                }else{
                    calendar[cd].isAvailable = false;
                }
                


                cursor.setDate(cursor.getDate()+1);
                
            }
            const slctdYear = res.locals.appointment.input.year;
            const slctdMonth = res.locals.appointment.input.month+1;
            switch (slctdMonth) {
                case 1:
                    calendar[1].isAvailable = false;
                    calendar[1].holiday = "New Year's Day";
                    break;
                case 2:
                    calendar[9].isAvailable = false;
                    calendar[9].holiday = "Chinese New Year";
                    break;
                case 3:
                    calendar[28].isAvailable = false;
                    calendar[28].holiday = "Maundy Thursday";
    
                    calendar[29].isAvailable = false;
                    calendar[29].holiday = "Good Friday";
    
                    calendar[30].isAvailable = false;
                    calendar[30].holiday = "Black Saturday";
                    break;
    
                case 4:
                    calendar[9].isAvailable = false;
                    calendar[9].holiday = "Araw ng Kagitingan (Day of Valor)";
                    
                    calendar[10].isAvailable = false;
                    calendar[10].holiday = "Eid'l Fitr (End of Ramadan)";
                    break;
                case 5:
                    calendar[1].isAvailable = false;
                    calendar[1].holiday = "Labor Day";
                    break;
                case 6:
                    calendar[12].isAvailable = false;
                    calendar[12].holiday = "Independence Day";
                    
                    calendar[17].isAvailable = false;
                    calendar[17].holiday = "Eid'l Adha (Feast of Sacrifice)";
                    break;
                case 8:
                    calendar[23].isAvailable = false;
                    calendar[23].holiday = "Ninoy Aquino Day (Adjusted from August 21)";
                    
                    calendar[26].isAvailable = false;
                    calendar[26].holiday = "National Heroes Day (Last Monday of August)";
                    break;
                case 11:
                    calendar[1].isAvailable = false;
                    calendar[1].holiday = "All Saints' Day";
    
                    calendar[2].isAvailable = false;
                    calendar[2].holiday = "All Souls' Day";
    
                    calendar[30].isAvailable = false;
                    calendar[30].holiday = "Bonifacio Day";
                    break;
                case 11:
                    calendar[1].isAvailable = false;
                    calendar[1].holiday = "All Saints' Day";
    
                    calendar[2].isAvailable = false;
                    calendar[2].holiday = "All Souls' Day";
    
                    calendar[30].isAvailable = false;
                    calendar[30].holiday = "Bonifacio Day";
                    break;
                case 12:
                    calendar[8].isAvailable = false;
                    calendar[8].holiday = "Feast of the Immaculate Conception of Mary";
    
                    calendar[24].isAvailable = false;
                    calendar[24].holiday = "Christmas Eve";
    
                    calendar[25].isAvailable = false;
                    calendar[25].holiday = "Christmas Day";
                    
                    calendar[30].isAvailable = false;
                    calendar[30].holiday = "Rizal Day";
    
                    calendar[31].isAvailable = false;
                    calendar[31].holiday = "Last Day of the Year";
                    break;
                default:
                    break;
            }
            res.render('page/appointmentGetDay');
            return;
        }    



        const chosenDate =  new Date(Date.UTC(res.locals.appointment.input.year,res.locals.appointment.input.month,res.locals.appointment.input.day,0,0,0,0));
        if((compareByYearMonthDay(chosenDate,startAvailableDate) < 0 || compareByYearMonthDay(chosenDate,endAvailableDate) > 0 )  && !chosenDateStatus.isAvailable){
            req.session.appointment.input.day = null;
            req.session.appointment.input.month = null;
            req.session.appointment.input.day = null;
            req.flash('info',`Chosen date is not available.`)
            res.redirect('/appointment');
            return;
        }

        let chosenDateStatus = await Schedule.findOne({
            where:{
                date:chosenDate.toISOString().split('T')[0] ,
            }
        }) || {
            date:chosenDate.toISOString().split('T')[0],
            isAvailable:true,
            isRecorded:true
        };

        const timeOptions = res.locals.timeOptions = setting.appointment.defaultTimeOptions
        const appts = await Appointment.findAll({
            where:{
                date:chosenDate.toISOString().split('T')[0]
            }
        });

        for(const appt of appts){
            const occupiedSlots = appt.member.length;
            timeOptions[appt.time].maxVisitors = Math.max(0,timeOptions[appt.time].maxVisitors-occupiedSlots);
        }

        if(res.locals.appointment.input.time === null && res.locals.appointment.input.members == null){
            res.render('page/appointmentGetMember');
            return;
        }

        // FINAL STEP OF MAKING APPOINTMENT 
        
        const members = res.locals.appointment.input.members ;
        const time = res.locals.appointment.input.time;
        const code = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)();

        if(timeOptions[time].maxVisitors - members.length < 0){    
            req.flash('error',`${time} is already fully occupied.`);
            res.redirect('/appointment');
            return;
        }

        await Appointment.create({
            code:code,
            time:time,
            member:members,
            userGoogleId:user.googleId,
            date:chosenDate.toISOString().split('T')[0]
        });

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.GOOGLE,
                pass: process.env.GOOGLE_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.GOOGLE,
            to: user.email,
            subject: "Hello from Muba",
            html: `
            <p>Your appointment is scheduled at ${chosenDate.toLocaleDateString('en-US',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} with the time of ${parseInt(time.split(':')[0])%12}${(parseInt(time.split(':')[0]) <= 12?'am':'pm')} using code ${code}. Member of this appointments are ${members.map((el,index)=>el.name +(index == members.length-1?'':','))},
            `,
        };
        
        await transporter.sendMail(mailOptions);

        req.flash('success','Your Appoinment is successfully save. Please check your email inbox for the code.')
        res.redirect('/');

    },
}