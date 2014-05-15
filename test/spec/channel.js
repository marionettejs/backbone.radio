describe('Upon creation, a Channel', function() {
  var channel, channelName, name = 'test',
  eventKeys, requestKeys, commandKeys, channelKeys,
  eventIntersect, requestIntersect, commandIntersect;

  beforeEach(function() {
    channel = new Backbone.Radio.Channel(name);
    channelName = channel.channelName;

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
