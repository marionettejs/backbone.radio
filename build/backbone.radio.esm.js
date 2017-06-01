// Backbone.Radio v2.0.0

import _ from 'underscore';
import Backbone from 'backbone';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var previousRadio = Backbone.Radio;

var Radio = Backbone.Radio = {};

Radio.VERSION = '<%= version %>';

// This allows you to run multiple instances of Radio on the same
// webapp. After loading the new version, call `noConflict()` to
// get a reference to it. At the same time the old version will be
// returned to Backbone.Radio.
Radio.noConflict = function () {
  Backbone.Radio = previousRadio;
  return this;
};

// Whether or not we're in DEBUG mode or not. DEBUG mode helps you
// get around the issues of lack of warnings when events are mis-typed.
Radio.DEBUG = false;

// Format debug text.
Radio._debugText = function (warning, eventName, channelName) {
  return warning + (channelName ? ' on the ' + channelName + ' channel' : '') + ': "' + eventName + '"';
};

// This is the method that's called when an unregistered event was called.
// By default, it logs warning to the console. By overriding this you could
// make it throw an Error, for instance. This would make firing a nonexistent event
// have the same consequence as firing a nonexistent method on an Object.
Radio.debugLog = function (warning, eventName, channelName) {
  if (Radio.DEBUG && console && console.warn) {
    console.warn(Radio._debugText(warning, eventName, channelName));
  }
};

var eventSplitter = /\s+/;

// An internal method used to handle Radio's method overloading for Requests.
// It's borrowed from Backbone.Events. It differs from Backbone's overload
// API (which is used in Backbone.Events) in that it doesn't support space-separated
// event names.
Radio._eventsApi = function (obj, action, name, rest) {
  if (!name) {
    return false;
  }

  var results = {};

  // Handle event maps.
  if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
    for (var key in name) {
      var result = obj[action].apply(obj, [key, name[key]].concat(rest));
      eventSplitter.test(key) ? _.extend(results, result) : results[key] = result;
    }
    return results;
  }

  // Handle space separated event names.
  if (eventSplitter.test(name)) {
    var names = name.split(eventSplitter);
    for (var i = 0, l = names.length; i < l; i++) {
      results[names[i]] = obj[action].apply(obj, [names[i]].concat(rest));
    }
    return results;
  }

  return false;
};

// An optimized way to execute callbacks.
Radio._callHandler = function (callback, context, args) {
  var a1 = args[0],
      a2 = args[1],
      a3 = args[2];
  switch (args.length) {
    case 0:
      return callback.call(context);
    case 1:
      return callback.call(context, a1);
    case 2:
      return callback.call(context, a1, a2);
    case 3:
      return callback.call(context, a1, a2, a3);
    default:
      return callback.apply(context, args);
  }
};

// A helper used by `off` methods to the handler from the store
function removeHandler(store, name, callback, context) {
  var event = store[name];
  if ((!callback || callback === event.callback || callback === event.callback._callback) && (!context || context === event.context)) {
    delete store[name];
    return true;
  }
}

function removeHandlers(store, name, callback, context) {
  store || (store = {});
  var names = name ? [name] : _.keys(store);
  var matched = false;

  for (var i = 0, length = names.length; i < length; i++) {
    name = names[i];

    // If there's no event by this name, log it and continue
    // with the loop
    if (!store[name]) {
      continue;
    }

    if (removeHandler(store, name, callback, context)) {
      matched = true;
    }
  }

  return matched;
}

/*
 * tune-in
 * -------
 * Get console logs of a channel's activity
 *
 */

var _logs = {};

// This is to produce an identical function in both tuneIn and tuneOut,
// so that Backbone.Events unregisters it.
function _partial(channelName) {
  return _logs[channelName] || (_logs[channelName] = _.bind(Radio.log, Radio, channelName));
}

_.extend(Radio, {

  // Log information about the channel and event
  log: function log(channelName, eventName) {
    if (typeof console === 'undefined') {
      return;
    }
    var args = _.toArray(arguments).slice(2);
    console.log('[' + channelName + '] "' + eventName + '"', args);
  },

  // Logs all events on this channel to the console. It sets an
  // internal value on the channel telling it we're listening,
  // then sets a listener on the Backbone.Events
  tuneIn: function tuneIn(channelName) {
    var channel = Radio.channel(channelName);
    channel._tunedIn = true;
    channel.on('all', _partial(channelName));
    return this;
  },

  // Stop logging all of the activities on this channel to the console
  tuneOut: function tuneOut(channelName) {
    var channel = Radio.channel(channelName);
    channel._tunedIn = false;
    channel.off('all', _partial(channelName));
    delete _logs[channelName];
    return this;
  }
});

