# Backbone.Radio

[![Travis Build Status](https://api.travis-ci.org/jmeas/backbone.radio.png)](https://travis-ci.org/jmeas/backbone.radio)

Backbone.Radio is a messaging system for Backbone applications. It takes the precedent
set by Backbone.Events to build a sophisticated pub-sub system. It accomplishes this by
introducing two new messaging systems, Commands and Requests, which add a semantic layer
to your communications. It then adds the popular concept of a messaging Channel to bind the
three systems together.

## Getting Started

### Backbone.Events

Anyone who has used Backbone should be quite familiar with Backbone.Events. Backbone.Events is what facilitates
communications between objects in your application. The quintessential example of this is listening in on a
Model's change event.

```js
// Listen in on a model's change events
this.listenTo(someModel, 'change', myCallback);
```

It goes without saying that Backbone.Events is incredibly useful when you mix it into instances of Classes. But what
if you had a standalone Object with an instance of Backbone.Events on it? If you were to do this, you will find yourself
with a powerful message bus.

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
// Set up a view to react to a command
myView.react('render', myView.render);

// Causes the view to render
myView.command('render');
```

Commands have a few other things that make it distinct from Backbone.Events. First, you can only register one 'listener' at a time, unlike
Backbone.Events where there can be many listeners for each trigger. Instead, Commands is a one-to-one relationship. Another difference is that
no information is returned from the executed callback. This is also unlike Events, where information can travel from the triggerer to its listeners.

Anyway, the example I showed above is a bit contrived. You might ask yourself, 'Now why in the world would I fire the command when I can
just call the method directly?' The answer is that you wouldn't. I only meant for that example to be used as a means to familiarize yourself
with the way Commands works. The real utility of Commands comes when it is used in an independent message bus. But more on that later – let's
first look at Requests.

### Backbone.Radio.Requests

Requests is the last piece of Backbone.Radio. You use it just like Events and Commands: mix it into an object.

```js
_.extend(myObj, Backbone.Radio.Requests);
```

Requests share more similarities to Commands than they do Events. They are semantic, by which I mean that an intent is conveyed when making a
request. Of course, the intent here is that you are asking for information to be returned. Just like Commands, requests have a one-to-one system;
you can't have multiple 'listeners' to the triggerer.

Let's look at a basic example.

```js
// Set up an object to respond to a request. In this case, whether or not its visible.
myView.respond('visible', this.isVisible);

// Get whether it's visible or not.
var isViewVisible = myView.request('visible');
```

The handler in `respond` can either return a flat value, like `true` or `false`, or a function to be executed. Either way, the value is sent back to
the requester.

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

globalChannel.react('some:action', function() {
  console.log('I was told to execute some action');
});

globalChannel.respond('some:request', function() {
  return 'food is good';
});
```

You can also use the 'trigger' methods on the Channel.

```js
globalChannel.trigger('some:event');

globalChannel.command('some:command');

globalCh.request('some:request');
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

### 'Top-level' API

If you'd like to execute a method on a channel, yet you don't need to keep a handle of the channel around, you can do so with the proxy
functions directly on the `Backbone.Radio` object.

```js
// Trigger 'some:event' on the global channel
Backbone.Radio.trigger('global', 'some:event');
```

All of the methods for all three messaging systems are available from the top-level API.
