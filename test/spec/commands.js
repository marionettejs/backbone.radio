describe('Commands:', function() {
  beforeEach(function() {
    this.Commands = _.clone(Backbone.Radio.Commands);
    this.commandSpy = this.sinon.spy(this.Commands, 'command');
  });

  describe('when commanding an action that has no handler', function() {
    beforeEach(function() {
      this.Commands.command('handlerDoesNotExist');
    });

    it('should not return anything.', function() {
      expect(this.commandSpy)
        .to.have.been.calledOnce
        .and.to.have.always.returned(undefined);
    });
  });

  describe('when commanding an action that has a handler', function() {
    beforeEach(function() {
      this.actionName = 'foo';
      this.argumentOne = 'foo';
      this.argumentTwo = 'bar';

      this.callbackStub = this.sinon.stub();

      this.Commands.react(this.actionName, this.callbackStub);
      this.Commands.command(this.actionName, this.argumentOne, this.argumentTwo);
    });

    it('should pass along the arguments to the handler.', function() {
      expect(this.callbackStub)
        .to.have.been.calledOnce
        .and.calledWithExactly(this.argumentOne, this.argumentTwo);
    });

    it('should not return anything.', function() {
      expect(this.commandSpy).to.have.always.returned(undefined);
    });
  });

  describe('when commanding an action multiple times that has a handler', function() {
    beforeEach(function() {
      this.actionName = 'foo';
      this.argumentOne = 'foo';
      this.argumentTwo = 'bar';

      this.callbackStub = this.sinon.stub();

      this.Commands.react(this.actionName, this.callbackStub);
      this.Commands.command(this.actionName);
      this.Commands.command(this.actionName);
      this.Commands.command(this.actionName);
    });

    it('should never return anything.', function() {
      expect(this.commandSpy)
        .to.have.been.calledThrice
        .and.to.have.always.returned(undefined);
    });
  });

  describe('when commanding an action multiple times that has a `once` handler', function() {
    beforeEach(function() {
      this.actionName = 'foo';
      this.argumentOne = 'foo';
      this.argumentTwo = 'bar';

      this.callbackStub = this.sinon.stub();

      this.Commands.reactOnce(this.actionName, this.callbackStub);
      this.Commands.command(this.actionName, this.argumentOne, this.argumentTwo);
      this.Commands.command(this.actionName, this.argumentOne);
      this.Commands.command(this.actionName, this.argumentTwo);
    });

    it('should call the handler just once, passing the arguments.', function() {
      expect(this.callbackStub)
        .to.have.been.calledOnce
        .and.calledWithExactly(this.argumentOne, this.argumentTwo);
    });

    it('should never return anything.', function() {
      expect(this.commandSpy)
        .to.have.been.calledThrice
        .and.to.have.always.returned(undefined);
    });
  });

  describe('when unregistering a handler from an object with no commands handlers', function() {
    beforeEach(function() {
      this.actionName = 'foo';
      this.stopReacting = _.partial(this.Commands.stopReacting, this.actionName);
    });

    it('should not throw an Error.', function() {
      expect(this.stopReacting).to.not.throw(Error);
    });
  });
});
