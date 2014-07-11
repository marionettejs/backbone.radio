/*
 * Backbone.Radio.Channel
 * ----------------------
 */

/**
 * A Channel is an object that extends from Backbone.Events,
 * Radio.Commands, and Radio.Requests.
 * @constructor
 * @param {string} channelName
 * @mixes Backbone.Events
 * @mixes Commands
 * @mixes Requests
 * @see channel
 */
Radio.Channel = function(channelName) {
  this._channelName = channelName;
  _.extend(this, Backbone.Events, Radio.Commands, Radio.Requests);
  Radio._channels[channelName] = this;
};

_.extend(Radio.Channel.prototype, {

  /**
   * Destroy all handlers from Backbone.Events, Radio.Commands, and
   * Radio.Requests from the channel. Returns the channel.
   * @return this
   */
  reset: function() {
    this.off();
    this.stopListening();
    this.stopComplying();
    this.stopReplying();
    return this;
  },

  /**
   * A convenience method for connecting a hash of events to the channel.
   * @param  {Object} hash
   * @param  {Object} context
   * @return this
   * @example
   * // Connect all of the events at once
   * myChannel.connectEvents({
   *   'some:event': myCallback,
   *   'some:other:event': someOtherCallback
   * });
   */
  connectEvents: function(hash, context) {
    return this._connect('on', hash, context);
  },

  /**
   * A convenience method for connecting a hash of Commands handlers to the
   * channel.
   * @param  {Object} hash
   * @param  {Object} context
   * @return this
   * @example
   * // Connect all of the commands at once
   * myChannel.connectCommands({
   *   'some:command': myCallback,
   *   'some:other:command': someOtherCallback
   * });
   */
  connectCommands: function(hash, context) {
    return this._connect('comply', hash, context);
  },

  /**
   * A convenience method for connecting a hash of Requests replies to the
   * channel.
   * @param  {Object} hash
   * @param  {Object} context
   * @return this
   * @example
   * // Connect all of the requests at once
   * myChannel.connectRequests({
   *   'some:request': myCallback,
   *   'some:other:request': someOtherCallback
   * });
   */
  connectRequests: function(hash, context) {
    return this._connect('reply', hash, context);
  },

  /**
   * Internal method for setting up a hash of Events, Commands, or Requests on
   * the channel.
   * @protected
   * @param  {String} methodName
   * @param  {Object} hash
   * @param  {Object} context
   * @return this
   */
  _connect: function(methodName, hash, context) {
    if (!hash) { return; }

    _.each(hash, function(fn, eventName) {
      this[methodName](eventName, fn, context || this);
    }, this);

    return this;
  }
});