/*
 * Backbone.Radio.Requests
 * -----------------------
 * A messaging system for requesting data.
 *
 */

function makeCallback(callback) {
  return _.isFunction(callback) ? callback : function () {
    return callback;
  };
}

Radio.Requests = {

  // Make a request
  request: function request(name) {
    var args = _.toArray(arguments).slice(1);
    var results = Radio._eventsApi(this, 'request', name, args);
    if (results) {
      return results;
    }
    var channelName = this.channelName;
    var requests = this._requests;

    // Check if we should log the request, and if so, do it
    if (channelName && this._tunedIn) {
      Radio.log.apply(this, [channelName, name].concat(args));
    }

    // If the request isn't handled, log it in DEBUG mode and exit
    if (requests && (requests[name] || requests['default'])) {
      var handler = requests[name] || requests['default'];
      args = requests[name] ? args : arguments;
      return Radio._callHandler(handler.callback, handler.context, args);
    } else {
      Radio.debugLog('An unhandled request was fired', name, channelName);
    }
  },

  // Set up a handler for a request
  reply: function reply(name, callback, context) {
    if (Radio._eventsApi(this, 'reply', name, [callback, context])) {
      return this;
    }

    this._requests || (this._requests = {});

    if (this._requests[name]) {
      Radio.debugLog('A request was overwritten', name, this.channelName);
    }

    this._requests[name] = {
      callback: makeCallback(callback),
      context: context || this
    };

    return this;
  },

  // Set up a handler that can only be requested once
  replyOnce: function replyOnce(name, callback, context) {
    if (Radio._eventsApi(this, 'replyOnce', name, [callback, context])) {
      return this;
    }

    var self = this;

    var once = _.once(function () {
      self.stopReplying(name);
      return makeCallback(callback).apply(this, arguments);
    });

    return this.reply(name, once, context);
  },

  // Remove handler(s)
  stopReplying: function stopReplying(name, callback, context) {
    if (Radio._eventsApi(this, 'stopReplying', name)) {
      return this;
    }

    // Remove everything if there are no arguments passed
    if (!name && !callback && !context) {
      delete this._requests;
    } else if (!removeHandlers(this._requests, name, callback, context)) {
      Radio.debugLog('Attempted to remove the unregistered request', name, this.channelName);
    }

    return this;
  }
};

/*
 * Backbone.Radio.channel
 * ----------------------
 * Get a reference to a channel by name.
 *
 */

Radio._channels = {};

Radio.channel = function (channelName) {
  if (!channelName) {
    throw new Error('You must provide a name for the channel.');
  }

  if (Radio._channels[channelName]) {
    return Radio._channels[channelName];
  } else {
    return Radio._channels[channelName] = new Radio.Channel(channelName);
  }
};

/*
 * Backbone.Radio.Channel
 * ----------------------
 * A Channel is an object that extends from Backbone.Events,
 * and Radio.Requests.
 *
 */

Radio.Channel = function (channelName) {
  this.channelName = channelName;
};

_.extend(Radio.Channel.prototype, Backbone.Events, Radio.Requests, {

  // Remove all handlers from the messaging systems of this channel
  reset: function reset() {
    this.off();
    this.stopListening();
    this.stopReplying();
    return this;
  }
});

/*
 * Top-level API
 * -------------
 * Supplies the 'top-level API' for working with Channels directly
 * from Backbone.Radio.
 *
 */

var channel;
var args;
var systems = [Backbone.Events, Radio.Requests];

_.each(systems, function (system) {
  _.each(system, function (method, methodName) {
    Radio[methodName] = function (channelName) {
      args = _.toArray(arguments).slice(1);
      channel = this.channel(channelName);
      return channel[methodName].apply(channel, args);
    };
  });
});

Radio.reset = function (channelName) {
  var channels = !channelName ? this._channels : [this._channels[channelName]];
  _.each(channels, function (channel) {
    channel.reset();
  });
};

export default Radio;
//# sourceMappingURL=backbone.radio.esm.js.map
