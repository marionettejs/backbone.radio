/*
 * Backbone.Radio.Requests
 * -----------------------
 * A messaging system for requesting data.
 *
 */

function makeCallback(callback) {
  return _.isFunction(callback) ? callback : _.constant(callback);
}

Radio.Requests = {
  request: function(name) {
    var args = slice.call(arguments, 1);
    var channelName = this._channelName;
    var requests = this._requests;

    // Check if we should log the request, and if so, do it
    if (channelName && this._tunedIn) {
      Radio.log.apply(this, [channelName, name].concat(args));
    }

    // If the request isn't handled, log it in DEBUG mode and exit
    if (requests && (requests[name] || requests['default'])) {
      var handler = requests[name] || requests['default'];
      return handler.callback.apply(handler.context, args);
    } else {
      Radio._debugLog('An unhandled event was fired', name, channelName);
    }
  },

  reply: function(name, callback, context) {
    this._requests || (this._requests = {});

    this._requests[name] = {
      callback: makeCallback(callback),
      context: context || this
    };

    return this;
  },

  replyOnce: function(name, callback, context) {
    var self = this;

    var once = _.once(function() {
      self.stopReplying(name);
      return makeCallback(callback).apply(this, arguments);
    });

    return this.reply(name, once, context);
  },

  stopReplying: function(name) {
    var store = this._requests;

    if (!name) {
      delete this._requests;
    } else if (store && store[name]) {
      delete store[name];
    } else {
      Radio._debugLog('Attempted to remove the unregistered request', name, this._channelName);
    }

    return this;
  }
};
