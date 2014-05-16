/*
 * Backbone.Radio.Channel
 * ----------------------
 * A Channel is an object that extends from Backbone.Events,
 * Radio.Commands, and Radio.Requests. 
 *
 */

Radio.Channel = function(channelName) {
  this._channelName = channelName;
  _.extend(this, Backbone.Events, Radio.Commands, Radio.Requests);
};

_.extend(Radio.Channel.prototype, {

  // Remove all handlers from the messaging systems of this channel
  reset: function() {
    this.off();
    this.stopListening();
    this.stopReacting();
    this.stopResponding();
    return this;
  }
});

function _connect(methodName, hash, context) {
  if ( !hash ) { return; }
  context = context || this;
  _.each(hash, function(fn, eventName) {
    this[methodName](eventName, _.bind(fn, context));
  }, this);
}

var map = {
  Events:   'on',
  Commands: 'react',
  Requests: 'respond'
};

_.each(map, function(methodName, systemName) {
  var connectName = 'connect'+ systemName;
  Radio.Channel.prototype[connectName] = _.partial(_connect, methodName);
});
