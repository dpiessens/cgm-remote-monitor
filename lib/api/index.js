'use strict';

function create (env, ctx) {
  var _ = require('lodash')
    , express = require('express')
    ,  app = express( )
    ;

  var wares = require('../middleware/')(env);
  var logger = require('../logger')(env);

  // set up express app with our options
  app.set('name', env.name);
  app.set('version', env.version);
  // app.set('head', env.head);
  function get_head ( ) {
    return env.head;
  }
  wares.get_head = get_head;
  app.set('units', env.DISPLAY_UNITS);
  // Only allow access to the API if API_SECRET is set on the server.
  app.disable('api');
  if (env.api_secret) {
    logger.log('API_SECRET', env.api_secret);
    app.enable('api');
  }

  if (env.settings.enable) {
    app.extendedClientSettings = ctx.plugins && ctx.plugins.extendedClientSettings ? ctx.plugins.extendedClientSettings(env.extendedSettings) : {};
    _.each(env.settings.enable, function (enable) {
      logger.info('enabling feature: ', enable);
      app.enable(enable);
    });
  }

  app.set('title', [app.get('name'),  'API', app.get('version')].join(' '));

 // Start setting up routes
  if (app.enabled('api')) {
    // experiments
    app.use('/experiments', require('./experiments/')(app, wares, ctx));
  }


  app.use(wares.extensions([
    'json', 'svg', 'csv', 'txt', 'png', 'html', 'tsv'
  ]));
  var entriesRouter = require('./entries/')(app, wares, ctx);
  // Entries and settings
  app.use('/', require('./entries/')(app, wares, ctx, logger));
  app.use('/', require('./treatments/')(app, wares, ctx, logger));
  app.use('/', require('./profile/')(app, wares, ctx));
  app.use('/', require('./devicestatus/')(app, wares, ctx, logger));
  app.use('/', require('./notifications-api')(app, wares, ctx));
  app.use('/', require('./verifyauth')(app, env));
  app.use('/', require('./food/')(app, wares, ctx));
  // Status
  app.use('/', require('./status')(app, wares, env));
  // AppInsights
  app.use('/', require('./appinsights')(app, env));
  return app;
}

module.exports = create;
