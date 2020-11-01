import { reduce, keys, once, each, uniqueId, extend } from 'underscore';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var eventSplitter = /\s+/; // Iterates over the standard `event, callback` (as well as the fancy multiple
// space-separated events `"change blur", callback` and jQuery-style event
// maps `{event: callback}`).

function buildEventArgs(name, callback, context, listener) {
  if (name && _typeof(name) === 'object') {
    return reduce(keys(name), function (eventArgs, key) {
      return eventArgs.concat(buildEventArgs(key, name[key], context || callback, listener));
    }, []);
  }

  if (name && eventSplitter.test(name)) {
    return reduce(name.split(eventSplitter), function (eventArgs, n) {
      eventArgs.push({
        name: n,
        callback: callback,
        context: context,
        listener: listener
      });
      return eventArgs;
    }, []);
  }

  return [{
    name: name,
    callback: callback,
    context: context,
    listener: listener
  }];
} // An optimized way to execute callbacks.


function callHandler(callback, context, args) {
  switch (args.length) {
    case 0:
      return callback.call(context);

    case 1:
      return callback.call(context, args[0]);

    case 2:
      return callback.call(context, args[0], args[1]);

    case 3:
      return callback.call(context, args[0], args[1], args[2]);

    default:
      return callback.apply(context, args);
  }
} // If callback is not a function return the callback and flag it for removal


function makeCallback(callback) {
  if (typeof callback === 'function') {
    return callback;
  }

  var result = function result() {
    return callback;
  };

  result._callback = callback;
  return result;
} // Wrap callback in a once. Returns for requests
// `offCallback` unbinds the `onceWrapper` after it has been called.


function onceWrap(callback, offCallback) {
  var onceCallback = once(function () {
    offCallback(onceCallback);
    return callback.apply(this, arguments);
  });
  onceCallback._callback = callback;
  return onceCallback;
}

// ---------------
// A module that can be mixed in to *any object* in order to provide it with
// a custom event channel. You may bind a callback to an event with `on` or
// remove with `off`; `trigger`-ing an event fires all callbacks in
// succession.
//
//     var object = {};
//     _.extend(object, Events);
//     object.on('expand', function(){ alert('expanded'); });
//     object.trigger('expand');
//
// The reducing API that adds a callback to the `events` object.

var onApi = function onApi(_ref) {
  var events = _ref.events,
      name = _ref.name,
      callback = _ref.callback,
      context = _ref.context,
      ctx = _ref.ctx,
      listener = _ref.listener;
  var handlers = events[name] || (events[name] = []);
  handlers.push({
    callback: callback,
    context: context,
    ctx: context || ctx,
    listener: listener
  });
  return events;
};

var onReducer = function onReducer(events, _ref2) {
  var name = _ref2.name,
      callback = _ref2.callback,
      context = _ref2.context;
  if (!callback) return events;
  return onApi({
    events: events,
    name: name,
    callback: callback,
    context: context,
    ctx: this
  });
};

var onceReducer = function onceReducer(events, _ref3) {
  var name = _ref3.name,
      callback = _ref3.callback,
      context = _ref3.context;
  if (!callback) return events;
  var onceCallback = onceWrap(callback, this.off.bind(this, name));
  return onApi({
    events: events,
    name: name,
    callback: onceCallback,
    context: context,
    ctx: this
  });
};

var cleanupListener = function cleanupListener(_ref4) {
  var obj = _ref4.obj,
      listeneeId = _ref4.listeneeId,
      listenerId = _ref4.listenerId,
      listeningTo = _ref4.listeningTo;
  delete listeningTo[listeneeId];
  delete obj._listeners[listenerId];
}; // The reducing API that removes a callback from the `events` object.


