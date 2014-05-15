describe('When making a request that has no handler', function() {
  var obj = {}, returned;

  beforeEach(function() {
    _.extend(obj, Backbone.Radio.Requests);
    returned = obj.request('null');
  });

  it('should not return anything.', function() {
    expect(returned).to.be.undefined;
  });
});

describe('When making a request that has a handler', function() {
  var obj = {}, returned, callback, callbackSpy, actionName = 'test';

  beforeEach(function() {
    callback = function() {
      return 'request complete';
    };
    callbackSpy = sinon.spy(callback);

    _.extend(obj, Backbone.Radio.Requests);
    obj.respond(actionName, callbackSpy);

    returned = obj.request(actionName, true, 'asdf');
  });

  it('should execute the handler.', function() {
    expect(callbackSpy).to.have.been.calledOnce;
  });

  it('should pass along the arguments to the handler.', function() {
    expect(callbackSpy).to.have.always.been.calledWithExactly(true, 'asdf');
  });

  it('should return the value of the handler.', function() {
    expect(returned).to.equal('request complete');
  });
});

describe('When making a request that has a flat value as a handler', function() {
  var obj = {}, returned, actionName = 'test';

  beforeEach(function() {

    _.extend(obj, Backbone.Radio.Requests);
    obj.respond(actionName, 'hello');

    returned = obj.request(actionName);
  });

  it('should return that value.', function() {
    expect(returned).to.equal('hello');
  });
});
