/*
 * tune-in
 * -------
 * Get console logs of a channel's activity
 *
 */

/**
 * @file Get console logs of a channel's activity
 */

var _logs = {};

/**
 * This is to produce an identical function in both tuneIn and tuneOut, so that
 * Backbone.Events unregisters it.
 * @private
 * @param  {String}   channelName
 * @return {Function} log
 */
function _partial(channelName) {
  return _logs[channelName] || (_logs[channelName] = _.partial(Radio.log, channelName));
}

_.extend(Radio, {

  /**
   * Log information about the channel and event
   * @method
   * @param {String} channelName
   * @param {String} eventName
   * @param {}       [args...]
   */
  log: function(channelName, eventName) {
    var args = slice.call(arguments, 2);
    console.log('[' + channelName + '] "' + eventName + '"', args);
  },

  /**
   * Logs all events on this channel to the console. It sets an
   * internal value on the channel telling it we're listening,
   * then sets a listener on the Backbone.Events
   * @method
   * @param  {String} channelName
   * @return this
   */
  tuneIn: function(channelName) {
    var channel = Radio.channel(channelName);
    channel._tunedIn = true;
    channel.on('all', _partial(channelName));
    return this;
  },

  /**
   * Stop logging all of the activities on this channel to the console
   * @method
   * @param  {String} channelName
   * @return this
   */
  tuneOut: function(channelName) {
    var channel = Radio.channel(channelName);
    channel._tunedIn = false;
    channel.off('all', _partial(channelName));
    delete _logs[channelName];
    return this;
  }
});
