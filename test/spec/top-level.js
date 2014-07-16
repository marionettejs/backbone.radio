describe('Top-level API:', function() {
  beforeEach(function() {
    this.channelName = 'myChannel';
    this.eventName = 'some:event';
    this.channel = Backbone.Radio.channel(this.channelName);
    stub(this.channel);
  });

  describe('when executing Commands methods', function() {
    beforeEach(function() {
      Backbone.Radio.comply(this.channelName, this.eventName, 'firstArg1', 'secondArg1');
      Backbone.Radio.complyOnce(this.channelName, this.eventName, 'firstArg2', 'secondArg2');
      Backbone.Radio.stopComplying(this.channelName, this.eventName, 'firstArg3', 'secondArg3');
      Backbone.Radio.command(this.channelName, this.eventName, 'firstArg4', 'secondArg4');
    });

    it('should execute each method on the proper channel with the arguments.', function() {
      expect(this.channel.comply)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly(this.eventName, 'firstArg1', 'secondArg1');

      expect(this.channel.complyOnce)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly(this.eventName, 'firstArg2', 'secondArg2');

      expect(this.channel.stopComplying)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly(this.eventName, 'firstArg3', 'secondArg3');

      expect(this.channel.command)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly(this.eventName, 'firstArg4', 'secondArg4');
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
      expect(this.channel.reply)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly(this.eventName, 'firstArg1', 'secondArg1');

      expect(this.channel.replyOnce)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly(this.eventName, 'firstArg2', 'secondArg2');

      expect(this.channel.stopReplying)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly(this.eventName, 'firstArg3', 'secondArg3');

      expect(this.channel.request)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly(this.eventName, 'firstArg4', 'secondArg4');
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
      expect(this.channel.listenTo)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly(this.eventName, 'firstArg1', 'secondArg1');

      expect(this.channel.listenToOnce)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly(this.eventName, 'firstArg2', 'secondArg2');

      expect(this.channel.stopListening)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly(this.eventName, 'firstArg3', 'secondArg3');

      expect(this.channel.trigger)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly(this.eventName, 'firstArg4', 'secondArg4');

      expect(this.channel.on)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly(this.eventName, 'firstArg5', 'secondArg5');

      expect(this.channel.once)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly(this.eventName, 'firstArg6', 'secondArg6');

      expect(this.channel.off)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly(this.eventName, 'firstArg7', 'secondArg7');
    });
  });
});
