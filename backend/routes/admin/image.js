var express = require('express');
var router = express.Router();

const {ImageController} = require('../../controller/index');
const {isAuth} = require('../../middleware')

router.get('/images' 
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:images')
    ,ImageController.read('./admin/drawer',[false,true]));
router.get('/images/:tag'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:images')
    ,ImageController.read('./admin/drawer',[false,true]));
router.post('/images/upload' 
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:images')
    ,ImageController.create);
router.post('/images/update'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:images')
    ,ImageController.update);
router.post('/images/delete'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:images')
    ,ImageController.delete);
router.post('/images/update/enable/privacy'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:images')
    ,ImageController.updatePrivacy(true));
router.post('/images/update/disable/privacy'
    ,isAuth('You are not authorize to access this page.').isLoggin
    ,isAuth('You are not authorize to access this page.').isAdmin
    ,isAuth('You are not authorize to access this page.').can('*:images')
    ,ImageController.updatePrivacy(false));

module.exports = router;