var offReducer = function offReducer(events, _ref5) {
  var name = _ref5.name,
      callback = _ref5.callback,
      context = _ref5.context;
  var names = name ? [name] : keys(events);
  each(names, function (key) {
    var handlers = events[key]; // Bail out if there are no events stored.

    if (!handlers) return; // Find any remaining events.

    events[key] = reduce(handlers, function (remaining, handler) {
      if (callback && callback !== handler.callback && callback !== handler.callback._callback || context && context !== handler.context) {
        remaining.push(handler);
        return remaining;
      } // If not including event, clean up any related listener


      if (handler.listener) {
        var listener = handler.listener;
        listener.count--;
        if (!listener.count) cleanupListener(listener);
      }

      return remaining;
    }, []);
    if (!events[key].length) delete events[key];
  });
  return events;
};

var getListener = function getListener(obj, listenerObj) {
  var listeneeId = obj._listenId || (obj._listenId = uniqueId('l'));
  obj._events = obj._events || {};
  var listeningTo = listenerObj._listeningTo || (listenerObj._listeningTo = {});
  var listener = listeningTo[listeneeId]; // This listenerObj is not listening to any other events on `obj` yet.
  // Setup the necessary references to track the listening callbacks.

  if (!listener) {
    var listenerId = listenerObj._listenId || (listenerObj._listenId = uniqueId('l'));
    listeningTo[listeneeId] = {
      obj: obj,
      listeneeId: listeneeId,
      listenerId: listenerId,
      listeningTo: listeningTo,
      count: 0
    };
    return listeningTo[listeneeId];
  }

  return listener;
};

var listenToApi = function listenToApi(_ref6) {
  var name = _ref6.name,
      callback = _ref6.callback,
      context = _ref6.context,
      listener = _ref6.listener;
  if (!callback) return;
  var obj = listener.obj,
      listenerId = listener.listenerId;
  var listeners = obj._listeners || (obj._listeners = {});
  obj._events = onApi({
    events: obj._events,
    name: name,
    callback: callback,
    context: context,
    listener: listener
  });
  listeners[listenerId] = listener;
  listener.count++; // Call `on` for interop

  obj.on(name, callback, context, {
    _internal: true
  });
};

var listenToOnceApi = function listenToOnceApi(_ref7) {
  var name = _ref7.name,
      callback = _ref7.callback,
      context = _ref7.context,
      listener = _ref7.listener;
  if (!callback) return;
  var offCallback = this.stopListening.bind(this, listener.obj, name);
  var onceCallback = onceWrap(callback, offCallback);
  listenToApi({
    name: name,
    callback: onceCallback,
    context: context,
    listener: listener
  });
}; // Handles triggering the appropriate event callbacks.


var triggerApi = function triggerApi(_ref8) {
  var events = _ref8.events,
      name = _ref8.name,
      args = _ref8.args;
  var objEvents = events[name];
  var allEvents = objEvents && events.all ? events.all.slice() : events.all;
  if (objEvents) triggerEvents(objEvents, args);
  if (allEvents) triggerEvents(allEvents, [name].concat(args));
}; // A difficult-to-believe, but optimized internal dispatch function for
// triggering events. Tries to keep the usual cases speedy (most internal
// Backbone events have 3 arguments).


var triggerEvents = function triggerEvents(events, args) {
  each(events, function (_ref9) {
    var callback = _ref9.callback,
        ctx = _ref9.ctx;
    callHandler(callback, ctx, args);
  });
};

