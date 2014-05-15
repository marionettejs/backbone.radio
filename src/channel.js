/*
 * Backbone.Radio.Channel
 * ----------------------
 * A Channel is an object that extends from Backbone.Events,
 * Radio.Commands, and Radio.Requests. 
 *
 */

Backbone.Radio.Channel = function(channelName) {
  this.channelName = channelName;
  _.extend(this, Backbone.Events, Radio.Commands, Radio.Requests);
};

_.extend(Backbone.Radio.Channel.prototype, {

  // Remove all handlers from the messaging systems of this channel
  reset: function() {
    this.off();
    this.stopListening();
    this.stopReacting();
    this.stopResponding();
    return this;
  }
});
