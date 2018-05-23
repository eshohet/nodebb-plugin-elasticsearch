(function (Settings) {
    'use strict';

    const meta = require('./nodebb').meta,
        constants = require('./constants');

    Settings.getSettings = (next) => {
        meta.settings.get(constants.NAMESPACE, (error, results) => {
            return next(error, {
                host: results.host || constants.HOST,
                index: results.index || constants.INDEX_NAME,
                post_type: results.post_type || constants.POST_TYPE,
                batch_size: results.index_size || constants.BATCH_SIZE
            });
        });
    }

})(module.exports);