var Events = {
  // Bind an event to a `callback` function. Passing `"all"` will bind
  // the callback to all events fired.
  on: function on(name, callback, context, opts) {
    if (opts && opts._internal) return;
    var eventArgs = buildEventArgs(name, callback, context);
    this._events = reduce(eventArgs, onReducer.bind(this), this._events || {});
    return this;
  },
  // Remove one or many callbacks. If `context` is null, removes all
  // callbacks with that function. If `callback` is null, removes all
  // callbacks for the event. If `name` is null, removes all bound
  // callbacks for all events.
  off: function off(name, callback, context, opts) {
    if (!this._events) return this;
    if (opts && opts._internal) return; // Delete all event listeners and "drop" events.

    if (!name && !context && !callback) {
      this._events = void 0;
      var listeners = this._listeners;
      each(keys(listeners), function (listenerId) {
        cleanupListener(listeners[listenerId]);
      });
      return this;
    }

    var eventArgs = buildEventArgs(name, callback, context);
    this._events = reduce(eventArgs, offReducer, this._events);
    return this;
  },
  // Bind an event to only be triggered a single time. After the first time
  // the callback is invoked, its listener will be removed. If multiple events
  // are passed in using the space-separated syntax, the handler will fire
  // once for each event, not once for a combination of all events.
  once: function once(name, callback, context) {
    var eventArgs = buildEventArgs(name, callback, context);
    this._events = reduce(eventArgs, onceReducer.bind(this), this._events || {});
    return this;
  },
  // Inversion-of-control versions of `on`. Tell *this* object to listen to
  // an event in another object... keeping track of what it's listening to
  // for easier unbinding later.
  listenTo: function listenTo(obj, name, callback) {
    if (!obj) return this;
    var listener = getListener(obj, this);
    var eventArgs = buildEventArgs(name, callback, this, listener);
    each(eventArgs, listenToApi);
    return this;
  },
  // Inversion-of-control versions of `once`.
  listenToOnce: function listenToOnce(obj, name, callback) {
    if (!obj) return this;
    var listener = getListener(obj, this);
    var eventArgs = buildEventArgs(name, callback, this, listener);
    each(eventArgs, listenToOnceApi.bind(this));
    return this;
  },
  // Tell this object to stop listening to either specific events ... or
  // to every object it's currently listening to.
  stopListening: function stopListening(obj, name, callback) {
    var _this = this;

    var listeningTo = this._listeningTo;
    if (!listeningTo) return this;
    var eventArgs = buildEventArgs(name, callback, this);
    var listenerIds = obj ? [obj._listenId] : keys(listeningTo);

    var _loop = function _loop(i) {
      var listener = listeningTo[listenerIds[i]]; // If listening doesn't exist, this object is not currently
      // listening to obj. Break out early.

      if (!listener) return "break";
      each(eventArgs, function (args) {
        var listenToObj = listener.obj;
        var events = listenToObj._events;
        if (!events) return;
        listenToObj._events = offReducer(events, args); // Call `off` for interop

        listenToObj.off(args.name, args.callback, _this, {
          _internal: true
        });
      });
    };

    for (var i = 0; i < listenerIds.length; i++) {
      var _ret = _loop(i);

      if (_ret === "break") break;
    }

    return this;
  },
  // Trigger one or many events, firing all bound callbacks. Callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  trigger: function trigger(name) {
    var _this2 = this;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!this._events) return this;

    if (name && _typeof(name) === 'object') {
      each(keys(name), function (key) {
        triggerApi({
          events: _this2._events,
          name: key,
          args: [name[key]]
        });
      });
    }

    if (name && eventSplitter.test(name)) {
      each(name.split(eventSplitter), function (n) {
        triggerApi({
          events: _this2._events,
          name: n,
          args: args
        });
      });
      return this;
    }

    triggerApi({
      events: this._events,
      name: name,
      args: args
    });
    return this;
  }
};

/*
 * Requests
 * -----------------------
 * A messaging system for requesting data.
 *
 */

var replyReducer = function replyReducer(isOnce, requests, _ref) {
  var name = _ref.name,
      callback = _ref.callback,
      context = _ref.context;

  if (requests[name]) {
    Radio.debugLog('A request was overwritten', name, this.channelName);
  }

  requests[name] = {
    callback: isOnce ? onceWrap(makeCallback(callback), this.stopReplying.bind(this, name)) : makeCallback(callback),
    context: context || this
  };
  return requests;
};

var stopReducer = function stopReducer(requests, _ref2) {
  var _this = this;

  var name = _ref2.name,
      callback = _ref2.callback,
      context = _ref2.context;
  var names = name ? [name] : keys(requests);
  each(names, function (key) {
    var handler = requests[key]; // Bail out if there are no events stored.

    if (!handler || callback && callback !== handler.callback && callback !== handler.callback._callback || context && context !== handler.context) {
      Radio.debugLog('Attempted to remove the unregistered request', name, _this.channelName);
      return;
    }

    delete requests[key];
  });
  return requests;
};

