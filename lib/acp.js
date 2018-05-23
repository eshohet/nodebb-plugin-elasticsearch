/* globals $, app, sockets */

$(document).ready(() => {
    $('#rebuild-index').click(() => {
        $.get('/api/admin/plugins/elasticsearch/reset')
            .done((data) => {
                app.alert({
                    title: 'Success',
                    message: `All items have been indexed`,
                    type: 'success',
                    timeout: 5000
                });
            })
    });
});
