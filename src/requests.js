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
    return handler.callback.apply(handler.context, args);
  },

  respond: function(name, callback, context) {
    this._requests || (this._requests = {});

    this._requests[name] = {
      callback: makeCallback(callback),
      context: context || this
    };

    return this;
  },

  respondOnce: function(name, callback, context) {
    var self = this;
    var once = _.once(function() {
      self.stopResponding(name);
      return makeCallback(callback).apply(this, arguments);
    });
    return this.request(name, once, context);
  },

  stopResponding: function(name) {
    if (!this._requests) { return; }
    if (!name) {
      delete this._requests;
    } else {
      delete this._requests[name];
    }
  }
};
