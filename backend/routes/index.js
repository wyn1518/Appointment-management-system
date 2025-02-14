var express = require('express');
var router = express.Router();
const {Image, ImageController} = require('../controller/index');
const { filterImage } = require('../middleware/index');


router.get('/',ImageController.read('page/collections',true));


module.exports = router;
