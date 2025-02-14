var express = require('express');
var router = express.Router();
const {SessionController} = require('../controller/index');
const { filterImage } = require('../middleware/index');


router.use('/*', SessionController.prepare);
router.post('/admin/appointment/input/srch',function(req,res){
    req.session.admin.appointment.input.code = req.body.code || '';
    req.session.admin.appointment.input.month = parseInt(req.body.month);
    req.session.admin.appointment.input.year = parseInt(req.body.year);
    res.redirect('/admin/visit/appointment');
});
router.post('/admin/schedule/input/srch',function(req,res){
    req.session.admin.schedule.input.month = parseInt(req.body.month);
    req.session.admin.schedule.input.year = parseInt(req.body.year);
    res.redirect('/admin/visit/schedule');
});

router.get('/admin/users/page/:page',function(req,res){
    req.session.admin.user.page = Math.max(0,parseInt(req.params.page));  
    res.redirect('/admin/users');
})
router.post('/admin/users/input/srch',function(req,res){
    req.session.admin.users.input.srch = req.body.srch || '';
    req.session.admin.users.input.page = 1;
    res.redirect('/admin/users');
});
router.post('/admin/users/input/page',function(req,res){
    req.session.admin.users.input.page = ((!isNaN(req.body.page)) && req.body.page) || 1;
    res.redirect('/admin/users');
});
router.post('/admin/roles/input/srch',function(req,res){
    req.session.admin.roles.input.srch = req.body.srch || '';
    req.session.admin.roles.input.page = 1;
    res.redirect('/admin/roles');
});
router.post('/admin/roles/input/page',function(req,res){
    req.session.admin.roles.input.page = ((!isNaN(req.body.page)) && req.body.page) || 1;
    res.redirect('/admin/roles');
});
router.post('/admin/images/input/srch',function(req,res){
    req.session.admin.images.input.srch = req.body.srch || '';
    res.redirect('/admin/images');
});



router.post('/appointment/input/year',function(req,res){
    req.session.appointment.input.year = parseInt(req.body.year) || null;
    res.redirect('/appointment');    
});
router.post('/appointment/input/month',function(req,res){

    req.session.appointment.input.month = isNaN(req.body.month) ? null:parseInt(req.body.month) ;
    res.redirect('/appointment');    
});
router.post('/appointment/input/day',function(req,res){
    req.session.appointment.input.day = parseInt(req.body.day) || null;
    res.redirect('/appointment');    
});
router.post('/appointment/input/final',function(req,res){
    
    const members = JSON.parse(req.body.members);
    const time = req.body.time;
    req.session.appointment.input.time = time || null;
    req.session.appointment.input.members = members || null;
    return res.redirect('/appointment');   
     
});
router.get('/appointment/input/reset',function(req,res){
    req.session.appointment.input.day = null;
    req.session.appointment.input.month = null;
    req.session.appointment.input.year =  null;
    req.session.appointment.input.time = null;
    req.session.appointment.input.members =  null;
    res.redirect('/appointment/');    
});
module.exports = router;
