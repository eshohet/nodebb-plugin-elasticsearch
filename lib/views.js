(function (Views) {
    'use strict';

    const nodebb = require('./nodebb'),
        settings = require('./settings');

    Views.renderAdminPage = (req, res, next) => {
        settings.getSettings((error, results) => {
            if (error)
                return console.log(error);
            res.render('admin/plugins/elasticsearch', results);
        });
    }

})(module.exports);
