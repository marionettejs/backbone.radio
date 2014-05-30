describe('When in DEBUG mode and firing a command on a channel without a handler', function() {
  beforeEach(function() {
    this.channelName = 'foobar';
    this.commandName = 'foo:command';
    this.channel = Backbone.Radio.channel(this.channelName);

    this.consoleSpy = this.sinon.stub(console, 'warn');

    Backbone.Radio.DEBUG = true;
    this.channel.command(this.commandName);
  });

  it('should log a console warning, including the channel', function() {
    var warning = 'An unhandled event was fired on the ' + this.channelName + ' channel: "' + this.commandName + '"';
    expect(this.consoleSpy).to.have.been.calledOnce;
    expect(this.consoleSpy).to.have.been.calledWithExactly(warning);
  });
});

describe('When not in DEBUG mode and firing a command on a channel without a handler', function() {
  beforeEach(function() {
    this.channelName = 'foobar';
    this.commandName = 'foo:command';
    this.channel = Backbone.Radio.channel(this.channelName);

    this.consoleSpy = this.sinon.stub(console, 'warn');

    this.channel.command(this.commandName);
  });

  it('should not log a console warning', function() {
    expect(this.consoleSpy).to.not.have.been.called;
  });
});

describe('When in DEBUG mode and firing a request on a channel without a handler', function() {
  beforeEach(function() {
    this.channelName = 'foobar';
    this.commandName = 'foo:command';
    this.channel = Backbone.Radio.channel(this.channelName);

    this.consoleSpy = this.sinon.stub(console, 'warn');

    Backbone.Radio.DEBUG = true;
    this.channel.request(this.requestName);
  });

  it('should log a console warning, including the channel', function() {
    var warning = 'An unhandled event was fired on the ' + this.channelName + ' channel: "' + this.requestName + '"';
    expect(this.consoleSpy).to.have.been.calledOnce;
    expect(this.consoleSpy).to.have.been.calledWithExactly(warning);
  });
});

describe('When not in DEBUG mode and firing a request on a channel without a handler', function() {
  beforeEach(function() {
    this.channelName = 'foobar';
    this.commandName = 'foo:command';
    this.channel = Backbone.Radio.channel(this.channelName);

    this.consoleSpy = this.sinon.stub(console, 'warn');

    this.channel.request(this.requestName);
  });

  it('should not log a console warning', function() {
    expect(this.consoleSpy).to.not.have.been.called;
  });
});

describe('When in DEBUG mode and firing a command on an object without a handler', function() {
  beforeEach(function() {
    this.commandName = 'foo:command';
    this.obj = _.extend({}, Backbone.Radio.Commands);

    this.consoleSpy = this.sinon.stub(console, 'warn');

    Backbone.Radio.DEBUG = true;
    this.obj.command(this.commandName);
  });

  it('should log a console warning', function() {
    var warning = 'An unhandled event was fired: "' + this.commandName + '"';
    expect(this.consoleSpy).to.have.been.calledOnce;
    expect(this.consoleSpy).to.have.been.calledWithExactly(warning);
  });
});

describe('When not in DEBUG mode and firing a command on an object without a handler', function() {
  beforeEach(function() {
    this.commandName = 'foo:command';
    this.obj = _.extend({}, Backbone.Radio.Commands);

    this.consoleSpy = this.sinon.stub(console, 'warn');

    this.obj.command(this.commandName);
  });

  it('should not log a console warning', function() {
    expect(this.consoleSpy).to.not.have.been.called;
  });
});

describe('When in DEBUG mode and firing a request on an object without a handler', function() {
  beforeEach(function() {
    this.requestName = 'foo:request';
    this.obj = _.extend({}, Backbone.Radio.Requests);

    this.consoleSpy = this.sinon.stub(console, 'warn');

    Backbone.Radio.DEBUG = true;
    this.obj.request(this.requestName);
  });

  it('should log a console warning', function() {
    var warning = 'An unhandled event was fired: "' + this.requestName + '"';
    expect(this.consoleSpy).to.have.been.calledOnce;
    expect(this.consoleSpy).to.have.been.calledWithExactly(warning);
  });
});

describe('When not in DEBUG mode and firing a command on an object without a handler', function() {
  beforeEach(function() {
    this.requestName = 'foo:request';
    this.obj = _.extend({}, Backbone.Radio.Requests);

    this.consoleSpy = this.sinon.stub(console, 'warn');

    this.obj.request(this.requestName);
  });

  it('should not log a console warning', function() {
    expect(this.consoleSpy).to.not.have.been.called;
  });
});
