describe('When commanding an action that has no handler', function() {
  var obj = {}, returned;

  beforeEach(function() {
    _.extend(obj, Backbone.Radio.Commands);
    returned = obj.command('null');
  });

  it('should not return anything.', function() {
    expect(returned).to.be.undefined;
  });
});

describe('When commanding an action that has a handler', function() {
  var obj = {}, returned, callbackSpy, actionName = 'test';

  beforeEach(function() {
    callbackSpy = sinon.spy();

    _.extend(obj, Backbone.Radio.Commands);
    obj.react(actionName, callbackSpy);

    returned = obj.command(actionName, true, 'asdf');
  });

  afterEach(function() {
    callbackSpy.reset();
    obj.stopReacting();
  });

  it('should execute the handler.', function() {
    expect(callbackSpy).to.have.been.calledOnce;
  });

  it('should pass along the arguments to the handler.', function() {
    expect(callbackSpy).to.have.always.been.calledWithExactly(true, 'asdf');
  });

  it('should not return anything.', function() {
    expect(returned).to.be.undefined;
  });
});
