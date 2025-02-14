var express = require('express');
var router = express.Router();

const {isAuth} = require('../../middleware')
const {UsersController} = require('../../controller/index');

router.get('/users'
  ,isAuth('You are not authorize to access this page.').isLoggin
  ,isAuth('You are not authorize to access this page.').isAdmin
  ,isAuth('You are not authorize to access this page.').can('*:users')
  ,UsersController.read);
router.post('/users/delete'
  ,isAuth('You are not authorize to access this page.').isLoggin
  ,isAuth('You are not authorize to access this page.').isAdmin
  ,isAuth('You are not authorize to access this page.').can('*:users')
  ,UsersController.delete);

router.post('/users/role/:roleName'
  ,isAuth('You are not authorize to access this page.').isLoggin
  ,isAuth('You are not authorize to access this page.').isAdmin
  ,isAuth('You are not authorize to access this page.').can('*:users')
  ,UsersController.updateRole)

router.post('/users/enable/admin'
  ,isAuth('You are not authorize to access this page.').isLoggin
  ,isAuth('You are not authorize to access this page.').isAdmin
  ,isAuth('You are not authorize to access this page.').can('*:users')
  ,UsersController.enableAdmin);
router.post('/users/disable/admin'
  ,isAuth('You are not authorize to access this page.').isLoggin
  ,isAuth('You are not authorize to access this page.').isAdmin
  ,isAuth('You are not authorize to access this page.').can('*:users')
  ,UsersController.disableAdmin);


router.post('/users/enable/appointment'
  ,isAuth('You are not authorize to access this page.').isLoggin
  ,isAuth('You are not authorize to access this page.').isAdmin
  ,isAuth('You are not authorize to access this page.').can('*:users')
  ,UsersController.enableAppointment);
router.post('/users/disable/appointment'
  ,isAuth('You are not authorize to access this page.').isLoggin
  ,isAuth('You are not authorize to access this page.').isAdmin
  ,isAuth('You are not authorize to access this page.').can('*:users')
  ,UsersController.disableAppointment);


  

module.exports = router;