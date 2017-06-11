firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert('loi fire base')
    console.log(error);
    // ...
});
$(function() {
    var url = new URL(location.href);
    var searchParams = url.searchParams;

    var codes = searchParams.get('codes');
    if (!codes) {
        alert('điền codes');
        return false;
    }

    var codes = codes.split(',');

    controller.setCodes(codes);
    controller.process();
});

var controller = {
    codes: [],
    host: 'http://www.hosocongty.vn',
    setCodes: function(codes) {
        this.codes = codes;
    },
    countLink: 0,
    industryCount: 0,
    industryObject: { code: null, name: null, link: null },
    process: function() {
        console.log('=========================')

        if (!this.codes.length) {
            alert('done');
            return false;
        }
        controller.industryCount = 0;
        var code = this.codes.shift();
        console.log('Đang lay danh mục: ', code);
        firebase.database().ref('industries/' + code).once('value', function(snap) {
            controller.industryObject = snap.val();
            controller.crawl(code);
        });
    },
    crawl: function(code, page = 1, last_id = '') {
        $.get('/crawlerhosocty', {
            code,
            page,
            last_id
        }, function(rs) {
            rs = JSON.parse(rs);
            if (controller.isresponseValid(rs)) {
                console.log('page', page)
                var data = controller.parseData(rs);
                controller.saveToFirebase(data);

                return controller.crawl(code, page + 1, rs.last_id);
            } else {
                firebase.database().ref('industries/' + code).update({
                    crawled: '1',
                    totalLinks: controller.industryCount
                });

                return controller.process();
            }
        })
    },
    isresponseValid: function(rs) {
        if (rs.album != undefined && rs.album instanceof Array && rs.album.length) {
            return true;
        }
        return false;
    },
    parseData: function(data) {



        var linkObjects = data.album.map((item) => {
            var result = {
                id: item.id,
                title: '',
                mst: item.mst,
                url: null,
                address: null,
                categoryCode: controller.industryObject.code,
                industry: controller.industryObject.name,
            };

            result.title = b64DecodeUnicode(item.title).trim();
            result.address = b64DecodeUnicode(item.add).trim();
            result.url = this.host + item.url.substring(1);
            return result;
        });

        return linkObjects;
    },

    saveToFirebase: function(data) {
        data.forEach((item) => {
            var dataSave = item;

            firebase.database().ref('links/' + item.id).set(dataSave);
            controller.countLink += 1;
            controller.industryCount += 1;
            $('#showCount').text(controller.countLink);
            $('#showCat').text(controller.industryObject.code + ' ' + controller.industryObject.name);
        });
    }
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}