firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert('loi fire base')
    console.log(error);
    // ...
});

$(function() {
    rule.getlinks(rule.link[0]);



});
const rule = {
    link: [
        'http://www.hosocongty.vn/json/nganh.php?page=1&code=47411'
    ],
    host: 'http://www.hosocongty.vn',
    curCode: null,
    curPage: null,
    curlastid: null,
    curCatName: 'Bán lẻ máy vi tính, thiết bị ngoại vi, phần mềm trong các cửa hàng chuyên doanh',
    count: 0,
    getlinks: function(link) {
        var url = new URL(link);
        URLSearchParams
        var searchParams = url.searchParams;
        var code = searchParams.get('code');
        var page = searchParams.get('page');
        var last_id = searchParams.get('last_id') || 0;

        this.curCode = code;
        this.curPage = page;
        this.curlastid = last_id;

        this.process();

    },
    process: function() {
        var code = this.curCode;
        var last_id = this.curlastid;
        var page = this.curPage;
        $.get('/crawlerhosocty', {
            code,
            page,
            last_id
        }, function(rs) {
            if (rule.isresponseValid(rs)) {
                var data = rule.parseData(rs);
                rule.saveToFirebase(data);
                rule.displayResult();
                rule.process();
            } else {
                alert('done');
                return;
            }

        }, 'JSON')
    },
    isresponseValid: function(rs) {
        if (rs.album != undefined && rs.album instanceof Array && rs.album.length) {
            return true;
        }
        return false;
    },
    displayResult: function() {
        $('#rule_count').html(this.count);
        $('#rule_curCode').html(this.curCode);
        $('#rule_curPage').html(this.curPage);
        $('#rule_curLastId').html(this.curlastid);

    },
    parseData: function(data) {
        this.curPage++;
        this.curlastid = data.last_id;


        var linkObjects = data.album.map((item) => {
            var result = {
                id: item.id,
                title: '',
                mst: item.mst,
                url: null,
                address: null,
                categoryCode: rule.curCode
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
            dataSave.industry = rule.curCatName;
            firebase.database().ref('links/' + item.id).set(dataSave);
            rule.count++;
        });
    }
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}