var express = require('express');
var router = express.Router();
const {VisitController} = require('../../controller/index');
const {isAuth} = require('../../middleware')


router.get('/visit/appointment'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:appointments')
    ,VisitController.readAppointment);
router.post('/visit/appointment/update'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:appointments')
    ,VisitController.updateAppointment);
router.post('/visit/appointment/delete'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:appointments')
    ,VisitController.deleteAppointment);


router.get('/visit/schedule'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:schedules')
    ,VisitController.readSchedule);
router.post('/visit/schedule/update/availability'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:schedules')
    ,VisitController.updateScheduleAvailability);
router.post('/visit/schedule/delete'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:schedules')
    ,VisitController.scheduleDelete);
module.exports = router;