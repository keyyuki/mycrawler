var express = require('express');
var router = express.Router();

/* GET home page. */


router.get('/', function(req, res, next) {
    res.send('Hello I am crawler');
});

module.exports = router;