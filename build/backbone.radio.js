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
  
    DEBUG: false,
  
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
   * Backbone.Radio.Commands
   * -----------------------
   * A messaging system for sending orders.
   *
   */
  
  Radio.Commands = {
    command: function(name) {
      if (!this._commands || !this._commands[name]) {
        if (Backbone.Radio.DEBUG) {
          var channelText = this.channelName ? ' on the ' + this.channelName + ' channel' : '';
          console.warn('An unhandled event was fired' + channelText + ': "' + name + '"');
        }
        return;
      }
      var args = Array.prototype.slice.call(arguments, 1);
      var handler = this._commands[name];
      var cb = handler.callback;
      var context = handler.context;
      cb.apply(context, args);
    },
  
    react: function(name, callback, context) {
      if (!this._commands) {
        this._commands = {};
      }
  
      context = context || this;
  
      this._commands[name] = {
        callback: callback,
        context: context
      };
  
      return this;
    },
  
    reactOnce: function(name, callback, context) {
      var self = this;
      var once = _.once(function() {
        self.stopReacting(name);
        return callback.apply(this, arguments);
      });
      return this.command(name, once, context);
    },
  
    stopReacting: function(name) {
      if (!name) {
        delete this._commands;
      } else {
        delete this._commands[name];
      }
    }
  };
  
  /*
   * Backbone.Radio.Requests
   * ----------------------
   * A messaging system for requesting data.
   *
   */
   
  Radio.Requests = {
    request: function(name) {
      if (!this._requests || !this._requests[name]) {
        if (Backbone.Radio.DEBUG) {
          var channelText = this.channelName ? ' on the ' + this.channelName + ' channel' : '';
          console.warn('An unhandled event was fired' + channelText + ': "' + name + '"');
        }
        return;
      }
      var args = Array.prototype.slice.call(arguments, 1);
      var handler = this._requests[name];
      var cb = handler.callback;
      var context = handler.context;
      return cb.apply(context, args);
    },
  
    respond: function(name, callback, context) {
      if (!this._requests) {
        this._requests = {};
      }
  
      context = context || this;
  
      callback = _.isFunction(callback) ? callback : _.constant(callback);
  
      this._requests[name] = {
        callback: callback,
        context: context
      };
  
      return this;
    },
  
    respondOnce: function(name, callback, context) {
      var self = this;
      callback = _.isFunction(callback) ? callback : _.constant(callback);
      var once = _.once(function() {
        self.stopResponding(name);
        return callback.apply(this, arguments);
      });
      return this.request(name, once, context);
    },
  
    stopResponding: function(name) {
      if (!name) {
        delete this._requests;
      } else {
        delete this._requests[name];
      }
    }
  };
  
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
  
  function _connect(methodName, hash, context) {
    if ( !hash ) { return; }
    context = context || this;
    _.each(hash, function(fn, eventName) {
      this[methodName](eventName, _.bind(fn, context));
    }, this);
  }
  
  var map = {
    Events:   'on',
    Commands: 'react',
    Requests: 'respond'
  };
  
  _.each(map, function(methodName, systemName) {
    var connectName = 'connect'+ systemName;
    Radio.Channel.prototype[connectName] = _.partial(_connect, methodName);
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
