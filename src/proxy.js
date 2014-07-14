/*
 * proxy
 * -----
 * Supplies a top-level API.
 *
 */

 var channel, args, systems = [Backbone.Events, Radio.Commands, Radio.Requests];

 _.each(systems, function(system) {
  _.each(system, function(method, methodName) {
    Radio[methodName] = function(channelName) {
      args = slice.call(arguments, 1);
      channel = this.channel(channelName);
      return channel[methodName].apply(channel, args);
    };
  });
});
