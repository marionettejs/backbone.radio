/* 
 * methods
 * -------
 * The shared API for messaging systems
 *
 */
 
var methods = {
  execute: function(container, returnValue, name) {
    if (!this[container] || !this[container][name]) {
      if (Backbone.Radio.DEBUG) {
        var channelText = this.channelName ? ' on the ' + this.channelName + ' channel' : '';
        console.warn('An unhandled event was fired' + channelText + ': "' + name + '"');
      }
      return;
    }
    var args = Array.prototype.slice.call(arguments, 3);
    var handler = this[container][name];
    var cb = handler.callback;
    var context = handler.context;
    var response = cb.apply(context, args);
    return returnValue ? response : undefined;
  },

  handle: function(container, name, callback, context) {
    if (!this[container]) {
      this[container] = {};
    }

    context = context || this;

    callback = _.isFunction(callback) ? callback : _.constant(callback);

    this[container][name] = {
      callback: callback,
      context: context
    };

    return this;
  },

  handleOnce: function(container, execute, stopHandling, name, callback, context) {
    var self = this;
    callback = _.isFunction(callback) ? callback : _.constant(callback);
    var once = _.once(function() {
      self[stopHandling](name);
      return callback.apply(this, arguments);
    });
    return this[execute](name, once, context);
  },

  stopHandling: function(container, name) {
    if (!name) {
      delete this[container];
    } else {
      delete this[container][name];
    }
  }
};
