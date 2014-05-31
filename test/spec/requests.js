describe('When making a request that has no handler', function() {
  beforeEach(function() {
    this.obj = _.extend({}, Backbone.Radio.Requests);
    this.returned = this.obj.request('foobar');
  });

  it('should not return anything.', function() {
    expect(this.returned).to.be.undefined;
  });
});

describe('When making a request that has a handler', function() {
  beforeEach(function() {
    this.actionName = 'foo';
    this.passedArgument = 'foobar';
    this.obj = _.extend({}, Backbone.Radio.Requests);

    this.callback = function() { return 'request complete'; };
    this.callbackSpy = this.sinon.spy(this.callback);

    this.obj.respond(this.actionName, this.callbackSpy);
    this.returned = this.obj.request(this.actionName, true, this.passedArgument);
  });

  it('should execute the handler.', function() {
    expect(this.callbackSpy).to.have.been.calledOnce;
  });

  it('should pass along the arguments to the handler.', function() {
    expect(this.callbackSpy).to.have.always.been.calledWithExactly(true, this.passedArgument);
  });

  it('should return the value of the handler.', function() {
    expect(this.returned).to.equal('request complete');
  });
});

describe('When making a request that has a flat value as a handler', function() {
  beforeEach(function() {
    this.actionName = 'foo';
    this.response = 'foobar';
    this.obj = _.extend({}, Backbone.Radio.Requests);

    this.obj.respond(this.actionName, this.response);
    this.returned = this.obj.request(this.actionName);
  });

  it('should return that value.', function() {
    expect(this.returned).to.equal(this.response);
  });
});

describe('When unregistering a handler from an object with no requests handlers', function() {
  beforeEach(function() {
    this.requestName = 'foo';
    this.obj = _.extend({}, Backbone.Radio.Requests);

    this.stopRespondingSpy = sinon.spy(this.obj, 'stopResponding');
  });

  it('should not throw an Error.', function() {
    var suite = this;
    expect(function() {
      suite.obj.stopResponding(suite.requestName);
    }).to.not.throw(Error);
  });
});
