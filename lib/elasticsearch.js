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
            async.apply(Elasticsearch.createIndex, cachedSettings.index_posts),
            async.apply(Elasticsearch.buildTopics),
        ], (error, results) => {
            if (error)
                console.log(error);
            res.json({
                status: 'ok'
            });
        });
    };

    /*
        Builds topics index
     */
    Elasticsearch.buildTopics = (callback) => {
        nodebb.batch.processSortedSet('topics:tid', (tids, next) => {
            async.parallel([
                async.apply(Elasticsearch.indexTopics, tids),
                // async.apply(Elasticsearch.indexTitles, tids)
            ], next);
        }, {batch: parseInt(cachedSettings.batch_size, 10)}, (e, r) => {
            if(e) console.log(e);
            callback(e, r);
        });
    };

    Elasticsearch.indexTopics = (tids, callback) => {
        async.waterfall([
            (next) => {
                async.map(tids, nodebb.topics.getPids, next);
            },
            (pids, next) => {
                const processPid = (pid, cb) => {
                    nodebb.posts.getPostsFields(pid, ['uid', 'pid', 'content', 'deleted'], cb);
                };
                async.map(pids, processPid, next);
            },
            // (posts, next) => {
            //     async.map(posts, posts.shift, next);
            // },
            (posts, next) => {
                Elasticsearch.indexPosts(posts, next);
            }
        ], callback);
    };

    // Elasticsearch.indexTitles = (tids, callback) => {
    //     async.waterfall([
    //         async.apply(nodebb.topics.getTopicsByTids, [tid], -1),
    //         (topics, next) => {
    //             if (topics.length === 0 || topics[0] === undefined)
    //                 return next(null, "skip");
    //             const topic = topics[0];
    //             nodebb.posts.getPostsFields([topic.mainPid], ['pid', 'content', 'deleted'], (e, posts) => {
    //                 const payload = {
    //                     pid: posts[0].pid,
    //                     content: posts[0].content,
    //                     deleted: posts[0].deleted,
    //                     title: topic.title,
    //                     tags: topic.tags,
    //                     upvotes: topic.upvotes,
    //                     downvotes: topic.downvotes,
    //                     uid: topic.uid,
    //                     category: topic.category,
    //                 };
    //                 next(e, payload);
    //             });
    //         },
    //         (payload, next) => {
    //             if (payload === "skip")
    //                 return next();
    //             Elasticsearch.indexPosts(payload, next);
    //         }
    //     ], (e, r) => {
    //         console.log(e);
    //         callback(e, r);
    //     });
    // };

    Elasticsearch.indexPosts = (postsArray, callback) => {
        let payload = [];

        for (let i = 0; i < postsArray.length; i++) {
            for (let j = 0; j < postsArray[i].length; j++) {
                const post = postsArray[i][j];
                payload.push({
                    index: {
                        _id: post.pid,
                    }
                });
                payload.push({
                    body: post
                });
            }
        }
        client.bulk({
            index: constants.INDEX_POSTS,
            type: constants.INDEX_POSTS,
            body: payload
        }, callback);
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

    Elasticsearch.search = (query, callback) => {
        client.search(query, callback);
    }


})(module.exports);
