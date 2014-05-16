describe('When tuned into a channel and emitting an event', function() {
  var consoleSpy,
  channelName = 'global',
  globalChannel,
  eventName = 'some:event';

  beforeEach(function() {
    globalChannel = Backbone.Radio.channel(channelName);
    Backbone.Radio.tuneIn(channelName);
    consoleSpy = sinon.stub(console, 'log');
    globalChannel.trigger(eventName, 'pasta', true);
  });

  afterEach(function() {
    consoleSpy.restore();
    Backbone.Radio.tuneOut(channelName);
  });

  it('should log that activity, with the arguments', function() {
    var warning = '[' + channelName + '] "' + eventName + '"';
    var args = [ 'pasta', true ];
    expect(consoleSpy).to.have.been.calledOnce;
    expect(consoleSpy).to.have.been.calledWithExactly(warning, args);
  });
});

describe('When tuning in, then out, and emitting an event', function() {
  var consoleSpy,
  channelName = 'global',
  globalChannel,
  eventName = 'some:event';

  beforeEach(function() {
    globalChannel = Backbone.Radio.channel(channelName);
    Backbone.Radio.tuneIn(channelName);
    Backbone.Radio.tuneOut(channelName);
    consoleSpy = sinon.stub(console, 'log');
    globalChannel.trigger(eventName);
  });

  afterEach(function() {
    consoleSpy.restore();
  });

  it('should not log that activity', function() {
    expect(consoleSpy).to.not.have.been.called;
  });
});

describe('When tuned into a channel and making a request', function() {
  var consoleSpy,
  channelName = 'global',
  globalChannel,
  requestName = 'some:request';

  beforeEach(function() {
    globalChannel = Backbone.Radio.channel(channelName);
    Backbone.Radio.tuneIn(channelName);
    consoleSpy = sinon.stub(console, 'log');
    globalChannel.request(requestName, 'sandwiches', 123);
  });

  afterEach(function() {
    consoleSpy.restore();
    Backbone.Radio.tuneOut(channelName);
  });

  it('should log that activity', function() {
    var warning = '[' + channelName + '] "' + requestName + '"';
    var args = [ 'sandwiches', 123 ];
    expect(consoleSpy).to.have.been.calledOnce;
    expect(consoleSpy).to.have.been.calledWithExactly(warning, args);
  });
});

describe('When tuning in, then out, and making a request', function() {
  var consoleSpy,
  channelName = 'global',
  globalChannel,
  requestName = 'some:request';

  beforeEach(function() {
    globalChannel = Backbone.Radio.channel(channelName);
    Backbone.Radio.tuneIn(channelName);
    Backbone.Radio.tuneOut(channelName);
    consoleSpy = sinon.stub(console, 'log');
    globalChannel.request(requestName);
  });

  afterEach(function() {
    consoleSpy.restore();
  });

  it('should not log that activity', function() {
    expect(consoleSpy).to.not.have.been.called;
  });
});

describe('When tuned into a channel and ordering a command', function() {
  var consoleSpy,
  channelName = 'global',
  globalChannel,
  commandName = 'some:command';

  beforeEach(function() {
    globalChannel = Backbone.Radio.channel(channelName);
    Backbone.Radio.tuneIn(channelName);
    consoleSpy = sinon.stub(console, 'log');
    globalChannel.command(commandName, 'pizza', 'alfredo');
  });

  afterEach(function() {
    consoleSpy.restore();
    Backbone.Radio.tuneOut(channelName);
  });

  it('should log that activity', function() {
    var warning = '[' + channelName + '] "' + commandName + '"';
    var args = [ 'pizza', 'alfredo' ];
    expect(consoleSpy).to.have.been.calledOnce;
    expect(consoleSpy).to.have.been.calledWithExactly(warning, args);
  });
});

describe('When tuning in, then out, and ordering a command', function() {
  var consoleSpy,
  channelName = 'global',
  globalChannel,
  commandName = 'some:command';

  beforeEach(function() {
    globalChannel = Backbone.Radio.channel(channelName);
    Backbone.Radio.tuneIn(channelName);
    Backbone.Radio.tuneOut(channelName);
    consoleSpy = sinon.stub(console, 'log');
    globalChannel.command(commandName);
  });

  afterEach(function() {
    consoleSpy.restore();
  });

  it('should not log that activity', function() {
    expect(consoleSpy).to.not.have.been.called;
  });
});
