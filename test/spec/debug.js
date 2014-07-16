describe('DEBUG mode:', function() {
  beforeEach(function() {
    this.channel = Backbone.Radio.channel('myChannel');
    this.Commands = _.clone(Backbone.Radio.Commands);
    this.Requests = _.clone(Backbone.Radio.Requests);

    stub(console, 'warn');
  });

  describe('when turned on', function() {
    beforeEach(function() {
      Backbone.Radio.DEBUG = true;
    });

    it('should log a console warning when firing a command on a channel without a handler', function() {
      this.channel.command('some:event');
      this.warning = 'An unhandled event was fired on the myChannel channel: "some:event"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when firing a request on a channel without a handler', function() {
      this.channel.request('some:event');
      this.warning = 'An unhandled event was fired on the myChannel channel: "some:event"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when firing a command on an object without a handler', function() {
      this.Commands.command('some:event');
      this.warning = 'An unhandled event was fired: "some:event"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when firing a request on an object without a handler', function() {
      this.Requests.request('some:event');
      this.warning = 'An unhandled event was fired: "some:event"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when unregistering a command that was never registered on a channel', function() {
      this.channel.stopComplying('some:event');
      this.warning = 'Attempted to remove the unregistered command on the myChannel channel: "some:event"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when unregistering a request that was never registered on a channel', function() {
      this.channel.stopReplying('some:event');
      this.warning = 'Attempted to remove the unregistered request on the myChannel channel: "some:event"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when unregistering a command that was never registered on an object', function() {
      this.Commands.stopComplying('some:event');
      this.warning = 'Attempted to remove the unregistered command: "some:event"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when unregistering a request that was never registered on an object', function() {
      this.Requests.stopReplying('some:event');
      this.warning = 'Attempted to remove the unregistered request: "some:event"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });
  });

  describe('when turned off', function() {
    it('should not log a console warning when firing a command on a channel without a handler', function() {
      this.channel.command('some:event');
      expect(console.warn).to.not.have.been.called;
    });

    it('should not log a console warning when firing a request on a channel without a handler', function() {
      this.channel.request('some:event');
      expect(console.warn).to.not.have.been.called;
    });

    it('should not log a console warning when firing a command on an object without a handler', function() {
      this.Commands.command('some:event');
      expect(console.warn).to.not.have.been.called;
    });

    it('should not log a console warning when firing a request on an object without a handler', function() {
      this.Requests.request('some:event');
      expect(console.warn).to.not.have.been.called;
    });

    it('should not log a console warning when unregistering a command that was never registered on a channel', function() {
      this.channel.stopComplying('some:event');
      expect(console.warn).to.not.have.been.called;
    });

    it('should not log a console warning when unregistering a request that was never registered on a channel', function() {
      this.channel.stopReplying('some:event');
      expect(console.warn).to.not.have.been.called;
    });

    it('should not log a console warning when unregistering a command that was never registered on an object', function() {
      this.Commands.stopComplying('some:event');
      expect(console.warn).to.not.have.been.called;
    });

    it('should not log a console warning when unregistering a request that was never registered on an object', function() {
      this.Requests.stopReplying('some:event');
      expect(console.warn).to.not.have.been.called;
    });
  });
});
