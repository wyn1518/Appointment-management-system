const express = require('express');
const {AppointmentClientController} = require('../../controller/index');
const router = express.Router();
const {isAuth} = require('../../middleware')

router.get('/appointment'
    ,isAuth('In order to make an appointment you need to login using any desired google account.').isLoggin
    ,isAuth('In order to make an appointment you need to login using any desired google account2.').canMakeAppointment
    ,AppointmentClientController.manage);
router.post('/appointment'
    ,isAuth('In order to make an appointment you need to login using any desired google account.').isLoggin
    ,isAuth('In order to make an appointment you need to login using any desired google account2.').canMakeAppointment
    ,AppointmentClientController.manage);


module.exports = router;