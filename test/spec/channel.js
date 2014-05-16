describe('When calling Radio.channel with no name', function() {
  var channelStub;

  beforeEach(function() {
    channelStub = sinon.spy(Backbone.Radio, 'channel');
  });

  afterEach(function() {
    channelStub.restore();
  });

  it('should throw an error', function() {
    expect(channelStub).to.throw(Error, 'You must provide a name for the channel.');
  });
});

describe('Upon creation, a Channel', function() {
  var channel, channelName, name = 'test',
  eventKeys, requestKeys, commandKeys, channelKeys,
  eventIntersect, requestIntersect, commandIntersect;

  beforeEach(function() {
    channel = new Backbone.Radio.Channel(name);
    channelName = channel._channelName;

    channelKeys = _.keys(channel);

    eventKeys = _.keys(Backbone.Events);
    requestKeys = _.keys(Backbone.Radio.Requests);
    commandKeys = _.keys(Backbone.Radio.Commands);

    eventIntersect = _.intersection(eventKeys, channelKeys);
    requestIntersect = _.intersection(requestKeys, channelKeys);
    commandIntersect = _.intersection(commandKeys, channelKeys);
  });

  it('should have its name set', function() {
    expect(channelName).to.equal(name);
  });

  it('should have all of the Backbone.Events methods', function() {
    expect(eventIntersect.length).to.equal(eventKeys.length);
  });

  it('should have all of the Radio.Commands methods', function() {
    expect(commandIntersect.length).to.equal(commandKeys.length);
  });

  it('should have all of the Radio.Requests methods', function() {
    expect(requestIntersect.length).to.equal(requestKeys.length);
  });
});

describe('Executing the `reset` method of a Channel', function() {
  
  var channel, returned,
  offStub, stopListeningStub,
  stopReactingStub, stopRespondingStub;

  beforeEach(function() {
    channel = new Backbone.Radio.Channel('test');
    offStub = sinon.stub(channel, 'off');
    stopListeningStub = sinon.stub(channel, 'stopListening');
    stopReactingStub  = sinon.stub(channel, 'stopReacting');
    stopRespondingStub  = sinon.stub(channel, 'stopResponding');

    returned = channel.reset();
  });

  afterEach(function() {
    offStub.restore();
    stopListeningStub.restore();
    stopReactingStub.restore();
    stopRespondingStub.restore();
    channel.reset();
  });

  it('should call the reset functions of Backbone.Events', function() {
    expect(offStub).to.have.been.calledOnce;
    expect(stopListeningStub).to.have.been.calledOnce;
  });

  it('should call the reset functions of Backbone.Radio.Commands', function() {
    expect(stopReactingStub).to.have.been.calledOnce;
  });

  it('should call the reset functions of Backbone.Radio.Requests', function() {
    expect(stopRespondingStub).to.have.been.calledOnce;
  });

  it('should return the Channel', function() {
    expect(returned).to.equal(channel);
  });
});

describe('When passing an event hash to `connectEvents`', function() {
  var channel, eventOne = 'one', eventTwo = 'two',
  cbOne, cbTwo, internalEvents, eventsHash;

  beforeEach(function() {
    cbOne = function() {};
    cbTwo = function() {};
    channel = Backbone.Radio.channel('test');

    eventsHash = {};
    eventsHash[eventTwo] = cbOne;
    eventsHash[eventOne] = cbTwo;

    channel.connectEvents(eventsHash);

    internalEvents = channel._events;
  });

  afterEach(function() {
    channel.reset();
  });

  it('should attach the listeners to the Channel', function() {
    expect(internalEvents).to.have.keys(eventTwo, eventOne);
  });
});

describe('When passing a commands hash to `connectCommands`', function() {
  var channel, commandOne = 'one', commandTwo = 'two',
  cbOne, cbTwo, internalCommands, commandsHash, returned;

  beforeEach(function() {
    cbOne = function() {};
    cbTwo = function() {};
    channel = Backbone.Radio.channel('test');

    commandsHash = {};
    commandsHash[commandTwo] = cbOne;
    commandsHash[commandOne] = cbTwo;

    channel.connectCommands(commandsHash);

    internalCommands = channel._commands;
  });

  afterEach(function() {
    channel.reset();
  });

  it('should attach the listeners to the Channel', function() {
    expect(internalCommands).to.have.keys(commandTwo, commandOne);
  });
});

describe('When passing a requests hash to `connectRequests`', function() {
  var channel, requestOne = 'one', requestTwo = 'two',
  cbOne, cbTwo, internalRequests, requestsHash, returned;

  beforeEach(function() {
    cbOne = function() {};
    cbTwo = function() {};
    channel = Backbone.Radio.channel('test');

    requestsHash = {};
    requestsHash[requestTwo] = cbOne;
    requestsHash[requestOne] = cbTwo;

    channel.connectRequests(requestsHash);

    internalRequests = channel._requests;
  });

  afterEach(function() {
    channel.reset();
  });

  it('should attach the listeners to the Channel', function() {
    expect(internalRequests).to.have.keys(requestTwo, requestOne);
  });
});
