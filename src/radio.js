/*
 * Backbone.Radio
 * --------------
 * The 'top-level' API for working with Backbone.Radio
 *
 */

_.extend(Radio, {
  _channels: {},

  DEBUG: false,

  _debugLog: function(warning, eventName, channelName) {
    if (this.DEBUG) {
      var channelText = channelName ? ' on the ' + channelName + ' channel' : '';
      console.warn(warning + channelText + ': "' + eventName + '"');
    }
  },

  channel: function(channelName) {
    if (!channelName) {
      throw new Error('You must provide a name for the channel.');
    }
    return Radio._channels[channelName] || new Radio.Channel(channelName);
  }
});
