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
            if(error)
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

    };

    /*
        Delete ${index}
     */
    Elasticsearch.deleteIndex = (index, callback) => {

    };

    /*
        Create ${index}
     */
    Elasticsearch.createIndex = (index, callback) => {

    };


})(module.exports);
