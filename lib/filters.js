(function (Filter) {
    'use strict';

    const async = require('async'),
        database = require('./database'),
        constants = require('./constants'),
        nodebb = require('./nodebb'),
        elasticsearch = require('./elasticsearch'),
        settings = require('./settings');

    const escapeSpecialChars = function (s) {
        return s.replace(/([\+\-&\|!\(\)\{\}\[\]\^"~\*\?:\\\ ])/g, function (match) {
            return '\\' + match;
        });
    };

    Filter.buildAdmin = (customHeader, callback) => {
        customHeader.plugins.push({
            "route": '/plugins/elasticsearch',
            "icon": 'fa-search',
            "name": 'Elasticsearch'
        });

        callback(null, customHeader);
    };


    Filter.search = (data, callback) => {
        settings.getSettings((e, settings) => {
            const query = {
                index: settings.INDEX_POSTS,
                body: {
                    query: {
                        dis_max: {
                            queries: [
                                {
                                    match: {
                                        "body.content" : escapeSpecialChars(data.content)
                                    }
                                },
                                {
                                    match: {
                                        "title": escapeSpecialChars(data.content)
                                    }
                                }
                            ]
                        }
                    },
                    from: 0,
                    size: 20
                }
            };
            elasticsearch.search(query, (err, obj) => {
                if (err) {
                    callback(err);
                } else if (obj && obj.hits && obj.hits.hits && obj.hits.hits.length > 0) {

                    const payload = obj.hits.hits.map((result) => {
                        return parseInt(result._source.body.pid, 10);
                    });
                    callback(null, payload);
                } else {
                    callback(null, []);
                }
            });
        });
    }


})(module.exports);
