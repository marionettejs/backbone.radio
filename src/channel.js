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
    this.stopReplying();
    return this;
  },

  connectEvents: function(hash, context) {
    this._connect('on', hash, context);
  },

  connectCommands: function(hash, context) {
    this._connect('react', hash, context);
  },

  connectRequests: function(hash, context) {
    this._connect('reply', hash, context);
  },

  _connect: function(methodName, hash, context) {
    if (!hash) { return; }
    _.each(hash, function(fn, eventName) {
      this[methodName](eventName, _.bind(fn, context || this));
    }, this);
  }

});
