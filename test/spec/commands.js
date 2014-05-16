describe('When commanding an action that has no handler', function() {
  beforeEach(function() {
    this.obj = _.extend({}, Backbone.Radio.Commands);
    this.returned = this.obj.command('handlerDoesNotExist');
  });

  it('should not return anything.', function() {
    expect(this.returned).to.be.undefined;
  });
});

describe('When commanding an action that has a handler', function() {
  beforeEach(function() {
    this.actionName = 'foo';
    this.passedArgument = 'bar';
    this.obj = _.extend({}, Backbone.Radio.Commands);

    this.callbackSpy = this.sinon.spy();

    this.obj.react(this.actionName, this.callbackSpy);
    this.returned = this.obj.command(this.actionName, true, this.passedArgument);
  });

  it('should execute the handler.', function() {
    expect(this.callbackSpy).to.have.been.calledOnce;
  });

  it('should pass along the arguments to the handler.', function() {
    expect(this.callbackSpy).to.have.always.been.calledWithExactly(true, this.passedArgument);
  });

  it('should not return anything.', function() {
    expect(this.returned).to.be.undefined;
  });
});
