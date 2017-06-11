var express = require('express');
const http = require("http");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/crawlerhosocty', function(request, response) {
    //response.send('Hello I am crawler 2');



    var defaultParam = {
        last_id: 0,
        page: 1,
        code: 0
    }
    var params = Object.assign(defaultParam, request.query);

    var path = '/json/nganh.php?code=' + params.code + '&page=' + params.page + '&last_id=' + params.last_id;
    console.log(path);
    console.log(request.query);
    var options = {
        host: 'www.hosocongty.vn',

        method: 'GET',
        path: path
    };
    var req = http.request(options, function(res) {
        var chunks = [];

        res.on("data", function(chunk) {
            var str = chunk.toString('utf8');
            chunks.push(str);
        });

        res.on("end", function() {
            //var body = Buffer.concat(chunks);
            response.send(chunks.join(''));
            //console.log(body);
            //console.log(chunks);
        });
        res.on("error", function(chunk) {
            response.send('http error');
        });
    });
    req.end();

});

// innerBodyAsString=/<body[\s\S]*?>([\s\S]*)<\/body>/g.exec(rs)[1];

module.exports = router;