describe('When executing Commands methods from the top-level API', function() {
  beforeEach(function() {
    this.channelName = 'foobar';
    this.actionName = 'foo:request';
    this.channel = Backbone.Radio.channel(this.channelName);

    this.reactStub        = this.sinon.stub(this.channel, 'react');
    this.reactOnceStub    = this.sinon.stub(this.channel, 'reactOnce');
    this.stopReactingStub = this.sinon.stub(this.channel, 'stopReacting');
    this.commandStub      = this.sinon.stub(this.channel, 'command');

    Backbone.Radio.react(this.channelName, this.actionName, 'foo1', 'bar1');
    Backbone.Radio.reactOnce(this.channelName, this.actionName, 'foo2', 'bar2');
    Backbone.Radio.stopReacting(this.channelName, this.actionName, 'foo3', 'bar3');
    Backbone.Radio.command(this.channelName, this.actionName, 'foo4', 'bar4');
  });

  it('should execute each method on the proper channel.', function() {
    expect(this.reactStub).to.have.been.calledOnce;
    expect(this.reactOnceStub).to.have.been.calledOnce;
    expect(this.stopReactingStub).to.have.been.calledOnce;
    expect(this.commandStub).to.have.been.calledOnce;
  });

  it('should pass along the arguments.', function() {
    expect(this.reactStub).to.have.always.been.calledWithExactly('foo1', 'bar1');
    expect(this.reactOnceStub).to.have.always.been.calledWithExactly('foo2', 'bar2');
    expect(this.stopReactingStub).to.have.always.been.calledWithExactly('foo3', 'bar3');
    expect(this.commandStub).to.have.always.been.calledWithExactly('foo4', 'bar4');
  });
});

describe('When executing Requests methods from the top-level API', function() {
  beforeEach(function() {
    this.channelName = 'foobar';
    this.requestName = 'foo:request';
    this.channel = Backbone.Radio.channel(this.channelName);

    this.respondStub        = this.sinon.stub(this.channel, 'respond');
    this.respondOnceStub    = this.sinon.stub(this.channel, 'respondOnce');
    this.stopRespondingStub = this.sinon.stub(this.channel, 'stopResponding');
    this.requestStub        = this.sinon.stub(this.channel, 'request');

    Backbone.Radio.respond(this.channelName, this.requestName, 'foo1', 'bar1');
    Backbone.Radio.respondOnce(this.channelName, this.requestName, 'foo2', 'bar2');
    Backbone.Radio.stopResponding(this.channelName, this.requestName, 'foo3', 'bar3');
    Backbone.Radio.request(this.channelName, this.requestName, 'foo4', 'bar4');
  });

  it('should execute each method on the proper channel.', function() {
    expect(this.respondStub).to.have.been.calledOnce;
    expect(this.respondOnceStub).to.have.been.calledOnce;
    expect(this.stopRespondingStub).to.have.been.calledOnce;
    expect(this.requestStub).to.have.been.calledOnce;
  });

  it('should pass along the arguments.', function() {
    expect(this.respondStub).to.have.always.been.calledWithExactly('foo1', 'bar1');
    expect(this.respondOnceStub).to.have.always.been.calledWithExactly('foo2', 'bar2');
    expect(this.stopRespondingStub).to.have.always.been.calledWithExactly('foo3', 'bar3');
    expect(this.requestStub).to.have.always.been.calledWithExactly('foo4', 'bar4');
  });
});

describe('When executing Events methods from the top-level API', function() {
  beforeEach(function() {
    this.channelName = 'foobar';
    this.eventName = 'foo:event';
    this.channel = Backbone.Radio.channel(this.channelName);

    this.listenToStub      = this.sinon.stub(this.channel, 'listenTo');
    this.listenToOnceStub  = this.sinon.stub(this.channel, 'listenToOnce');
    this.stopListeningStub = this.sinon.stub(this.channel, 'stopListening');
    this.triggerStub       = this.sinon.stub(this.channel, 'trigger');
    this.onStub            = this.sinon.stub(this.channel, 'on');
    this.onceStub          = this.sinon.stub(this.channel, 'once');
    this.offStub           = this.sinon.stub(this.channel, 'off');

    Backbone.Radio.listenTo(this.channelName, this.eventName, 'foo1', 'bar1');
    Backbone.Radio.listenToOnce(this.channelName, this.eventName, 'foo2', 'bar2');
    Backbone.Radio.stopListening(this.channelName, this.eventName, 'foo3', 'bar3');
    Backbone.Radio.trigger(this.channelName, this.eventName, 'foo4', 'bar4');
    Backbone.Radio.on(this.channelName, this.eventName, 'foo5', 'bar5');
    Backbone.Radio.once(this.channelName, this.eventName, 'foo6', 'bar6');
    Backbone.Radio.off(this.channelName, this.eventName, 'foo7', 'bar7');
  });

  it('should execute each method on the proper channel.', function() {
    expect(this.listenToStub).to.have.been.calledOnce;
    expect(this.listenToOnceStub).to.have.been.calledOnce;
    expect(this.stopListeningStub).to.have.been.calledOnce;
    expect(this.triggerStub).to.have.been.calledOnce;
    expect(this.onStub).to.have.been.calledOnce;
    expect(this.onceStub).to.have.been.calledOnce;
    expect(this.offStub).to.have.been.calledOnce;
  });

  it('should pass along the arguments.', function() {
    expect(this.listenToStub).to.have.always.been.calledWithExactly('foo1', 'bar1');
    expect(this.listenToOnceStub).to.have.always.been.calledWithExactly('foo2', 'bar2');
    expect(this.stopListeningStub).to.have.always.been.calledWithExactly('foo3', 'bar3');
    expect(this.triggerStub).to.have.always.been.calledWithExactly('foo4', 'bar4');
    expect(this.onStub).to.have.always.been.calledWithExactly('foo5', 'bar5');
    expect(this.onceStub).to.have.always.been.calledWithExactly('foo6', 'bar6');
    expect(this.offStub).to.have.always.been.calledWithExactly('foo7', 'bar7');
  });
});
