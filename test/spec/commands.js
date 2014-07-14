describe('Commands:', function() {
  beforeEach(function() {
    this.Commands = _.clone(Backbone.Radio.Commands);
    this.commandSpy = this.sinon.spy(this.Commands, 'command');
    this.complySpy = this.sinon.spy(this.Commands, 'comply');
    this.complyOnceSpy = this.sinon.spy(this.Commands, 'complyOnce');
    this.stopComplyingSpy = this.sinon.spy(this.Commands, 'stopComplying');
  });

  describe('when commanding an action that has no handler', function() {
    beforeEach(function() {
      this.actionName = 'handlerDoesNotExist';
      this.Commands.command(this.actionName);
    });

    it('should return the Commands object itself.', function() {
      expect(this.commandSpy)
        .to.have.been.calledOnce
        .and.to.have.always.returned(this.Commands);
    });

    describe('but has a "default" handler', function() {
      beforeEach(function() {
        this.callbackStub = this.sinon.stub();
        this.argumentOne = 'argOne';
        this.argumentTwo = 'argTwo';

        this.Commands.comply('default', this.callbackStub);
        this.Commands.command(this.actionName, this.argumentOne, this.argumentTwo);
      });

      it('should pass along the arguments to the "default" handler.', function() {
        expect(this.callbackStub)
          .to.have.been.calledOnce
          .and.calledWithExactly(this.actionName, this.argumentOne, this.argumentTwo);
      });
    });
  });

  describe('when commanding an action that has a handler', function() {
    beforeEach(function() {
      this.actionName = 'actionOne';
      this.argumentOne = 'argOne';
      this.argumentTwo = 'argTwo';

      this.callbackStub = this.sinon.stub();
    });

    describe('and no context', function() {
      beforeEach(function() {
        this.Commands.comply(this.actionName, this.callbackStub);
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

      it('should always return the instance of Commands from `comply`', function() {
        expect(this.complySpy)
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
        this.Commands.comply(this.actionName, this.callbackStub, this.context);
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

      it('should always return the instance of Commands from `comply`', function() {
        expect(this.complySpy)
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
      this.actionName = 'actionOne';
      this.argumentOne = 'argOne';
      this.argumentTwo = 'argTwo';

      this.callbackStub = this.sinon.stub();

      this.Commands.comply(this.actionName, this.callbackStub);
      this.Commands.command(this.actionName);
      this.Commands.command(this.actionName);
      this.Commands.command(this.actionName);
    });

    it('should always return Commands from `command`.', function() {
      expect(this.commandSpy)
        .to.have.been.calledThrice
        .and.to.have.always.returned(this.Commands);
    });

    it('should always return the instance of Commands from `comply`', function() {
      expect(this.complySpy)
        .to.have.been.calledOnce
        .and.to.have.always.returned(this.Commands);
    });

    describe('and has a "default" handler', function() {
      beforeEach(function() {
        this.defaultCallbackStub = this.sinon.stub();
        this.Commands.comply('default', this.defaultCallbackStub);
        this.Commands.command(this.actionName);
      });

      it('should not call the "default" handler', function() {
        expect(this.defaultCallbackStub).not.have.been.called;
      });
    });
  });

  describe('when commanding an action multiple times that has a `once` handler', function() {
    beforeEach(function() {
      this.actionName = 'actionOne';
      this.argumentOne = 'argOne';
      this.argumentTwo = 'argTwo';

      this.callbackStub = this.sinon.stub();

      this.Commands.complyOnce(this.actionName, this.callbackStub);
    });

    describe('and has no "default" handler', function() {
      beforeEach(function() {
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

      it('should always return the instance of Commands from `complyOnce`', function() {
        expect(this.complyOnceSpy)
          .to.have.been.calledOnce
          .and.to.have.always.returned(this.Commands);
      });
    });

    describe('and has a "default" handler', function() {
      beforeEach(function() {
        this.defaultCallbackStub = this.sinon.stub();

        this.Commands.comply('default', this.defaultCallbackStub);
        this.Commands.command(this.actionName, this.argumentOne, this.argumentTwo);
        this.Commands.command(this.actionName, this.argumentOne);
        this.Commands.command(this.actionName, this.argumentTwo);
      });

      it('should call the "default" handler for subsequent calls', function() {
        expect(this.defaultCallbackStub)
          .to.have.been.calledTwice
          .and.calledAfter(this.callbackStub)
          .and.calledWithExactly(this.actionName, this.argumentOne)
          .and.calledWithExactly(this.actionName, this.argumentTwo);
      });
    });
  });

  describe('when commanding an action with a `once` handler with the context set', function() {
    beforeEach(function() {
      this.actionName = 'actionOne';
      this.argumentOne = 'argOne';
      this.argumentTwo = 'argTwo';
      this.context = {};

      this.callbackStub = this.sinon.stub();

      this.Commands.complyOnce(this.actionName, this.callbackStub, this.context);
      this.Commands.command(this.actionName, this.argumentOne, this.argumentTwo);
    });

    it('should call the handler just once, passing the arguments.', function() {
      expect(this.callbackStub)
        .to.have.been.calledOnce
        .and.calledWithExactly(this.argumentOne, this.argumentTwo);
    });

    it('should always return the instance of Commands from `complyOnce`', function() {
      expect(this.complyOnceSpy)
        .to.have.been.calledOnce
        .and.to.have.always.returned(this.Commands);
    });

    it('should always be called with the right context', function() {
      expect(this.callbackStub).and.to.have.always.been.calledOn(this.context);
    });
  });

  describe('when unregistering a handler from an object with no commands handlers', function() {
    beforeEach(function() {
      this.actionName = 'actionOne';
      this.stopComplying = _.partial(this.Commands.stopComplying, this.actionName);
    });

    it('should not throw an Error.', function() {
      expect(this.stopComplying).to.not.throw(Error);
    });
  });

  describe('when calling stopComplying from a Commands instance', function() {
    beforeEach(function() {
      this.commandOne = 'commandOne';
      this.commandTwo = 'commandTwo';
      this.commandOneStub = this.sinon.stub();
      this.commandTwoStub = this.sinon.stub();
      this.Commands.comply(this.commandOne, this.commandOneStub);
      this.Commands.comply(this.commandTwo, this.commandTwoStub);
      this.Commands.stopComplying();
    });

    it('should remove all of the handlers', function() {
      expect(this.Commands._commands).to.be.undefined;
    });

    it('should return the instance of Commands from stopComplying', function() {
      expect(this.stopComplyingSpy).to.have.always.returned(this.Commands);
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
