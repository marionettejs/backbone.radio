/*
 * Backbone.Radio.Commands
 * -----------------------
 * A messaging system for sending orders.
 *
 */

var commandsMap = {
  execute: 'command',
  handle: 'react',
  handleOnce: 'reactOnce',
  stopHandling: 'stopReacting'
};

Radio.Commands = new Factory('commands', {
  methodsMap: commandsMap,
  returnValue: false
});
