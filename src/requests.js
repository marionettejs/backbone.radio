/*
 * Backbone.Radio.Requests
 * ----------------------
 * A messaging system for requesting data.
 *
 */

 var requestsMap = {
  execute: 'request',
  handle: 'respond',
  handleOnce: 'respondOnce',
  stopHandling: 'stopResponding'
};

Backbone.Radio.Requests = new Factory('requests', {
  methodsMap: requestsMap,
  returnValue: true
});
