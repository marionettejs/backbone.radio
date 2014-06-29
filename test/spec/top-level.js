describe('Top-level API:', function() {
  beforeEach(function() {
    this.channelName = 'myChannel';
    this.eventName = 'some:event';
    this.channel = Backbone.Radio.channel(this.channelName);
    this.channelStub = this.sinon.stub(this.channel);
  });

  describe('when executing Commands methods', function() {
    beforeEach(function() {
      Backbone.Radio.react(this.channelName, this.eventName, 'firstArg1', 'secondArg1');
      Backbone.Radio.reactOnce(this.channelName, this.eventName, 'firstArg2', 'secondArg2');
      Backbone.Radio.stopReacting(this.channelName, this.eventName, 'firstArg3', 'secondArg3');
      Backbone.Radio.command(this.channelName, this.eventName, 'firstArg4', 'secondArg4');
    });

    it('should execute each method on the proper channel with the arguments.', function() {
      expect(this.channelStub.react)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('firstArg1', 'secondArg1');

      expect(this.channelStub.reactOnce)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('firstArg2', 'secondArg2');

      expect(this.channelStub.stopReacting)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('firstArg3', 'secondArg3');

      expect(this.channelStub.command)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('firstArg4', 'secondArg4');
    });
  });

  describe('when executing Requests methods', function() {
    beforeEach(function() {
      Backbone.Radio.reply(this.channelName, this.eventName, 'firstArg1', 'secondArg1');
      Backbone.Radio.replyOnce(this.channelName, this.eventName, 'firstArg2', 'secondArg2');
      Backbone.Radio.stopReplying(this.channelName, this.eventName, 'firstArg3', 'secondArg3');
      Backbone.Radio.request(this.channelName, this.eventName, 'firstArg4', 'secondArg4');
    });

    it('should execute each method on the proper channel with the arguments.', function() {
      expect(this.channelStub.reply)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('firstArg1', 'secondArg1');

      expect(this.channelStub.replyOnce)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('firstArg2', 'secondArg2');

      expect(this.channelStub.stopReplying)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('firstArg3', 'secondArg3');
        
      expect(this.channelStub.request)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('firstArg4', 'secondArg4');
    });
  });

  describe('when executing Events methods', function() {
    beforeEach(function() {
      Backbone.Radio.listenTo(this.channelName, this.eventName, 'firstArg1', 'secondArg1');
      Backbone.Radio.listenToOnce(this.channelName, this.eventName, 'firstArg2', 'secondArg2');
      Backbone.Radio.stopListening(this.channelName, this.eventName, 'firstArg3', 'secondArg3');
      Backbone.Radio.trigger(this.channelName, this.eventName, 'firstArg4', 'secondArg4');
      Backbone.Radio.on(this.channelName, this.eventName, 'firstArg5', 'secondArg5');
      Backbone.Radio.once(this.channelName, this.eventName, 'firstArg6', 'secondArg6');
      Backbone.Radio.off(this.channelName, this.eventName, 'firstArg7', 'secondArg7');
    });

    it('should execute each method on the proper channel with the arguments.', function() {
      expect(this.channelStub.listenTo)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('firstArg1', 'secondArg1');

      expect(this.channelStub.listenToOnce)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('firstArg2', 'secondArg2');

      expect(this.channelStub.stopListening)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('firstArg3', 'secondArg3');

      expect(this.channelStub.trigger)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('firstArg4', 'secondArg4');

      expect(this.channelStub.on)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('firstArg5', 'secondArg5');

      expect(this.channelStub.once)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('firstArg6', 'secondArg6');

      expect(this.channelStub.off)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('firstArg7', 'secondArg7');
    });
  });
});
