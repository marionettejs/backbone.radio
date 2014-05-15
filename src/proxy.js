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
      args = Array.prototype.slice.call(arguments, 2);
      channel = this.channel(channelName);
      return channel[methodName].apply(this, args);
    };
  });
});
