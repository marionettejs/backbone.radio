import { once, reduce, keys } from 'underscore';

// Regular expression used to split event strings.
const eventSplitter = /\s+/;

// Iterates over the standard `event, callback` (as well as the fancy multiple
// space-separated events `"change blur", callback` and jQuery-style event
// maps `{event: callback}`).
function buildEventArgs (name, callback, context, listener) {
  if (name && typeof name === 'object') {
    return reduce(keys(name), (eventArgs, key) => {
      return eventArgs.concat(buildEventArgs(key, name[key], context || callback, listener));
    }, []);
  }

  if (name && eventSplitter.test(name)) {
    return reduce(name.split(eventSplitter), (eventArgs, n) => {
      eventArgs.push({ name: n, callback, context, listener } );
      return eventArgs;
    }, []);
  }

  return [{ name, callback, context, listener }];
}

// An optimized way to execute callbacks.
function callHandler(callback, context, args) {
  switch (args.length) {
    case 0: return callback.call(context);
    case 1: return callback.call(context, args[0]);
    case 2: return callback.call(context, args[0], args[1]);
    case 3: return callback.call(context, args[0], args[1], args[2]);
    default: return callback.apply(context, args);
  }
}

// If callback is not a function return the callback and flag it for removal
function makeCallback(callback) {
  if (typeof callback === 'function') {
    return callback;
  }
  const result = function() { return callback; };
  result._callback = callback;
  return result;
}


// Wrap callback in a once. Returns for requests
// `offCallback` unbinds the `onceWrapper` after it has been called.
function onceWrap(callback, offCallback) {
  const onceCallback = once(function() {
    offCallback(onceCallback);
    return callback.apply(this, arguments);
  });

  onceCallback._callback = callback;

  return onceCallback;
}

export {
  buildEventArgs,
  callHandler,
  eventSplitter,
  makeCallback,
  onceWrap,
};
