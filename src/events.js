import { reduce, each, keys, uniqueId } from 'underscore';

import { buildEventArgs, callHandler, eventSplitter, onceWrap } from './utils';

// Events
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
const onApi = function({ events, name, callback, context, ctx, listener }) {
  const handlers = events[name] || (events[name] = []);
  handlers.push({ callback, context, ctx: context || ctx, listener });
  return events;
};

const onReducer = function(events, { name, callback, context }) {
  if (!callback) return events;
  return onApi({ events, name, callback, context, ctx: this });
}

const onceReducer = function(events, { name, callback, context }) {
  if (!callback) return events;
  const onceCallback = onceWrap(callback, this.off.bind(this, name));
  return onApi({ events, name, callback: onceCallback, context, ctx: this });
}

const cleanupListener = function({ obj, listeneeId, listenerId, listeningTo }) {
  delete listeningTo[listeneeId];
  delete obj._listeners[listenerId];
};

// The reducing API that removes a callback from the `events` object.
const offReducer = function(events , { name, callback, context }) {
  const names = name ? [name] : keys(events);

  each(names, key => {
    const handlers = events[key];

    // Bail out if there are no events stored.
    if (!handlers) return;

      // Find any remaining events.
    events[key] = reduce(handlers, (remaining, handler) => {
      if (
        callback && callback !== handler.callback &&
          callback !== handler.callback._callback ||
            context && context !== handler.context
      ) {
        remaining.push(handler);
        return remaining;
      }

      // If not including event, clean up any related listener
      if (handler.listener) {
        const listener = handler.listener;
        listener.count--;
        if (!listener.count) cleanupListener(listener);
      }

      return remaining;
    }, []);

    if (!events[key].length) delete events[key];
  });

  return events;
};

const getListener = function(obj, listenerObj) {
  const listeneeId = obj._listenId || (obj._listenId = uniqueId('l'));
  obj._events = obj._events || {};
  const listeningTo = listenerObj._listeningTo || (listenerObj._listeningTo = {});
  const listener = listeningTo[listeneeId];

  // This listenerObj is not listening to any other events on `obj` yet.
  // Setup the necessary references to track the listening callbacks.
  if (!listener) {
    const listenerId = listenerObj._listenId || (listenerObj._listenId = uniqueId('l'));
    listeningTo[listeneeId] = {obj, listeneeId, listenerId, listeningTo, count: 0};

    return listeningTo[listeneeId];
  }

  return listener;
}

const listenToApi = function({ name, callback, context, listener }) {
  if (!callback) return;

  const { obj, listenerId } = listener;
  const listeners = obj._listeners || (obj._listeners = {});
  obj._events = onApi({ events: obj._events, name, callback, context, listener });
  listeners[listenerId] = listener;
  listener.count++;

  // Call `on` for interop
  obj.on(name, callback, context, { _internal: true });
};

const listenToOnceApi = function({ name, callback, context, listener }) {
  if (!callback) return;
  const offCallback = this.stopListening.bind(this, listener.obj, name);
  const onceCallback = onceWrap(callback, offCallback);
  listenToApi({ name, callback: onceCallback, context, listener });
};

// Handles triggering the appropriate event callbacks.
const triggerApi = function({ events, name, args }) {
  const objEvents = events[name];
  const allEvents = (objEvents && events.all) ? events.all.slice() : events.all;
  if (objEvents) triggerEvents(objEvents, args);
  if (allEvents) triggerEvents(allEvents, [name].concat(args));
};

// A difficult-to-believe, but optimized internal dispatch function for
// triggering events. Tries to keep the usual cases speedy (most internal
// Backbone events have 3 arguments).
const triggerEvents = function(events, args) {
  each(events, ({ callback, ctx }) => {
    callHandler(callback, ctx, args);
  });
};

export default {

  // Bind an event to a `callback` function. Passing `"all"` will bind
  // the callback to all events fired.
  on(name, callback, context, opts) {
    if (opts && opts._internal) return;

    const eventArgs = buildEventArgs(name, callback, context);
    this._events = reduce(eventArgs, onReducer.bind(this), this._events || {});

    return this;
  },

  // Remove one or many callbacks. If `context` is null, removes all
  // callbacks with that function. If `callback` is null, removes all
  // callbacks for the event. If `name` is null, removes all bound
  // callbacks for all events.
  off(name, callback, context, opts) {
    if (!this._events) return this;
    if (opts && opts._internal) return;

    // Delete all event listeners and "drop" events.
    if (!name && !context && !callback) {
      this._events = void 0;
      const listeners = this._listeners;
      each(keys(listeners), listenerId => {
        cleanupListener(listeners[listenerId]);
      });
      return this;
    }

    const eventArgs = buildEventArgs(name, callback, context);

    this._events = reduce(eventArgs, offReducer, this._events);

    return this;
  },

  // Bind an event to only be triggered a single time. After the first time
  // the callback is invoked, its listener will be removed. If multiple events
  // are passed in using the space-separated syntax, the handler will fire
  // once for each event, not once for a combination of all events.
  once(name, callback, context) {
    const eventArgs = buildEventArgs(name, callback, context);

    this._events = reduce(eventArgs, onceReducer.bind(this), this._events || {})

    return this;
  },

  // Inversion-of-control versions of `on`. Tell *this* object to listen to
  // an event in another object... keeping track of what it's listening to
  // for easier unbinding later.
  listenTo(obj, name, callback) {
    if (!obj) return this;

    const listener = getListener(obj, this);
    const eventArgs = buildEventArgs(name, callback, this, listener);
    each(eventArgs, listenToApi);

    return this;
  },

  // Inversion-of-control versions of `once`.
  listenToOnce(obj, name, callback) {
    if (!obj) return this;

    const listener = getListener(obj, this);
    const eventArgs = buildEventArgs(name, callback, this, listener);
    each(eventArgs, listenToOnceApi.bind(this));

    return this;
  },

  // Tell this object to stop listening to either specific events ... or
  // to every object it's currently listening to.
  stopListening(obj, name, callback) {
    const listeningTo = this._listeningTo;
    if (!listeningTo) return this;

    const eventArgs = buildEventArgs(name, callback, this);

    const listenerIds = obj ? [obj._listenId] : keys(listeningTo);
    for (let i = 0; i < listenerIds.length; i++) {
      const listener = listeningTo[listenerIds[i]];

      // If listening doesn't exist, this object is not currently
      // listening to obj. Break out early.
      if (!listener) break;

      each(eventArgs, args => {
        const listenToObj = listener.obj;
        const events = listenToObj._events;

        if (!events) return;

        listenToObj._events = offReducer(events, args);

        // Call `off` for interop
        listenToObj.off(args.name, args.callback, this, { _internal: true });
      });
    }

    return this;
  },

  // Trigger one or many events, firing all bound callbacks. Callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  trigger(name, ...args) {
    if (!this._events) return this;

    if (name && typeof name === 'object') {
      each(keys(name), key => {
        triggerApi({
          events: this._events,
          name: key,
          args: [name[key]],
        });
      });
    }

    if (name && eventSplitter.test(name)) {
      each(name.split(eventSplitter), n => {
        triggerApi({
          events: this._events,
          name: n,
          args,
        });
      });
      return this;
    }

    triggerApi({
      events: this._events,
      name,
      args,
    });

    return this;
  },
};