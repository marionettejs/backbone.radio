/*
 * Backbone.Radio.Requests
 * -----------------------
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
