var express = require('express');
const http = require("http");
var router = express.Router();
const jsdom = require("jsdom");
const dom = new jsdom.JSDOM(`<!DOCTYPE html>`);
var $ = require('jquery')(dom.window);

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
router.get('/crawlerdetail', function(request, response) {


    var options = {
        host: "www.hosocongty.vn",

        method: 'GET',
        path: '/cong-ty-tnhh-dich-vu-thuong-mai-phuc-minh-hong-an-com-1558406.htm'
    };
    var req = http.request(options, function(res) {
        var chunks = [];


        res.on("data", function(chunk) {
            var str = chunk.toString('utf8');
            chunks.push(str);
        });

        res.on("end", function() {
            //var body = Buffer.concat(chunks);
            rs = chunks.join('').toString();
            innerBodyAsString = /<body[\s\S]*?>([\s\S]*)<\/body>/g.exec(rs)[1];
            response.send(innerBodyAsString);

            //console.log(body);
            //console.log(chunks);
        });
        res.on("error", function(chunk) {
            response.send('http error');
        });
    });
    req.end();
})

router.get('/crawlergov', function(request, response) {
    var options = {
        host: "online.gov.vn",

        method: 'GET',
        path: '/PersonalWebsiteView.aspx'
    };
    var req = http.request(options, function(res) {
        var chunks = [];


        res.on("data", function(chunk) {
            var str = chunk.toString('utf8');
            chunks.push(str);
        });

        res.on("end", function() {
            //var body = Buffer.concat(chunks);
            rs = chunks.join('').toString();
            innerBodyAsString = /<body[\s\S]*?>([\s\S]*)<\/body>/g.exec(rs)[1];
            var result = []
            $(rs).find('#ctl00_ContentPlaceHolder1_gridWebsites tbody tr').each(function() {
                if (!$(this).find('td').length) {
                    return null;
                }
                var item = {}
                item.website = $(this).find('td:eq(1) a').attr('href');
                item.name = $(this).find('td:eq(2)').text().trim();
                item.link = 'http://online.gov.vn' + $(this).find('td:eq(2) a').attr('href');
                result.push(item);
            })
            response.send(JSON.stringify(result));

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