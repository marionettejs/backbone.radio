describe('When tuned into a channel and emitting an event', function() {
  beforeEach(function() {
    this.channelName = 'foobar';
    this.eventName = 'foo:event';
    this.channel = Backbone.Radio.channel(this.channelName);

    this.consoleSpy = this.sinon.stub(console, 'log');

    Backbone.Radio.tuneIn(this.channelName);
    this.channel.trigger(this.eventName, 'foo', 'bar');
  });

  afterEach(function() {
    Backbone.Radio.tuneOut(this.channelName);
  });

  it('should log that activity, with the arguments', function() {
    var warning = '[' + this.channelName + '] "' + this.eventName + '"';
    var args = ['foo', 'bar'];
    expect(this.consoleSpy).to.have.been.calledOnce;
    expect(this.consoleSpy).to.have.been.calledWithExactly(warning, args);
  });
});

describe('When tuning in, then out, and emitting an event', function() {
  beforeEach(function() {
    this.channelName = 'foobar';
    this.eventName = 'foo:event';
    this.consoleSpy = this.sinon.stub(console, 'log');
    this.channel = Backbone.Radio.channel(this.channelName);

    Backbone.Radio.tuneIn(this.channelName);
    Backbone.Radio.tuneOut(this.channelName);
    this.channel.trigger(this.eventName);
  });

  it('should not log that activity', function() {
    expect(this.consoleSpy).to.not.have.been.called;
  });
});

describe('When tuned into a channel and making a request', function() {
  beforeEach(function() {
    this.channelName = 'foobar';
    this.eventName = 'foo:request';
    this.channel = Backbone.Radio.channel(this.channelName);

    this.consoleSpy = this.sinon.stub(console, 'log');

    Backbone.Radio.tuneIn(this.channelName);
    this.channel.request(this.requestName, 'foo', 'bar');
  });

  afterEach(function() {
    Backbone.Radio.tuneOut(this.channelName);
  });

  it('should log that activity', function() {
    var warning = '[' + this.channelName + '] "' + this.requestName + '"';
    var args = ['foo', 'bar'];
    expect(this.consoleSpy).to.have.been.calledOnce;
    expect(this.consoleSpy).to.have.been.calledWithExactly(warning, args);
  });
});

describe('When tuning in, then out, and making a request', function() {
  beforeEach(function() {
    this.channelName = 'foobar';
    this.eventName = 'foo:request';
    this.consoleSpy = this.sinon.stub(console, 'log');
    this.channel = Backbone.Radio.channel(this.channelName);

    Backbone.Radio.tuneIn(this.channelName);
    Backbone.Radio.tuneOut(this.channelName);
    this.channel.request(this.requestName);
  });

  it('should not log that activity', function() {
    expect(this.consoleSpy).to.not.have.been.called;
  });
});

describe('When tuned into a channel and ordering a command', function() {
  beforeEach(function() {
    this.channelName = 'foobar';
    this.eventName = 'foo:command';
    this.consoleSpy = this.sinon.stub(console, 'log');
    this.channel = Backbone.Radio.channel(this.channelName);

    Backbone.Radio.tuneIn(this.channelName);
    this.channel.command(this.commandName, 'foo', 'bar');
  });

  afterEach(function() {
    Backbone.Radio.tuneOut(this.channelName);
  });

  it('should log that activity', function() {
    var warning = '[' + this.channelName + '] "' + this.commandName + '"';
    var args = ['foo', 'bar'];
    expect(this.consoleSpy).to.have.been.calledOnce;
    expect(this.consoleSpy).to.have.been.calledWithExactly(warning, args);
  });
});

describe('When tuning in, then out, and ordering a command', function() {
  beforeEach(function() {
    this.channelName = 'foobar';
    this.eventName = 'foo:command';
    this.consoleSpy = this.sinon.stub(console, 'log');
    this.channel = Backbone.Radio.channel(this.channelName);

    Backbone.Radio.tuneIn(this.channelName);
    Backbone.Radio.tuneOut(this.channelName);
    this.channel.command(this.commandName);
  });

  it('should not log that activity', function() {
    expect(this.consoleSpy).to.not.have.been.called;
  });
});
