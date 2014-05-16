describe('When in DEBUG mode and firing a command on a channel without a handler', function() {
  var consoleSpy,
  channelName = 'global',
  globalChannel,
  commandName = 'some:command';

  beforeEach(function() {
    Backbone.Radio.DEBUG = true;
    globalChannel = Backbone.Radio.channel(channelName);
    consoleSpy = sinon.stub(console, 'warn');
    globalChannel.command(commandName);
  });

  afterEach(function() {
    Backbone.Radio.DEBUG = false;
    consoleSpy.restore();
  });

  it('should throw a console warning, including the channel', function() {
    var warning = 'An unhandled event was fired on the ' + channelName + ' channel: "' + commandName + '"';
    expect(consoleSpy).to.have.been.calledOnce;
    expect(consoleSpy).to.have.been.calledWithExactly(warning);
  });
});

describe('When not in DEBUG mode and firing a command on a channel without a handler', function() {
  var consoleSpy,
  channelName = 'global',
  globalChannel,
  commandName = 'some:command';

  beforeEach(function() {
    globalChannel = Backbone.Radio.channel(channelName);
    consoleSpy = sinon.stub(console, 'warn');
    globalChannel.command(commandName);
  });

  afterEach(function() {
    consoleSpy.restore();
  });

  it('should not throw a console warning', function() {
    expect(consoleSpy).to.not.have.been.called;
  });
});

describe('When in DEBUG mode and firing a request on a channel without a handler', function() {
  var consoleSpy,
  channelName = 'global',
  globalChannel,
  requestName = 'some:request';

  beforeEach(function() {
    Backbone.Radio.DEBUG = true;
    globalChannel = Backbone.Radio.channel(channelName);
    consoleSpy = sinon.stub(console, 'warn');
    globalChannel.request(requestName);
  });

  afterEach(function() {
    Backbone.Radio.DEBUG = false;
    consoleSpy.restore();
  });

  it('should throw a console warning, including the channel', function() {
    var warning = 'An unhandled event was fired on the ' + channelName + ' channel: "' + requestName + '"';
    expect(consoleSpy).to.have.been.calledOnce;
    expect(consoleSpy).to.have.been.calledWithExactly(warning);
  });
});

describe('When not in DEBUG mode and firing a request on a channel without a handler', function() {
  var consoleSpy,
  channelName = 'global',
  globalChannel,
  requestName = 'some:request';

  beforeEach(function() {
    globalChannel = Backbone.Radio.channel(channelName);
    consoleSpy = sinon.stub(console, 'warn');
    globalChannel.request(requestName);
  });

  afterEach(function() {
    consoleSpy.restore();
  });

  it('should not throw a console warning', function() {
    expect(consoleSpy).to.not.have.been.called;
  });
});

describe('When in DEBUG mode and firing a command on an object without a handler', function() {
  var consoleSpy, obj, commandName = 'some:command';

  beforeEach(function() {
    obj = _.extend({}, Backbone.Radio.Commands);
    Backbone.Radio.DEBUG = true;
    consoleSpy = sinon.stub(console, 'warn');
    obj.command(commandName);
  });

  afterEach(function() {
    Backbone.Radio.DEBUG = false;
    consoleSpy.restore();
  });

  it('should throw a console warning', function() {
    var warning = 'An unhandled event was fired: "' + commandName + '"';
    expect(consoleSpy).to.have.been.calledOnce;
    expect(consoleSpy).to.have.been.calledWithExactly(warning);
  });
});

describe('When not in DEBUG mode and firing a command on an object without a handler', function() {
  var consoleSpy, obj, commandName = 'some:command';

  beforeEach(function() {
    obj = _.extend({}, Backbone.Radio.Commands);
    consoleSpy = sinon.stub(console, 'warn');
    obj.command(commandName);
  });

  afterEach(function() {
    consoleSpy.restore();
  });

  it('should not throw a console warning', function() {
    expect(consoleSpy).to.not.have.been.called;
  });
});

describe('When in DEBUG mode and firing a request on an object without a handler', function() {
  var consoleSpy, obj, requestName = 'some:request';

  beforeEach(function() {
    obj = _.extend({}, Backbone.Radio.Requests);
    Backbone.Radio.DEBUG = true;
    consoleSpy = sinon.stub(console, 'warn');
    obj.request(requestName);
  });

  afterEach(function() {
    Backbone.Radio.DEBUG = false;
    consoleSpy.restore();
  });

  it('should throw a console warning', function() {
    var warning = 'An unhandled event was fired: "' + requestName + '"';
    expect(consoleSpy).to.have.been.calledOnce;
    expect(consoleSpy).to.have.been.calledWithExactly(warning);
  });
});

describe('When not in DEBUG mode and firing a command on an object without a handler', function() {
  var consoleSpy, obj, requestName = 'some:request';

  beforeEach(function() {
    obj = _.extend({}, Backbone.Radio.Requests);
    consoleSpy = sinon.stub(console, 'warn');
    obj.request(requestName);
  });

  afterEach(function() {
    consoleSpy.restore();
  });

  it('should not throw a console warning', function() {
    expect(consoleSpy).to.not.have.been.called;
  });
});
