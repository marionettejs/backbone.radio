describe('When executing Commands methods from the top-level API', function() {
  var channel, channelName = 'global', actionName = 'some:action',
  reactStub, reactOnceStub, stopReactingStub, commandStub;

  beforeEach(function() {
    channel = Backbone.Radio.channel(channelName);

    reactStub = sinon.stub(channel, 'react');
    reactOnceStub = sinon.stub(channel, 'reactOnce');
    stopReactingStub = sinon.stub(channel, 'stopReacting');
    commandStub = sinon.stub(channel, 'command');

    Backbone.Radio.react(channelName, actionName, true, '1234');
    Backbone.Radio.reactOnce(channelName, actionName, false, '4321');
    Backbone.Radio.stopReacting(channelName, actionName, 'three', 'four');
    Backbone.Radio.command(channelName, actionName, 'ok', 'notOk');
  });

  afterEach(function() {
    reactStub.restore();
    reactOnceStub.restore();
    stopReactingStub.restore();
    commandStub.restore();
    channel.reset();
  });

  it('should execute each method on the proper channel.', function() {
    expect(reactStub).to.have.been.calledOnce;
    expect(reactOnceStub).to.have.been.calledOnce;
    expect(stopReactingStub).to.have.been.calledOnce;
    expect(commandStub).to.have.been.calledOnce;
  });

  it('should pass along the arguments.', function() {
    expect(reactStub).to.have.always.been.calledWithExactly(true, '1234');
    expect(reactOnceStub).to.have.always.been.calledWithExactly(false, '4321');
    expect(stopReactingStub).to.have.always.been.calledWithExactly('three', 'four');
    expect(commandStub).to.have.always.been.calledWithExactly('ok', 'notOk');
  });
});

describe('When executing Requests methods from the top-level API', function() {
  var channel, channelName = 'global', requestName = 'some:request',
  respondStub, respondOnceStub, stopRespondingStub, requestStub;

  beforeEach(function() {
    channel = Backbone.Radio.channel(channelName);

    respondStub = sinon.stub(channel, 'respond');
    respondOnceStub = sinon.stub(channel, 'respondOnce');
    stopRespondingStub = sinon.stub(channel, 'stopResponding');
    requestStub = sinon.stub(channel, 'request');

    Backbone.Radio.respond(channelName, requestName, true, '1234');
    Backbone.Radio.respondOnce(channelName, requestName, false, '4321');
    Backbone.Radio.stopResponding(channelName, requestName, 'three', 'four');
    Backbone.Radio.request(channelName, requestName, 'ok', 'notOk');
  });

  afterEach(function() {
    respondStub.restore();
    respondOnceStub.restore();
    stopRespondingStub.restore();
    requestStub.restore();
    channel.reset();
  });

  it('should execute each method on the proper channel.', function() {
    expect(respondStub).to.have.been.calledOnce;
    expect(respondOnceStub).to.have.been.calledOnce;
    expect(stopRespondingStub).to.have.been.calledOnce;
    expect(requestStub).to.have.been.calledOnce;
  });

  it('should pass along the arguments.', function() {
    expect(respondStub).to.have.always.been.calledWithExactly(true, '1234');
    expect(respondOnceStub).to.have.always.been.calledWithExactly(false, '4321');
    expect(stopRespondingStub).to.have.always.been.calledWithExactly('three', 'four');
    expect(requestStub).to.have.always.been.calledWithExactly('ok', 'notOk');
  });
});

describe('When executing Events methods from the top-level API', function() {
  var channel, channelName = 'global', eventName = 'some:event',
  listenToStub, listenToOnceStub, stopListeningStub, triggerStub,
  onStub, onceStub, offStub;

  beforeEach(function() {
    channel = Backbone.Radio.channel(channelName);

    listenToStub = sinon.stub(channel, 'listenTo');
    listenToOnceStub = sinon.stub(channel, 'listenToOnce');
    stopListeningStub = sinon.stub(channel, 'stopListening');
    triggerStub = sinon.stub(channel, 'trigger');
    onStub = sinon.stub(channel, 'on');
    onceStub = sinon.stub(channel, 'once');
    offStub = sinon.stub(channel, 'off');

    Backbone.Radio.listenTo(channelName, eventName, true, '1234');
    Backbone.Radio.listenToOnce(channelName, eventName, false, '4321');
    Backbone.Radio.stopListening(channelName, eventName, 'three', 'four');
    Backbone.Radio.trigger(channelName, eventName, 'ok', 'notOk');
    Backbone.Radio.on(channelName, eventName, 'test', 'testpls');
    Backbone.Radio.once(channelName, eventName, 'food', 'isGood');
    Backbone.Radio.off(channelName, eventName, 'sleep', 'isNice');
  });

  afterEach(function() {
    listenToStub.restore();
    listenToOnceStub.restore();
    stopListeningStub.restore();
    triggerStub.restore();
    onStub.restore();
    onceStub.restore();
    offStub.restore();
    channel.reset();
  });

  it('should execute each method on the proper channel.', function() {
    expect(listenToStub).to.have.been.calledOnce;
    expect(listenToOnceStub).to.have.been.calledOnce;
    expect(stopListeningStub).to.have.been.calledOnce;
    expect(triggerStub).to.have.been.calledOnce;
    expect(onStub).to.have.been.calledOnce;
    expect(onceStub).to.have.been.calledOnce;
    expect(offStub).to.have.been.calledOnce;
  });

  it('should pass along the arguments.', function() {
    expect(listenToStub).to.have.always.been.calledWithExactly(true, '1234');
    expect(listenToOnceStub).to.have.always.been.calledWithExactly(false, '4321');
    expect(stopListeningStub).to.have.always.been.calledWithExactly('three', 'four');
    expect(triggerStub).to.have.always.been.calledWithExactly('ok', 'notOk');
    expect(onStub).to.have.always.been.calledWithExactly('test', 'testpls');
    expect(onceStub).to.have.always.been.calledWithExactly('food', 'isGood');
    expect(offStub).to.have.always.been.calledWithExactly('sleep', 'isNice');
  });
});
