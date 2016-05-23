'use strict';

var consts = require('../constants');

function configure (app, env) {
  var express = require('express'),
      api = express.Router( );

  api.get('/appinsights', function(req, res) {
    
    var insightsKey = env.settings.appInsights;
    var enabled = (insightsKey !== null) ? true : false;
    var info = { 
      enabled: enabled
      , key: insightsKey
    };
    
    res.json(info);
  });

  return api;
}

module.exports = configure;