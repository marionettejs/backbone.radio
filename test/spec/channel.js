describe('When calling Radio.channel with no name', function() {
  beforeEach(function() {
    this.channelStub = this.sinon.spy(Backbone.Radio, 'channel');
  });

  it('should throw an error', function() {
    expect(this.channelStub).to.throw(Error, 'You must provide a name for the channel.');
  });
});

describe('Upon creation, a Channel', function() {
  beforeEach(function() {
    this.name = 'foobar';
    this.channel = new Backbone.Radio.Channel(this.name);

    this.channelName = this.channel._channelName;
    this.channelKeys = _.keys(this.channel);
    this.eventKeys   = _.keys(Backbone.Events);
    this.requestKeys = _.keys(Backbone.Radio.Requests);
    this.commandKeys = _.keys(Backbone.Radio.Commands);

    this.eventIntersect   = _.intersection(this.eventKeys, this.channelKeys);
    this.requestIntersect = _.intersection(this.requestKeys, this.channelKeys);
    this.commandIntersect = _.intersection(this.commandKeys, this.channelKeys);
  });

  it('should have its name set', function() {
    expect(this.channelName).to.equal(this.name);
  });

  it('should have all of the Backbone.Events methods', function() {
    expect(this.eventIntersect.length).to.equal(this.eventKeys.length);
  });

  it('should have all of the Radio.Commands methods', function() {
    expect(this.commandIntersect.length).to.equal(this.commandKeys.length);
  });

  it('should have all of the Radio.Requests methods', function() {
    expect(this.requestIntersect.length).to.equal(this.requestKeys.length);
  });
});

describe('Executing the `reset` method of a Channel', function() {
  beforeEach(function() {
    this.channel = new Backbone.Radio.Channel('foobar');

    this.offStub            = this.sinon.stub(this.channel, 'off');
    this.stopListeningStub  = this.sinon.stub(this.channel, 'stopListening');
    this.stopReactingStub   = this.sinon.stub(this.channel, 'stopReacting');
    this.stopRespondingStub = this.sinon.stub(this.channel, 'stopResponding');

    this.returned = this.channel.reset();
  });

  it('should call the reset functions of Backbone.Events', function() {
    expect(this.offStub).to.have.been.calledOnce;
    expect(this.stopListeningStub).to.have.been.calledOnce;
  });

  it('should call the reset functions of Backbone.Radio.Commands', function() {
    expect(this.stopReactingStub).to.have.been.calledOnce;
  });

  it('should call the reset functions of Backbone.Radio.Requests', function() {
    expect(this.stopRespondingStub).to.have.been.calledOnce;
  });

  it('should return the Channel', function() {
    expect(this.returned).to.equal(this.channel);
  });
});

describe('When passing an event hash to `connectEvents`', function() {
  beforeEach(function() {
    this.channel = Backbone.Radio.channel('foobar');

    this.eventFoo = 'foo';
    this.eventBar = 'bar';
    this.cbFoo = function() {};
    this.cbBar = function() {};
    this.eventsHash = {};
    this.eventsHash[this.eventFoo] = this.cbFoo;
    this.eventsHash[this.eventBar] = this.cbBar;

    this.channel.connectEvents(this.eventsHash);
    this.internalEvents = this.channel._events;
  });

  it('should attach the listeners to the Channel', function() {
    expect(this.internalEvents).to.have.keys(this.eventFoo, this.eventBar);
  });
});

describe('When passing a commands hash to `connectCommands`', function() {
  beforeEach(function() {
    this.channel = Backbone.Radio.channel('foobar');

    this.commandFoo = 'foo';
    this.commandBar = 'bar';
    this.cbFoo = function() {};
    this.cbBar = function() {};
    this.commandsHash = {};
    this.commandsHash[this.commandFoo] = this.cbFoo;
    this.commandsHash[this.commandBar] = this.cbBar;

    this.channel.connectCommands(this.commandsHash);
    this.internalCommands = this.channel._commands;
  });

  it('should attach the listeners to the Channel', function() {
    expect(this.internalCommands).to.have.keys(this.commandFoo, this.commandBar);
  });
});

describe('When passing a requests hash to `connectRequests`', function() {
  beforeEach(function() {
    this.channel = Backbone.Radio.channel('foobar');

    this.requestFoo = 'foo';
    this.requestBar = 'bar';
    this.cbFoo = function() {};
    this.cbBar = function() {};
    this.requestsHash = {};
    this.requestsHash[this.requestFoo] = this.cbFoo;
    this.requestsHash[this.requestBar] = this.cbBar;

    this.channel.connectRequests(this.requestsHash);
    this.internalRequests = this.channel._requests;
  });

  it('should attach the listeners to the Channel', function() {
    expect(this.internalRequests).to.have.keys(this.requestFoo, this.requestBar);
  });
});
