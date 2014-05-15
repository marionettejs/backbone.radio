/*
 * Factory
 * -------
 * Generates a new messaging system by wrapping the
 * generic methods with semantic names.
 *
 */

var Factory = function(name, options) {
  var system = {};
  var container = '_'+name;
  var methodsMap = options.methodsMap;
  var returnValue = options.returnValue;

  system[methodsMap.execute] = _.partial(methods.execute, container, returnValue);
  system[methodsMap.handle] = _.partial(methods.handle, container);
  system[methodsMap.handleOnce] = _.partial(methods.handleOnce, container, methodsMap.handle, methodsMap.stopHandling);
  system[methodsMap.stopHandling] = _.partial(methods.stopHandling, container);

  return system;
};