var Requests = {
  // Set up a handler for a request
  reply: function reply(name, callback, context) {
    var eventArgs = buildEventArgs(name, callback, context);
    this._requests = reduce(eventArgs, replyReducer.bind(this, false), this._requests || {});
    return this;
  },
  // Set up a handler that can only be requested once
  replyOnce: function replyOnce(name, callback, context) {
    var eventArgs = buildEventArgs(name, callback, context);
    this._requests = reduce(eventArgs, replyReducer.bind(this, true), this._requests || {});
    return this;
  },
  // Remove handler(s)
  stopReplying: function stopReplying(name, callback, context) {
    if (!this._requests) return this;

    if (!name && !callback && !context) {
      delete this._requests;
      return this;
    }

    var eventArgs = buildEventArgs(name, callback, context);
    this._requests = reduce(eventArgs, stopReducer.bind(this), this._requests || {});
    return this;
  },
  // Make a request
  request: function request(name) {
    var _this2 = this;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (name && _typeof(name) === 'object') {
      return reduce(keys(name), function (replies, key) {
        var result = _this2.request(key, name[key]);

        eventSplitter.test(key) ? extend(replies, result) : replies[key] = result;
        return replies;
      }, {});
    }

    if (name && eventSplitter.test(name)) {
      return reduce(name.split(eventSplitter), function (replies, n) {
        replies[n] = _this2.request.apply(_this2, [n].concat(_toConsumableArray(args)));
        return replies;
      }, {});
    }

    var channelName = this.channelName;
    var requests = this._requests; // Check if we should log the request, and if so, do it

    if (channelName && this._tunedIn) {
      Radio.log.apply(this, [channelName, name].concat(args));
    } // If the request isn't handled, log it in DEBUG mode and exit


    if (requests && (requests[name] || requests['default'])) {
      var handler = requests[name] || requests['default'];
      args = requests[name] ? args : arguments;
      return callHandler(handler.callback, handler.context, args);
    }

    Radio.debugLog('An unhandled request was fired', name, channelName);
  }
};

var Radio = {};
Radio.VERSION = '<%= version %>'; // Whether or not we're in DEBUG mode or not. DEBUG mode helps you
// get around the issues of lack of warnings when events are mis-typed.

Radio.DEBUG = false; // Format debug text.

function debugText(warning, eventName, channelName) {
  return warning + (channelName ? " on the ".concat(channelName, " channel") : '') + ": \"".concat(eventName, "\"");
} // This is the method that's called when an unregistered event was called.
// By default, it logs warning to the console. By overriding this you could
// make it throw an Error, for instance. This would make firing a nonexistent event
// have the same consequence as firing a nonexistent method on an Object.


Radio.debugLog = function (warning, eventName, channelName) {
  if (Radio.DEBUG && console && console.warn) {
    console.warn(debugText(warning, eventName, channelName));
  }
};
/*
 * tune-in
 * -------
 * Get console logs of a channel's activity
 *
 */


var _logs = {}; // This is to produce an identical function in both tuneIn and tuneOut,
// so that Backbone.Events unregisters it.

function _partial(channelName) {
  return _logs[channelName] || (_logs[channelName] = Radio.log.bind(Radio, channelName));
}

extend(Radio, {
  // Log information about the channel and event
  log: function log(channelName, eventName) {
    if (typeof console === 'undefined') {
      return;
    }

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    console.log("[".concat(channelName, "] \"").concat(eventName, "\""), args);
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
  }

  return Radio._channels[channelName] = new Radio.Channel(channelName);
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

extend(Radio.Channel.prototype, Events, Requests, {
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

each([Events, Requests], function (system) {
  each(keys(system), function (methodName) {
    Radio[methodName] = function (channelName) {
      var channel = this.channel(channelName);

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return callHandler(channel[methodName], channel, args);
    };
  });
});

Radio.reset = function (channelName) {
  var channels = !channelName ? this._channels : [this._channels[channelName]];
  each(channels, function (channel) {
    channel.reset();
  });
};

export default Radio;
export { Events, Requests };
