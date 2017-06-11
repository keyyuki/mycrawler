firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert('loi fire base')
    console.log(error);
    // ...
});
$(function() {
    var count = 0;
    $('#industry tbody tr').each(function(index) {
        if (!$(this).find('a').length) {

            return;
        }
        var code = null;
        var name = null;
        var link = null;
        for (var i = 5; i >= 1; i--) {
            if ($(this).find('td:eq(' + i + ')').text()) {
                code = $(this).find('td:eq(' + i + ')').text();
                break;
            }
        }
        name = $(this).find('a').text();
        link = $(this).find('a').attr('href');
        link = link.replace('&amp;', '&');
        link = 'http://www.hosocongty.vn/' + link;
        if (code.trim()) {
            code = code.trim();
            dataSave = {
                code,
                name,
                link
            }
            firebase.database().ref('industries/' + code).set(dataSave).then(() => {
                count++;
                $('#code_couter').text(count)
            });
        }

    });
    alert('convert xong ' + count);
})