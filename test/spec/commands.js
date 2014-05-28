describe('Commands:', function() {
  beforeEach(function() {
    this.Commands = _.clone(Backbone.Radio.Commands);
  });

  describe('when commanding an action that has no handler', function() {
    beforeEach(function() {
      this.returned = this.Commands.command('handlerDoesNotExist');
    });

    it('should not return anything.', function() {
      expect(this.returned).to.be.undefined;
    });
  });

  describe('when commanding an action that has a handler', function() {
    beforeEach(function() {
      this.actionName = 'foo';
      this.argumentOne = 'foo';
      this.argumentTwo = 'bar';

      this.callbackStub = this.sinon.stub();

      this.Commands.react(this.actionName, this.callbackStub);
      this.returned = this.Commands.command(this.actionName, this.argumentOne, this.argumentTwo);
    });

    it('should pass along the arguments to the handler.', function() {
      expect(this.callbackStub).to.have.been.calledOnce.and.calledWithExactly(this.argumentOne, this.argumentTwo);
    });

    it('should not return anything.', function() {
      expect(this.returned).to.be.undefined;
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
