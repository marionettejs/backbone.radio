/*
 * Backbone.Radio.Commands
 * -----------------------
 * A messaging system for sending orders.
 *
 */

Radio.Commands = {
  command: function(name) {
    var args = slice.call(arguments, 1);
    var channelName = this._channelName;

    // Check if we should log the request, and if so, do it
    if (channelName && this._tunedIn) {
      Radio.log.apply(this, [channelName, name].concat(args));
    }

    // If the command isn't handled, log it in DEBUG mode and exit
    if (this._commands && this._commands[name]) {
      var handler = this._commands[name];
      handler.callback.apply(handler.context, args);
    } else {
      Radio._debugLog('An unhandled event was fired', name, channelName);
    }

    return this;
  },

  comply: function(name, callback, context) {
    this._commands || (this._commands = {});

    this._commands[name] = {
      callback: callback,
      context: context || this
    };

    return this;
  },

  complyOnce: function(name, callback, context) {
    var self = this;

    var once = _.once(function() {
      self.stopComplying(name);
      return callback.apply(this, arguments);
    });

    return this.comply(name, once, context);
  },

  stopComplying: function(name) {
    var store = this._commands;

    if (!name) {
      delete this._commands;
    } else if (store && store[name]) {
      delete store[name];
    } else {
      Radio._debugLog('Attempted to remove the unregistered command', name, this._channelName);
    }

    return this;
  }
};
