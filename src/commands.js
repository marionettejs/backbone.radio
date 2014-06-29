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
    if (!this._commands || !this._commands[name]) {
      if (Radio.DEBUG) {
        var channelText = channelName ? ' on the ' + channelName + ' channel' : '';
        console.warn('An unhandled event was fired' + channelText + ': "' + name + '"');
      }
    }
    else {
      var handler = this._commands[name];
      handler.callback.apply(handler.context, args);
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
    }
    else if (store && store[name]) {
      delete store[name];
    }
    else if (Radio.DEBUG) {
      var channelName = this._channelName;
      var channelText = channelName ? ' on the ' + channelName + ' channel.' : '';
      console.warn('Attempted to remove the unregistered command "' + name + '"' + channelText);
    }
    return this;
  }
};
