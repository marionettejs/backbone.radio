describe('DEBUG mode:', function() {
  beforeEach(function() {
    this.channelName = 'foo';
    this.eventName = 'bar';

    this.channel = Backbone.Radio.channel(this.channelName);
    this.Commands = _.clone(Backbone.Radio.Commands);
    this.Requests = _.clone(Backbone.Radio.Requests);

    this.consoleStub = this.sinon.stub(console, 'warn');
  });

  describe('when turned on', function() {
    beforeEach(function() {
      Backbone.Radio.DEBUG = true;
    });

    it('should log a console warning when firing a command on a channel without a handler', function() {
      this.channel.command(this.eventName);
      this.warning = 'An unhandled event was fired on the ' + this.channelName + ' channel: "' + this.eventName + '"';
      expect(this.consoleStub).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when firing a request on a channel without a handler', function() {
      this.channel.request(this.eventName);
      this.warning = 'An unhandled event was fired on the ' + this.channelName + ' channel: "' + this.eventName + '"';
      expect(this.consoleStub).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when firing a command on an object without a handler', function() {
      this.Commands.command(this.eventName);
      this.warning = 'An unhandled event was fired: "' + this.eventName + '"';
      expect(this.consoleStub).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when firing a request on an object without a handler', function() {
      this.Requests.request(this.eventName);
      this.warning = 'An unhandled event was fired: "' + this.eventName + '"';
      expect(this.consoleStub).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });
  });

  describe('when turned off', function() {
    it('should not log a console warning when firing a command on a channel without a handler', function() {
      this.channel.command(this.eventName);
      expect(this.consoleStub).to.not.have.been.called;
    });

    it('should not log a console warning when firing a request on a channel without a handler', function() {
      this.channel.request(this.eventName);
      expect(this.consoleStub).to.not.have.been.called;
    });

    it('should not log a console warning when firing a command on an object without a handler', function() {
      this.Commands.command(this.eventName);
      expect(this.consoleStub).to.not.have.been.called;
    });

    it('should not log a console warning when firing a request on an object without a handler', function() {
      this.Requests.request(this.eventName);
      expect(this.consoleStub).to.not.have.been.called;
    });
  });
});
