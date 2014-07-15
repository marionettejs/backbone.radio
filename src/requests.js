/*
 * Backbone.Radio.Requests
 * -----------------------
 * A messaging system for requesting data.
 *
 */


/**
 * @method makeCallback
 * @private
 * @param  {Function} callback - function or value
 * @return {Function} callback
 */
function makeCallback(callback) {
  return _.isFunction(callback) ? callback : _.constant(callback);
}

/**
 * A messaging system for requesting data.
 * @mixin
 */
Radio.Requests = {

  /**
   * Make a request for `requestName`. Optionally pass arguments to send along
   * to the callback. Returns the reply, if one exists. If there is no request
   * then `undefined` will be returned.
   * @param  {String} name
   * @param  {} [args...]
   * @return result of callback
   */
  request: function(name) {
    var args = slice.call(arguments, 1);
    var channelName = this._channelName;

    // Check if we should log the request, and if so, do it
    if (channelName && this._tunedIn) {
      Radio.log.apply(this, [channelName, name].concat(args));
    }

    // If the request isn't handled, log it in DEBUG mode and exit
    if (this._requests && this._requests[name]) {
      var handler = this._requests[name];
      return handler.callback.apply(handler.context, args);
    } else {
      Radio._debugLog('An unhandled event was fired', name, channelName);
    }
  },

  /**
   * Register a handler for `requestName` on this object. `callback` will be
   * executed whenever the request is made. Optionally pass a `context` for the
   * callback, defaulting to `this`.
   * @param  {String}   name
   * @param  {Function} callback
   * @param  {Object}   context
   * @return this
   */
  reply: function(name, callback, context) {
    this._requests || (this._requests = {});

    this._requests[name] = {
      callback: makeCallback(callback),
      context: context || this
    };

    return this;
  },

  /**
   * Register a handler for `requestName` that will only be called a single
   * time.
   * @param  {String}   name
   * @param  {Function} callback
   * @param  {Object}   context
   * @return this
   */
  replyOnce: function(name, callback, context) {
    var self = this;

    var once = _.once(function() {
      self.stopReplying(name);
      return makeCallback(callback).apply(this, arguments);
    });

    return this.reply(name, once, context);
  },

  /**
   * If `requestName` is passed then this method will remove that reply.
   * Otherwise, all replies are removed from the object.
   * @param  {String} name
   * @return this
   */
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
