(function (Elasticsearch) {
    'use strict';

    const async = require('async'),
        database = require('./database'),
        constants = require('./constants'),
        nodebb = require('./nodebb'),
        elasticsearch = require('elasticsearch'),
        settings = require('./settings');

    let client = null;

    /*
        Establish connection to cluster
     */
    Elasticsearch.init = () => {
        settings.getSettings((error, results) => {
            if (error)
                return console.log(error);
            client = new elasticsearch.Client({
                host: results.host,
                log: 'trace'
            });
        });
    };

    /*
        Rebuild index from scratch
     */
    Elasticsearch.reset = (req, res, next) => {
        console.log(`resetting elasticsearch`);
        async.series([
            async.apply(Elasticsearch.deleteIndex, 'posts'),
            async.apply(Elasticsearch.createIndex, 'posts'),
            async.apply(Elasticsearch.buildIndex, 'posts')
        ], (error, results) => {
            if (error)
                return console.log(error);
            res.json({
                status: 'ok'
            });
        });
    };

    /*
        Builds ${index}
     */
    Elasticsearch.buildIndex = (index, callback) => {
        callback();
    };

    /*
        Delete ${index}
     */
    Elasticsearch.deleteIndex = (index, callback) => {
        callback();
    };

    /*
        Create ${index}
     */
    Elasticsearch.createIndex = (index, callback) => {
        callback();
    };


})(module.exports);
