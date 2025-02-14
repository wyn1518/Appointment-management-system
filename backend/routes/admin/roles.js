var express = require('express');
var router = express.Router();

const {isAuth} = require('../../middleware')
const {RolesController} = require('../../controller/index');
router.get('/roles' 
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:roles')
    ,RolesController.read);
router.post('/roles/create'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:roles')
    ,RolesController.create);
router.post('/roles/update'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:roles')
    ,RolesController.update);

router.post('/roles/delete'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:roles')
    ,RolesController.delete);
module.exports = router;