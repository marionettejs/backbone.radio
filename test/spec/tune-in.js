describe('Tune-in:', function() {
  describe('both methods, tuneIn and tuneOut,', function() {
    beforeEach(function() {
      this.channelName = 'foo';
      this.tuneInSpy = this.sinon.spy(Backbone.Radio, 'tuneIn');
      this.tuneOutSpy = this.sinon.spy(Backbone.Radio, 'tuneOut');
      Backbone.Radio.tuneIn(this.channelName);
      Backbone.Radio.tuneOut(this.channelName);
    });

    it('should return the Radio object', function() {
      expect(this.tuneInSpy)
        .to.have.been.calledOnce
        .and.to.have.always.returned(Backbone.Radio);
      expect(this.tuneOutSpy)
        .to.have.been.calledOnce
        .and.to.have.always.returned(Backbone.Radio);
    });
  });

  beforeEach(function() {
    this.channelName = 'foo';
    this.eventName = 'bar';
    this.channel = Backbone.Radio.channel(this.channelName);
    this.consoleStub = this.sinon.stub(console, 'log');
    Backbone.Radio.tuneIn(this.channelName);
  });

  afterEach(function() {
    Backbone.Radio.tuneOut(this.channelName);
  });

  describe('when tuned into a channel and emitting an event', function() {
    beforeEach(function() {
      this.warning = '[' + this.channelName + '] "' + this.eventName + '"';
      this.args = ['foo', 'bar'];
      this.channel.trigger(this.eventName, 'foo', 'bar');
    });

    it('should log that activity, with the arguments', function() {
      expect(this.consoleStub).to.have.been.calledOnce.and.calledWithExactly(this.warning, this.args);
    });
  });

  describe('when tuning in, then out, and emitting an event', function() {
    beforeEach(function() {
      Backbone.Radio.tuneOut(this.channelName);
      this.channel.trigger(this.eventName);
    });

    it('should not log that activity', function() {
      expect(this.consoleStub).to.not.have.been.called;
    });
  });

  describe('when tuned into a channel and making a request', function() {
    beforeEach(function() {
      this.warning = '[' + this.channelName + '] "' + this.eventName + '"';
      this.args = ['foo', 'bar'];
      this.channel.request(this.eventName, 'foo', 'bar');
    });

    it('should log that activity', function() {
      expect(this.consoleStub).to.have.been.calledOnce.and.calledWithExactly(this.warning, this.args);
    });
  });

  describe('when tuning in, then out, and making a request', function() {
    beforeEach(function() {
      Backbone.Radio.tuneOut(this.channelName);
      this.channel.request(this.eventName);
    });

    it('should not log that activity', function() {
      expect(this.consoleStub).to.not.have.been.called;
    });
  });

  describe('when tuned into a channel and ordering a command', function() {
    beforeEach(function() {
      this.channel.command(this.eventName, 'foo', 'bar');
      this.warning = '[' + this.channelName + '] "' + this.eventName + '"';
      this.args = ['foo', 'bar'];
    });

    it('should log that activity', function() {
      expect(this.consoleStub).to.have.been.calledOnce.and.calledWithExactly(this.warning, this.args);
    });
  });

  describe('when tuning in, then out, and ordering a command', function() {
    beforeEach(function() {
      Backbone.Radio.tuneOut(this.channelName);
      this.channel.command(this.eventName);
    });

    it('should not log that activity', function() {
      expect(this.consoleStub).to.not.have.been.called;
    });
  });

  describe('When providing a custom logging function and tuning it', function() {
    beforeEach(function() {
      this.logStub = this.sinon.stub(Backbone.Radio, 'log');
      this.channel.command(this.eventName, 'foo', 'bar');
    });

    it('should log your custom message', function() {
      expect(this.logStub)
        .to.have.been.calledOnce
        .and.calledOn(this.channel)
        .and.calledWithExactly(this.channelName, this.eventName, 'foo', 'bar');
    });
  });
});
