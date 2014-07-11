/*
 * Backbone.Radio.Channel
 * ----------------------
 * A Channel is an object that extends from Backbone.Events,
 * Radio.Commands, and Radio.Requests.
 *
 */

Radio.Channel = function(channelName) {
  this._channelName = channelName;
  Radio._channels[channelName] = this;
};

_.extend(Radio.Channel.prototype, Backbone.Events, Radio.Commands, Radio.Requests, {

  // Remove all handlers from the messaging systems of this channel
  reset: function() {
    this.off();
    this.stopListening();
    this.stopComplying();
    this.stopReplying();
    return this;
  },

  connectEvents: function(hash, context) {
    return this._connect('on', hash, context);
  },

  connectCommands: function(hash, context) {
    return this._connect('comply', hash, context);
  },

  connectRequests: function(hash, context) {
    return this._connect('reply', hash, context);
  },

  _connect: function(methodName, hash, context) {
    if (!hash) { return; }

    _.each(hash, function(fn, eventName) {
      this[methodName](eventName, fn, context || this);
    }, this);

    return this;
  }
});
