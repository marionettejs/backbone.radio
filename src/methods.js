/* 
 * methods
 * -------
 * The shared API for messaging systems
 *
 */
 
var methods = {
  execute: function(container, returnValue, name) {
    if (!this[container] || !this[container][name]) {
      return;
    }
    var args = Array.prototype.slice.call(arguments, 3);
    var handler = this[container][name];
    var cb = handler.callback;
    var context = handler.context;
    var response = !_.isFunction(cb) ? cb : cb.apply(context, args);
    return returnValue ? response : undefined;
  },

  handle: function(container, name, callback, context) {
    if (!this[container]) {
      this[container] = {};
    }

    context = context || this;

    this[container][name] = {
      callback: callback,
      context: context
    };

    return this;
  },

  handleOnce: function(container, execute, stopHandling, name, callback, context) {
    var self = this;
    var once = _.once(function() {
      self[stopHandling](name);
      return !_.isFunction(callback) ? callback : callback.apply(this, arguments);
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
