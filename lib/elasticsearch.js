(function (Elasticsearch) {
    'use strict';

    const async = require('async'),
        database = require('./database'),
        constants = require('./constants'),
        nodebb = require('./nodebb'),
        elasticsearch = require('elasticsearch'),
        settings = require('./settings');

    let client, cachedSettings;

    /*
        Establish connection to cluster
     */
    Elasticsearch.init = () => {
        settings.getSettings((error, results) => {
            if (error)
                return console.log(error);
            cachedSettings = results;
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
            async.apply(Elasticsearch.deleteIndex, cachedSettings.index_posts),
            async.apply(Elasticsearch.deleteIndex, cachedSettings.index_topics),
            async.apply(Elasticsearch.createIndex, cachedSettings.index_posts),
            async.apply(Elasticsearch.createIndex, cachedSettings.index_topics),
            async.apply(Elasticsearch.buildTopics),
        ], (error, results) => {
            if (error)
                return console.log(error);
            res.json({
                status: 'ok'
            });
        });
    };

    /*
        Builds topics index
     */
    Elasticsearch.buildTopics = (callback) => {
        nodebb.batch.processSortedSet('topics:tid', (pids, next)  => {
            console.log(pids);
            next();
        }, {batch: parseInt(cachedSettings.batch_size, 10)}, (e) => {
            if(e)
                return console.log(e);
            callback();
        });
    };

    /*
        Delete ${index}
     */
    Elasticsearch.deleteIndex = (index, callback) => {
        client.indices.delete({
            index
        }, (err, results) => {
            if (!err) {
                callback(null, results);
            }
            else if (/index_not_found_exception/im.test(err.message)) {
                callback();
            }
            else {
                callback(err);
            }
        });
    };

    /*
        Create ${index}
     */
    Elasticsearch.createIndex = (index, callback) => {
        client.indices.create({
            index
        }, (err, results) => {
            if (!err) {
                callback(null, results);
            }
            else if (/index_already_exists/im.test(err.message)) { // we can ignore if index is already there
                callback();
            }
            else {
                callback(err);
            }
        });
    };


})(module.exports);
