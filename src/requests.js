/*
 * Backbone.Radio.Requests
 * -----------------------
 * A messaging system for requesting data.
 *
 */
 
Radio.Requests = {
  request: function(name) {
    var args = Array.prototype.slice.call(arguments, 1);
    var isChannel = this._channelName ? true : false;

    // Check if we should log the request, and if so, do it
    if (isChannel && this._tunedIn) {
      _log.apply(this, [this._channelName, name].concat(args));
    }

    // If the request isn't handled, log it in DEBUG mode and exit
    if (!this._requests || !this._requests[name]) {
      if (Radio.DEBUG) {
        var channelText = isChannel ? ' on the ' + this._channelName + ' channel' : '';
        console.warn('An unhandled event was fired' + channelText + ': "' + name + '"');
      }
      return;
    }
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
