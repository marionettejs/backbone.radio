// Backbone.Radio v0.1.0
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], function(Backbone, _) {
      return factory(Backbone, _);
    });
  }
  else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    module.exports = factory(Backbone, _);
  }
  else {
    factory(root.Backbone, root._);
  }
}(this, function(Backbone, _) {
  'use strict';

  var previousRadio = Backbone.Radio;

  var Radio = Backbone.Radio = {};

  Backbone.Radio.VERSION = '0.1.0';

  Backbone.Radio.noConflict = function () {
    Backbone.Radio = previousRadio;
    return this;
  };

  /*
   * Backbone.Radio
   * --------------
   * The 'top-level' API for working with Backbone.Radio
   *
   */
  
  _.extend(Radio, {
    _channels: {},
  
    channel: function(channelName) {
      if (!channelName) {
        throw new Error('You must provide a name for the channel.');
      }
  
      return Radio._getChannel( channelName );
    },
  
    _getChannel: function(channelName) {
      var channel = Radio._channels[channelName];
  
      if(!channel) {
        channel = new Radio.Channel(channelName);
        Radio._channels[channelName] = channel;
      }
  
      return channel;
    }
  });
  
  /* 
   * methods
   * -------
   * The shared API for messaging systems
   *
   */
   
  var methods = {
    execute: function(container, returnValue, name) {
      if (!this[container] || !this[container][name]) {
        return;
      }
      var args = Array.prototype.slice.call(arguments, 3);
      var handler = this[container][name];
      var cb = handler.callback;
      var context = handler.context;
      var response = cb.apply(context, args);
      return returnValue ? response : undefined;
    },
  
    handle: function(container, name, callback, context) {
      if (!this[container]) {
        this[container] = {};
      }
  
      context = context || this;
  
      callback = _.isFunction(callback) ? callback : _.constant(callback);
  
      this[container][name] = {
        callback: callback,
        context: context
      };
  
      return this;
    },
  
    handleOnce: function(container, execute, stopHandling, name, callback, context) {
      var self = this;
      callback = _.isFunction(callback) ? callback : _.constant(callback);
      var once = _.once(function() {
        self[stopHandling](name);
        return callback.apply(this, arguments);
      });
      return this[execute](name, once, context);
    },
  
    stopHandling: function(container, name) {
      if (!name) {
        delete this[container];
      } else {
        delete this[container][name];
      }
    }
  };
  
  /*
   * Factory
   * -------
   * Generates a new messaging system by wrapping the
   * generic methods with semantic names.
   *
   */
  
  var Factory = function(name, options) {
    var system = {};
    var container = '_'+name;
    var methodsMap = options.methodsMap;
    var returnValue = options.returnValue;
  
    system[methodsMap.execute] = _.partial(methods.execute, container, returnValue);
    system[methodsMap.handle] = _.partial(methods.handle, container);
    system[methodsMap.handleOnce] = _.partial(methods.handleOnce, container, methodsMap.handle, methodsMap.stopHandling);
    system[methodsMap.stopHandling] = _.partial(methods.stopHandling, container);
  
    return system;
  };
  
  /*
   * Backbone.Radio.Commands
   * -----------------------
   * A messaging system for sending orders.
   *
   */
  
  var commandsMap = {
    execute: 'command',
    handle: 'react',
    handleOnce: 'reactOnce',
    stopHandling: 'stopReacting'
  };
  
  Radio.Commands = new Factory('commands', {
    methodsMap: commandsMap,
    returnValue: false
  });
  
  /*
   * Backbone.Radio.Requests
   * ----------------------
   * A messaging system for requesting data.
   *
   */
  
   var requestsMap = {
    execute: 'request',
    handle: 'respond',
    handleOnce: 'respondOnce',
    stopHandling: 'stopResponding'
  };
  
  Radio.Requests = new Factory('requests', {
    methodsMap: requestsMap,
    returnValue: true
  });
  
  /*
   * Backbone.Radio.Channel
   * ----------------------
   * A Channel is an object that extends from Backbone.Events,
   * Radio.Commands, and Radio.Requests. 
   *
   */
  
  Radio.Channel = function(channelName) {
    this.channelName = channelName;
    _.extend(this, Backbone.Events, Radio.Commands, Radio.Requests);
  };
  
  _.extend(Backbone.Radio.Channel.prototype, {
  
    // Remove all handlers from the messaging systems of this channel
    reset: function() {
      this.off();
      this.stopListening();
      this.stopReacting();
      this.stopResponding();
      return this;
    }
  });
  
  /*
   * proxy
   * -----
   * Supplies a top-level API.
   *
   */
  
   var channel, args, systems = [Backbone.Events, Radio.Commands, Radio.Requests];
  
   _.each(systems, function(system) {
    _.each(system, function(method, methodName) {
      Radio[methodName] = function(channelName) {
        args = Array.prototype.slice.call(arguments, 2);
        channel = this.channel(channelName);
        return channel[methodName].apply(this, args);
      };
    });
   });
  

  return Backbone.Radio;
}));
