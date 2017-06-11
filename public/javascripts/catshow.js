firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert('loi fire base')
    console.log(error);
    // ...
});
$(function() {

    var cats = firebase.database().ref('industries').orderByKey().once('value', function(snap) {
        var values = snap.val();

        for (k in values) {
            if (values.hasOwnProperty(k)) {
                var obj = values[k];
                var totalCrawl = obj.totalLinks || '';
                $('#cats tbody').append(`<tr>
                    <td><input type="checkbox" class="sCode" value="${obj.code}"/></td>
                    <td>${obj.code}</td>
                    <td>${obj.name}</td>
                    <td>${totalCrawl}</td>
                    <td><a href="/getlink.html?codes=${obj.code}">crawl</a></td>                    
                    </tr>`);
            }

        }
    });
    $('#getLinks').on('click', function() {
        var codes = [];
        $('#cats .sCode:checked').each(function() {
            codes.push($(this).val());
        });
        location.href = '/getlink.html?codes=' + codes.join(',')
    })
});