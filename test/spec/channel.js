describe('Channel:', function () {
  beforeEach(function () {
    this.channelName = 'myChannel';
    this.channel = Backbone.Radio.channel(this.channelName);
  });

  describe('when calling Radio.channel with no name', function() {
    it('should throw an error', function() {
      expect(Backbone.Radio.channel).to.throw(Error, 'You must provide a name for the channel.');
    });
  });

  describe('upon creation', function() {
    it('should create a new instance of the Channel', function() {
      expect(this.channel).to.be.instanceOf(Backbone.Radio.Channel);
    });

    it('should have its name set', function() {
      expect(this.channel).to.have.property('channelName', this.channelName);
    });

    it('should have all of the Backbone.Events methods', function() {
      expect(this.channel).to.contain(Backbone.Events);
    });

    it('should have all of the Radio.Commands methods', function() {
      expect(this.channel).to.contain(Backbone.Radio.Commands);
    });

    it('should have all of the Radio.Requests methods', function() {
      expect(this.channel).to.contain(Backbone.Radio.Requests);
    });
  });

  describe('calling channel twice with the same name', function() {
    beforeEach(function() {
      this.channelTwo = Backbone.Radio.channel(this.channelName);
    });

    it('should return the same channel', function() {
      expect(this.channelTwo).to.deep.equal(this.channel);
    });
  });

  describe('executing the `reset` method of a Channel', function() {
    beforeEach(function() {
      this.offStub            = this.sinon.stub(this.channel, 'off');
      this.stopListeningStub  = this.sinon.stub(this.channel, 'stopListening');
      this.stopComplyingStub   = this.sinon.stub(this.channel, 'stopComplying');
      this.stopReplyingStub   = this.sinon.stub(this.channel, 'stopReplying');
      this.resetSpy           = this.sinon.spy(this.channel, 'reset');

      this.channel.reset();
    });

    it('should call the reset functions of Backbone.Events', function() {
      expect(this.offStub).to.have.been.calledOnce;
      expect(this.stopListeningStub).to.have.been.calledOnce;
    });

    it('should call the reset functions of Backbone.Radio.Commands', function() {
      expect(this.stopComplyingStub).to.have.been.calledOnce;
    });

    it('should call the reset functions of Backbone.Radio.Requests', function() {
      expect(this.stopReplyingStub).to.have.been.calledOnce;
    });

    it('should return the Channel', function() {
      expect(this.resetSpy).to.have.always.returned(this.channel);
    });
  });
});
