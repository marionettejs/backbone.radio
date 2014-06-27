describe('Commands:', function() {
  beforeEach(function() {
    this.Commands = _.clone(Backbone.Radio.Commands);
    this.commandSpy = this.sinon.spy(this.Commands, 'command');
    this.reactSpy = this.sinon.spy(this.Commands, 'react');
    this.reactOnceSpy = this.sinon.spy(this.Commands, 'reactOnce');
    this.stopReactingSpy = this.sinon.spy(this.Commands, 'stopReacting');
  });

  describe('when commanding an action that has no handler', function() {
    beforeEach(function() {
      this.Commands.command('handlerDoesNotExist');
    });

    it('should return the Commands object itself.', function() {
      expect(this.commandSpy)
        .to.have.been.calledOnce
        .and.to.have.always.returned(this.Commands);
    });
  });

  describe('when commanding an action that has a handler', function() {
    beforeEach(function() {
      this.actionName = 'foo';
      this.argumentOne = 'foo';
      this.argumentTwo = 'bar';

      this.callbackStub = this.sinon.stub();
    });

    describe('and no context', function() {
      beforeEach(function() {
        this.Commands.react(this.actionName, this.callbackStub);
        this.Commands.command(this.actionName, this.argumentOne, this.argumentTwo);
      });

      it('should pass along the arguments to the handler.', function() {
        expect(this.callbackStub)
          .to.have.been.calledOnce
          .and.calledWithExactly(this.argumentOne, this.argumentTwo);
      });

      it('should return the instance of Commands from `command`.', function() {
        expect(this.commandSpy).to.have.always.returned(this.Commands);
      });

      it('should always return the instance of Commands from `react`', function() {
        expect(this.reactSpy)
          .to.have.been.calledOnce
          .and.to.have.always.returned(this.Commands);
      });

      it('should call be called with Commands as the context', function() {
        expect(this.callbackStub).to.have.always.been.calledOn(this.Commands);
      });
    });

    describe('and a context', function() {
      beforeEach(function() {
        this.context = {};
        this.Commands.react(this.actionName, this.callbackStub, this.context);
        this.Commands.command(this.actionName, this.argumentOne, this.argumentTwo);
      });

      it('should pass along the arguments to the handler.', function() {
        expect(this.callbackStub)
          .to.have.been.calledOnce
          .and.calledWithExactly(this.argumentOne, this.argumentTwo);
      });

      it('should return the instance of Commands from `command`.', function() {
        expect(this.commandSpy).to.have.always.returned(this.Commands);
      });

      it('should always return the instance of Commands from `react`', function() {
        expect(this.reactSpy)
          .to.have.been.calledOnce
          .and.to.have.always.returned(this.Commands);
      });

      it('should be called with the correct context', function() {
        expect(this.callbackStub).to.have.always.been.calledOn(this.context);
      });
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

    it('should always return Commands from `command`.', function() {
      expect(this.commandSpy)
        .to.have.been.calledThrice
        .and.to.have.always.returned(this.Commands);
    });

    it('should always return the instance of Commands from `react`', function() {
      expect(this.reactSpy)
        .to.have.been.calledOnce
        .and.to.have.always.returned(this.Commands);
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

    it('should always return the instance of Commands from `command`.', function() {
      expect(this.commandSpy)
        .to.have.been.calledThrice
        .and.to.have.always.returned(this.Commands);
    });

    it('should always return the instance of Commands from `reactOnce`', function() {
      expect(this.reactOnceSpy)
        .to.have.been.calledOnce
        .and.to.have.always.returned(this.Commands);
    });
  });

  describe('when commanding an action with a `once` handler with the context set', function() {
    beforeEach(function() {
      this.actionName = 'foo';
      this.argumentOne = 'foo';
      this.argumentTwo = 'bar';
      this.context = {};

      this.callbackStub = this.sinon.stub();

      this.Commands.reactOnce(this.actionName, this.callbackStub, this.context);
      this.Commands.command(this.actionName, this.argumentOne, this.argumentTwo);
    });

    it('should call the handler just once, passing the arguments.', function() {
      expect(this.callbackStub)
        .to.have.been.calledOnce
        .and.calledWithExactly(this.argumentOne, this.argumentTwo);
    });

    it('should always return the instance of Commands from `reactOnce`', function() {
      expect(this.reactOnceSpy)
        .to.have.been.calledOnce
        .and.to.have.always.returned(this.Commands);
    });

    it('should always be called with the right context', function() {
      expect(this.callbackStub).and.to.have.always.been.calledOn(this.context);
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

  describe('when calling stopReacting from a Commands instance', function() {
    beforeEach(function() {
      this.commandOne = 'foo';
      this.commandTwo = 'bar';
      this.commandOneStub = this.sinon.stub();
      this.commandTwoStub = this.sinon.stub();
      this.Commands.react(this.commandOne, this.commandOneStub);
      this.Commands.react(this.commandTwo, this.commandTwoStub);
      this.Commands.stopReacting();
    });

    it('should remove all of the handlers', function() {
      expect(this.Commands._commands).to.be.undefined;
    });

    it('should return the instance of Commands from stopReacting', function() {
      expect(this.stopReactingSpy).to.have.always.returned(this.Commands);
    });

    describe('and subsequently calling the handler', function() {
      beforeEach(function() {
        this.Commands.command(this.commandOne);
        this.Commands.command(this.commandTwo);
      });

      it('should not execute them', function() {
        expect(this.commandOneStub).to.have.not.beenCalled;
        expect(this.commandTwoStub).to.have.not.beenCalled;
      });
    });
  });
});
