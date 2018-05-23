(function (Filter) {
    'use strict';

    const async = require('async'),
        database = require('./database'),
        constants = require('./constants'),
        nodebb = require('./nodebb');


    Filter.buildAdmin = (customHeader, callback) => {
        customHeader.plugins.push({
            "route": '/plugins/elasticsearch',
            "icon": 'fa-search',
            "name": 'Elasticsearch'
        });

        callback(null, customHeader);
    };



})(module.exports);
