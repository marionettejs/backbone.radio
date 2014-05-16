/*
 * Backbone.Radio.Commands
 * -----------------------
 * A messaging system for sending orders.
 *
 */

Radio.Commands = {
  command: function(name) {
    var args = Array.prototype.slice.call(arguments, 1);
    var isChannel = this._channelName ? true : false;

    // Check if we should log the request, and if so, do it
    if (isChannel && this._tunedIn) {
      _log.apply(this, [this._channelName, name].concat(args));
    }

    // If the command isn't handled, log it in DEBUG mode and exit
    if (!this._commands || !this._commands[name]) {
      if (Radio.DEBUG) {
        var channelText = isChannel ? ' on the ' + this._channelName + ' channel' : '';
        console.warn('An unhandled event was fired' + channelText + ': "' + name + '"');
      }
      return;
    }

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
