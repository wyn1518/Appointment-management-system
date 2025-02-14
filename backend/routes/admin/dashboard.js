var express = require('express');
var router = express.Router();
const {DashboardController} = require('../../controller/index');

const {isAuth} = require('../../middleware')

router.get('/dashboard'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:setting')
    ,DashboardController.read
);
router.post('/dashboard'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:setting')
    ,DashboardController.updateSetting
);

module.exports = router;