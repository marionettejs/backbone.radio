describe('Top-level API:', function() {
  beforeEach(function() {
    this.channelName = 'foo';
    this.eventName = 'bar';
    this.channel = Backbone.Radio.channel(this.channelName);
    this.channelStub = this.sinon.stub(this.channel);
  });

  describe('when executing Commands methods', function() {
    beforeEach(function() {
      Backbone.Radio.react(this.channelName, this.eventName, 'foo1', 'bar1');
      Backbone.Radio.reactOnce(this.channelName, this.eventName, 'foo2', 'bar2');
      Backbone.Radio.stopReacting(this.channelName, this.eventName, 'foo3', 'bar3');
      Backbone.Radio.command(this.channelName, this.eventName, 'foo4', 'bar4');
    });

    it('should execute each method on the proper channel with the arguments.', function() {
      expect(this.channelStub.react)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('foo1', 'bar1');

      expect(this.channelStub.reactOnce)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('foo2', 'bar2');

      expect(this.channelStub.stopReacting)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('foo3', 'bar3');

      expect(this.channelStub.command)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('foo4', 'bar4');
    });
  });

  describe('when executing Requests methods', function() {
    beforeEach(function() {
      Backbone.Radio.reply(this.channelName, this.eventName, 'foo1', 'bar1');
      Backbone.Radio.replyOnce(this.channelName, this.eventName, 'foo2', 'bar2');
      Backbone.Radio.stopReplying(this.channelName, this.eventName, 'foo3', 'bar3');
      Backbone.Radio.request(this.channelName, this.eventName, 'foo4', 'bar4');
    });

    it('should execute each method on the proper channel with the arguments.', function() {
      expect(this.channelStub.reply)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('foo1', 'bar1');

      expect(this.channelStub.replyOnce)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('foo2', 'bar2');

      expect(this.channelStub.stopReplying)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('foo3', 'bar3');
        
      expect(this.channelStub.request)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('foo4', 'bar4');
    });
  });

  describe('when executing Events methods', function() {
    beforeEach(function() {
      Backbone.Radio.listenTo(this.channelName, this.eventName, 'foo1', 'bar1');
      Backbone.Radio.listenToOnce(this.channelName, this.eventName, 'foo2', 'bar2');
      Backbone.Radio.stopListening(this.channelName, this.eventName, 'foo3', 'bar3');
      Backbone.Radio.trigger(this.channelName, this.eventName, 'foo4', 'bar4');
      Backbone.Radio.on(this.channelName, this.eventName, 'foo5', 'bar5');
      Backbone.Radio.once(this.channelName, this.eventName, 'foo6', 'bar6');
      Backbone.Radio.off(this.channelName, this.eventName, 'foo7', 'bar7');
    });

    it('should execute each method on the proper channel with the arguments.', function() {
      expect(this.channelStub.listenTo)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('foo1', 'bar1');

      expect(this.channelStub.listenToOnce)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('foo2', 'bar2');

      expect(this.channelStub.stopListening)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('foo3', 'bar3');

      expect(this.channelStub.trigger)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('foo4', 'bar4');

      expect(this.channelStub.on)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('foo5', 'bar5');

      expect(this.channelStub.once)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('foo6', 'bar6');

      expect(this.channelStub.off)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('foo7', 'bar7');
    });
  });
});
