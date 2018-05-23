"use strict";

const views = require('./lib/views'),
    filters = require('./lib/filters'),
    elasticsearch = require('./lib/elasticsearch'),
    plugin = {};

plugin.init = function(params, callback) {
    const router = params.router,
        hostMiddleware = params.middleware,
        hostControllers = params.controllers;

    router.get('/admin/plugins/elasticsearch', hostMiddleware.admin.buildHeader, views.renderAdminPage);
    router.get('/api/admin/plugins/elasticsearch', views.renderAdminPage);
    router.get('/api/admin/plugins/elasticsearch/reset', elasticsearch.reset);

    elasticsearch.init();

    callback();
};

plugin.filters = filters;

module.exports = plugin;
