# Backbone.Radio

[![Travis Build Status](http://img.shields.io/travis/jmeas/backbone.radio.svg?style=flat)](https://travis-ci.org/jmeas/backbone.radio)
[![Coverage Status](https://img.shields.io/coveralls/jmeas/backbone.radio.svg?style=flat)](https://coveralls.io/r/jmeas/backbone.radio)
[![Gitter chat room](https://img.shields.io/badge/gitter-backbone.radio-brightgreen.svg?style=flat)](https://gitter.im/jmeas/backbone.radio)

Use Backbone.Radio to build large, maintainable, and decoupled applications.

Backbone.Radio is a collection of messaging patterns for Backbone applications. It uses Backbone.Events as a
pub-sub message bus, then adds semantics to your communications through the addition of two new messaging
patterns, Commands and Requests. The three systems are bound together as Channels, which provide explicit
namespacing to your communications.

## Installation

Clone this repository or install via [Bower](http://bower.io/) or [npm](https://www.npmjs.org/).

```
bower install backbone.radio
npm install backbone.radio
```

## Getting Started

### Backbone.Events

Anyone who has used Backbone should be quite familiar with Backbone.Events. Backbone.Events is what facilitates
communications between objects in your application. The quintessential example of this is listening in on a
Model's change event.

```js
// Listen in on a model's change events
this.listenTo(someModel, 'change', myCallback);

// Later on, the model triggers a change event when it has been changed
someModel.trigger('change');
```

Let's look at a diagram for Backbone.Events:

<p align='center'>
  <img src='https://i.cloudup.com/u9oC3S1LxE.svg' alt='Backbone.Events diagram'>
</p>

It goes without saying that Backbone.Events is incredibly useful when you mix it into instances of Classes. But what
if you had a standalone Object with an instance of Backbone.Events on it? This gives you a powerful message bus to utilize.

```js
// Create a message bus
var myBus = _.extend({}, Backbone.Events);

// Listen in on the message bus
this.listenTo(myBus, 'some:event', myCallback);

// Trigger an event on the bus
myBus.trigger('some:event');
```

This is the first principle of Backbone.Radio: building a message bus out of Backbone.Events is useful. But before we go more
into that, let's look at the two other messaging systems of Backbone.Radio.

### Backbone.Radio.Commands

Commands is similar to Backbone.Events in many ways. You can mix it into your objects, or use it as a standalone message
bus.

```js
// You should be familiar with attaching Backbone.Events to an object...
_.extend(myObj, Backbone.Events);

// Well, attaching Commands is identical
_.extend(myObj, Backbone.Radio.Commands);
```

Once you've attached Commands to your object your object will now have access to the Commands API.

The next question, then, is what *are* Commands? Commands are a semantic implementation of Backbone.Events. One of the primary
differences between Backbone.Events and Commands is that Commands have **intent**, whereas Events do not. For example, when a model triggers its
change event, it has no goal in mind. Instead, the listeners of that event decide what to do with that information. Commands are different.
You fire a Command when you do have a goal in mind. And to be even more specific, you fire a Command when you want another object to perform a
particular task.

```js
// Set up a view to comply with a command
myView.comply('render', myView.render);

// Causes the view to render
myView.command('render');
```

Commands have a few other things that make it distinct from Backbone.Events. First, you can only register one 'listener' at a time, unlike
Backbone.Events where there can be many listeners for each trigger. Instead, Commands is a one-to-one relationship. Another difference is that
no information is returned from the executed callback. This is also unlike Events, where information can travel from the triggerer to its listeners.

The following diagram illustrates the Commands pattern:

<p align='center'>
  <img src='https://i.cloudup.com/7e9M5rKFOr.svg' alt='Backbone.Commands diagram'>
</p>

You might ask yourself, 'Now why in the world would I fire the command when I can
just call the method directly?' The answer is that you wouldn't. I only meant for the above example to be used as a means to familiarize yourself
with the way Commands works. The real utility of Commands comes when it is used in an independent message bus. But more on that later – let's
first look at Requests.

### Backbone.Radio.Requests

Requests is the last piece of Backbone.Radio. You use it just like Events and Commands: mix it into an object.

```js
_.extend(myObj, Backbone.Radio.Requests);
```

Requests share more similarities to Commands than they do Events. They are semantic, by which I mean that there is an intention when making a
request. Of course, the intent here is that you are asking for information to be returned. Just like Commands, requests have a one-to-one system;
you can't have multiple 'listeners' to the triggerer.

Let's look at a basic example.

```js
// Set up an object to reply to a request. In this case, whether or not its visible.
myView.reply('visible', this.isVisible);

// Get whether it's visible or not.
var isViewVisible = myView.request('visible');
```

The handler in `reply` can either return a flat value, like `true` or `false`, or a function to be executed. Either way, the value is sent back to
the requester.

Here's a diagram of the Requests pattern:

<p align='center'>
  <img src='https://i.cloudup.com/tEVU_tuRIX.svg' alt='Backbone.Requests diagram'>
</p>

### Channels

The real draw of Backbone.Radio are channels. A Channel is simply an object that has Backbone.Events, Radio.Commands, and Radio.Requests mixed into it;
it's a standalone message bus comprised of all three systems.

Getting a handle of a Channel is easy.

```js
// Get a reference to the channel named 'global'
var globalChannel = Backbone.Radio.channel('global');
```

Once you've got a channel, you can attach handlers to it.

```js
globalChannel.on('some:event', function() {
  console.log('An event has happened!');
});

globalChannel.comply('some:action', function() {
  console.log('I was told to execute some action');
});

globalChannel.reply('some:request', function() {
  return 'food is good';
});
```

You can also use the 'trigger' methods on the Channel.

```js
globalChannel.trigger('some:event');

globalChannel.command('some:command');

globalChannel.request('some:request');
```

You can have as many channels as you'd like

```js
// Maybe you have a channel for the profile section of your app
var profileChannel = Backbone.Radio.channel('profile');

// And another one for settings
var settingsChannel = Backbone.Radio.channel('settings');
```

The whole point of Channels is that they provide a way to explicitly namespace events in your application. It gives you greater
control over which objects are able to talk to one another.

If you're having difficulty remembering the API of Channels here's a useful mnemonic for you.

Events is the API that you know; `on`, `off`, `stopListening` and so on. Commands, which starts with a C, only
uses verbs that start with C: `command`, `comply`, `stopComplying`. And lastly, Requests, which starts with an R,
only uses verbs that start with R: `request`, `reply`, and so on.

## API

### Commands

##### `command( commandName [, args...] )`

Order a command to be completed. Optionally pass arguments to send along to the callback. Like Backbone.Event's `trigger` method,
this method returns the instance of Commands.

##### `comply( commandName, callback [, context] )`

Register a handler for `commandName` on this object. `callback` will be executed whenever the command is run. Optionally
pass a `context` for the callback, defaulting to `this`.

Returns the instance of Commands.

##### `complyOnce( commandName, callback [, context] )`

Register a handler for `commandName` that only executes a single time.

Returns the instance of Commands.

##### `stopComplying( [commandName] )`

If `commandName` is passed then that handler is removed from the object. Otherwise, all handlers are removed.

Returns the instance of Commands.

### Requests

##### `request( requestName [, args...] )`

Make a request for `requestName`. Optionally pass arguments to send along to the callback. Returns the reply, if one
exists. If there is no request then `undefined` will be returned.

##### `reply( requestName, callback [, context] )`

Register a handler for `requestName` on this object. `callback` will be executed whenever the request is made. Optionally
pass a `context` for the callback, defaulting to `this`.

Returns the instance of Requests.

##### `replyOnce( requestName, callback [, context] )`

Register a handler for `requestName` that will only be called a single time.

Returns the instance of Requests.

##### `stopReplying( [requestName] )`

If `requestName` is passed then this method will remove that reply. Otherwise, all replies are removed from the object.

Returns the instance of Requests.

### Channel

##### `reset`

Destroy all handlers from Backbone.Events, Radio.Commands, and Radio.Requests from the channel. Returns the channel.

##### `connectEvents( eventsHash )`

A convenience method for connecting a hash of events to the channel. Returns the
channel.

```js
// Set up a hash of events
var eventsHash = {
  'some:event': myCallback,
  'some:other:event': someOtherCallback
};

// Connect all of the events at once
myChannel.connectEvents(eventsHash);
```

##### `connectCommands( commandsHash )`

A convenience method for connecting a hash of Commands handles to the channel. Returns the channel.

##### `connectRequests( requestsHash )`

A convenience method for connecting a hash of Requests replies to the channel. Returns the channel.

### Radio

##### `channel( channelName )`

Get a reference to a channel by name. If a name is not provided an Error will be thrown.

```js
var globalChannel = Backbone.Radio.channel('hello');
```

##### `DEBUG`

This is a Boolean property. Setting it to `true` will cause console warnings to be issued
whenever you interact with a `request` or `command` that isn't registered. This is useful in development when you want to
ensure that you've got your event names in order.

```js
// Turn on debug mode
Backbone.Radio.DEBUG = true;

// This will log a warning to the console if it goes unhandled
myChannel.command('show:view');

// Likewise, this will too, helping to prevent memory leaks
myChannel.stopReplying('startTime');
```

##### `tuneIn( channelName )`

Tuning into a Channel is another useful tool for debugging. It passes all
triggers, commands, and requests made on the channel to
[`Radio.log`](https://github.com/jmeas/backbone.radio/blob/tune-in/README.md#log-channelname-eventname--args-).
Returns `Backbone.Radio`.

```js
Backbone.Radio.tuneIn('calendar');
```

##### `tuneOut( channelName )`

Once you're done tuning in you can call `tuneOut` to stop the logging. Returns `Backbone.Radio`.

```js
Backbone.Radio.tuneOut('calendar');
```

##### `log( channelName, eventName [, args...] )`

When tuned into a Channel, this method will be called for all activity on
a channel. The default implementation is to `console.log` the following message:

```js
'[channelName] "eventName" args1 arg2 arg3...'
```

where args are all of the arguments passed with the message. It is exposed so that you
may overwrite it with your own logging message if you wish.

### 'Top-level' API

If you'd like to execute a method on a channel, yet you don't need to keep a handle of the channel around, you can do so with the proxy
functions directly on the `Backbone.Radio` object.

```js
// Trigger 'some:event' on the global channel
Backbone.Radio.trigger('global', 'some:event');
```

All of the methods for all three messaging systems are available from the top-level API.
