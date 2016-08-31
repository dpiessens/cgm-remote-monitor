'use strict';

var util = require('util')
var appInsights = require("applicationinsights");

function init(env) {

  var logger = { };

  // Log an information message
  logger.info = function info(message, params) {
    var formatMsg = util.format(message, params);
    console.info(formatMsg);
    
    var client = getInsights();
    if (client != null) {
        client.trackTrace(formatMsg, 1);
    }
  };
  
  // Log an warning message
  logger.warn = function warn(message, params) {
    var formatMsg = util.format(message, params);
    console.warn(meformatMsgssage);  
    
    var client = getInsights();
    if (client != null) {
        client.trackTrace(formatMsg, 2);
    }
  };
  
  // Log an debug message
  logger.log = function log(message, params) {
    var formatMsg = util.format(message, params);
    console.log(formatMsg);
    var client = getInsights();
    if (client != null) {
        client.trackTrace(formatMsg, 0);
    } 
  };
  
  // Log an event
  logger.event = function event(name, properties) {
    var client = getInsights();
    if (client != null) {
        client.trackEvent(name, properties);
    } 
  };
  
  // Log an dependency
  logger.dependency = function dependency(name, commandName, startTime, endTime, success) {
    var client = getInsights();
    if (client != null) {
        var elapsedTime = endTime - startTime;
        client.trackDependency(name, commandName, elapsedTime, success);
    } 
  };

  // Log an error message
  logger.error = function error(ex) {
    console.error(ex);
    
    var client = getInsights();
    if (client != null) {
        client.trackException(ex);
    } 
  };
  
  function getInsights() {
      var client = null;
      if (env.appInsights !== null) {
          client = appInsights.getClient();
      }
      
      return client; 
  } 

 return logger;
}

module.exports = init;