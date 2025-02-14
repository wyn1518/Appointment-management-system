const { models: { Setting } } = require('../models/index');

module.exports = {
    getSetting: async (req,res)=>{
      
        let tempSetting = await Setting.findAll()
        let setting = {};
        for(const ts of tempSetting){
            setting[ts.key] = ts.value;
        }

        res.render('drawer', {
            adminContent:"dashboard",
            content:"admin/adminDrawer",
            setting
        });
    },
    updateSetting: async (req,res) => {
    
        await Setting.update({ value : req.body.isAppointmentAvailableAtSunday || '0' },{ where : { key : 'isAppointmentAvailableAtSunday' }});
        await Setting.update({ value : req.body.isAppointmentAvailableAtMonday || '0' },{ where : { key : 'isAppointmentAvailableAtMonday' }});
        await Setting.update({ value : req.body.isAppointmentAvailableAtTuesday || '0' },{ where : { key : 'isAppointmentAvailableAtTuesday' }});
        await Setting.update({ value : req.body.isAppointmentAvailableAtWednesday || '0' },{ where : { key : 'isAppointmentAvailableAtWednesday' }});
        await Setting.update({ value : req.body.isAppointmentAvailableAtThursday || '0' },{ where : { key : 'isAppointmentAvailableAtThursday' }});
        await Setting.update({ value : req.body.isAppointmentAvailableAtFriday || '0' },{ where : { key : 'isAppointmentAvailableAtFriday' }});
        await Setting.update({ value : req.body.isAppointmentAvailableAtSaturday || '0' },{ where : { key : 'isAppointmentAvailableAtSaturday' }});
        
        await Setting.update({ value : req.body.isAppointmentAvailable || '0' },{ where : { key : 'isAppointmentAvailable' } })
        await Setting.update({ value : req.body.minDayToSet || '0' },{ where : { key : 'minDayToSet' }});
        await Setting.update({ value : req.body.maxDayToSet || '0' },{ where : { key : 'maxDayToSet' }});
    
        req.flash('success',`Setting is updated(${new Date().toISOString()}).`)
        res.redirect('/admin/dashboard');
    }
}