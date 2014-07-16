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

  _eventsApi: function(obj, action, name, rest) {
    if (!name) {
      return true;
    }

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    return true;
  },

  channel: function(channelName) {
    if (!channelName) {
      throw new Error('You must provide a name for the channel.');
    }
    return Radio._channels[channelName] || new Radio.Channel(channelName);
  }
});
