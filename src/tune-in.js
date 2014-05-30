/*
 * tune-in
 * -------
 * Get console logs of a channel's activity
 *
 */

var _logs = {};

// This is to produce an identical function in both tuneIn and tuneOut,
// so that Backbone.Events unregisters it.
function _partial(channelName) {
  return _logs[channelName] || (_logs[channelName] = _.partial(Radio.log, channelName));
}

_.extend(Radio, {

  // Log information about the channel and event
  log: function(channelName, eventName) {
    var args = slice.call(arguments, 2);
    console.log('[' + channelName + '] "' + eventName + '"', args);
  },

  // Logs all events on this channel to the console. It sets an
  // internal value on the channel telling it we're listening,
  // then sets a listener on the Backbone.Events
  tuneIn: function(channelName) {
    var channel = Radio.channel(channelName);
    channel._tunedIn = true;
    channel.on('all', _partial(channelName));
  },

  // Stop logging all of the activities on this channel to the console
  tuneOut: function(channelName) {
    var channel = Radio.channel(channelName);
    channel._tunedIn = false;
    channel.off('all', _partial(channelName));
    delete _logs[channelName];
  }
});
