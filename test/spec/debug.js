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
      this.warning = 'An unhandled command was fired on the myChannel channel: "some:event"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when firing a request on a channel without a handler', function() {
      this.channel.request('some:event');
      this.warning = 'An unhandled request was fired on the myChannel channel: "some:event"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when firing a command on an object without a handler', function() {
      this.Commands.command('some:event');
      this.warning = 'An unhandled command was fired: "some:event"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when firing a request on an object without a handler', function() {
      this.Requests.request('some:event');
      this.warning = 'An unhandled request was fired: "some:event"';
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

    it('should log a console warning when unregistering a command that was never registered on an object', function() {
      this.Commands.comply('some:event');
      this.Commands.stopComplying('some:event');
      expect(console.warn).to.not.have.been.called;
    });

    it('should log a console warning when unregistering a request that was never registered on an object', function() {
      this.Requests.reply('some:event');
      this.Requests.stopReplying('some:event');
      expect(console.warn).to.not.have.been.called;
    });

    it('should log a console warning when unregistering a callback that was never registered on an object', function() {
      this.Commands.stopComplying(undefined, function() {});
      this.warning = 'Attempted to remove the unregistered command: "undefined"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when unregistering a callback that was never registered on an object', function() {
      this.Requests.stopReplying(undefined, function() {});
      this.warning = 'Attempted to remove the unregistered request: "undefined"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should not log a console warning when unregistering a callback that was registered on an object', function() {
      this.callback = function() {};
      this.Commands.comply('some:event', this.callback);
      this.Commands.stopComplying(undefined, this.callback);
      expect(console.warn).to.not.have.been.called;
    });

    it('should not log a console warning when unregistering a callback that was registered on an object', function() {
      this.callback = function() {};
      this.Requests.reply('some:event', this.callback);
      this.Requests.stopReplying(undefined, this.callback);
      expect(console.warn).to.not.have.been.called;
    });

    it('should log a console warning when unregistering a context that was never registered on an object', function() {
      this.Commands.stopComplying(undefined, undefined, {});
      this.warning = 'Attempted to remove the unregistered command: "undefined"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when unregistering a context that was never registered on an object', function() {
      this.Requests.stopReplying(undefined, undefined, {});
      this.warning = 'Attempted to remove the unregistered request: "undefined"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should not log a console warning when unregistering a context that was registered on an object', function() {
      this.context = {};
      this.Commands.comply('some:event', function() {}, this.context);
      this.Commands.stopComplying(undefined, undefined, this.context);
      expect(console.warn).to.not.have.been.called;
    });

    it('should not log a console warning when unregistering a context that was registered on an object', function() {
      this.context = {};
      this.Requests.reply('some:event', function() {}, this.context);
      this.Requests.stopReplying(undefined, undefined, this.context);
      expect(console.warn).to.not.have.been.called;
    });

    it('should not log a console warning when unregistering all commands when none were registered', function() {
      this.Commands.stopComplying();
      expect(console.warn).to.not.have.been.called;
    });

    it('should not log a console warning when unregistering all requests when none were registered', function() {
      this.Requests.stopReplying();
      expect(console.warn).to.not.have.been.called;
    });

    it('should log a console warning when registering a command that already was registered', function() {
      this.Commands.comply('some:event', function() {});
      this.Commands.comply('some:event', function() {});
      this.warning = 'A command was overwritten: "some:event"';
      expect(console.warn).to.have.been.calledOnce.and.calledWithExactly(this.warning);
    });

    it('should log a console warning when registering a request that already was registered', function() {
      this.Requests.reply('some:event', function() {});
      this.Requests.reply('some:event', function() {});
      this.warning = 'A request was overwritten: "some:event"';
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

    it('should not log a console warning when registering a command that already was registered', function() {
      this.Commands.comply('some:event', function() {});
      this.Commands.comply('some:event', function() {});
      expect(console.warn).to.not.have.been.called;
    });

    it('should not log a console warning when registering a request that already was registered', function() {
      this.Requests.reply('some:event', function() {});
      this.Requests.reply('some:event', function() {});
      expect(console.warn).to.not.have.been.called;
    });
  });
});
