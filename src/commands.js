/*
 * Backbone.Radio.Commands
 * -----------------------
 * A messaging system for sending orders.
 *
 */

/**
 * A messaging system for sending orders
 * @mixin
 */
Radio.Commands = {

  /**
   * Order a command to be completed. Optionally pass arguments to send along
   * to the callback. Like Backbone.Event's `trigger` method.
   * @param  {String} name
   * @param  {} [args...]
   * @return this
   */
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

  /**
   * Register a handler for `commandName` on this object. `callback` will be
   * executed whenever the command is run. Optionally pass a `context` for the
   * callback, defaulting to `this`.
   * @param  {String}   name
   * @param  {Function} callback
   * @param  {Object}   context
   * @return this
   */
  comply: function(name, callback, context) {
    this._commands || (this._commands = {});

    this._commands[name] = {
      callback: callback,
      context: context || this
    };

    return this;
  },

  /**
   * Register a handler for `commandName` that only executes a single time.
   * @param  {String}   name
   * @param  {Function} callback
   * @param  {Object}   context
   * @return this
   */
  complyOnce: function(name, callback, context) {
    var self = this;

    var once = _.once(function() {
      self.stopComplying(name);
      return callback.apply(this, arguments);
    });

    return this.comply(name, once, context);
  },

  /**
   * If `commandName` is passed then that handler is removed from the object.
   * Otherwise, all handlers are removed.
   * @param  {String} name
   * @return this
   */
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
