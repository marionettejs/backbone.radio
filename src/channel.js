/*
 * Backbone.Radio.Channel
 * ----------------------
 * A Channel is an object that extends from Backbone.Events,
 * Radio.Commands, and Radio.Requests.
 *
 */

Radio.Channel = function(channelName) {
  this.channelName = channelName;
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
  }
});
