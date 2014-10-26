describe('Commands:', function() {
  beforeEach(function() {
    this.Commands = _.clone(Backbone.Radio.Commands);
    spy(this.Commands, 'command');
    spy(this.Commands, 'comply');
    spy(this.Commands, 'complyOnce');
    spy(this.Commands, 'stopComplying');
  });

  describe('when commanding an action that has no handler', function() {
    beforeEach(function() {
      this.Commands.command('handlerDoesNotExist');
    });

    it('should return the Commands object itself.', function() {
      expect(this.Commands.command)
        .to.have.been.calledOnce
        .and.to.have.always.returned(this.Commands);
    });

    describe('but has a "default" handler', function() {
      beforeEach(function() {
        this.callback = stub();

        this.Commands.comply('default', this.callback);
        this.Commands.command('handlerDoesNotExist', 'argOne', 'argTwo');
      });

      it('should pass along the arguments to the "default" handler.', function() {
        expect(this.callback)
          .to.have.been.calledOnce
          .and.calledWithExactly('handlerDoesNotExist', 'argOne', 'argTwo');
      });
    });
  });

  describe('when commanding an action that has a handler', function() {
    beforeEach(function() {
      this.callback = stub();
    });

    describe('and no context', function() {
      beforeEach(function() {
        this.Commands.comply('myCommand', this.callback);
        this.Commands.command('myCommand', 'argOne', 'argTwo');
      });

      it('should pass along the arguments to the handler.', function() {
        expect(this.callback)
          .to.have.been.calledOnce
          .and.calledWithExactly('argOne', 'argTwo');
      });

      it('should return the instance of Commands from `command`.', function() {
        expect(this.Commands.command).to.have.always.returned(this.Commands);
      });

      it('should always return the instance of Commands from `comply`', function() {
        expect(this.Commands.comply)
          .to.have.been.calledOnce
          .and.to.have.always.returned(this.Commands);
      });

      it('should call be called with Commands as the context', function() {
        expect(this.callback).to.have.always.been.calledOn(this.Commands);
      });
    });

    describe('and a context', function() {
      beforeEach(function() {
        this.context = {};
        this.Commands.comply('myCommand', this.callback, this.context);
        this.Commands.command('myCommand', 'argOne', 'argTwo');
      });

      it('should pass along the arguments to the handler.', function() {
        expect(this.callback)
          .to.have.been.calledOnce
          .and.calledWithExactly('argOne', 'argTwo');
      });

      it('should return the instance of Commands from `command`.', function() {
        expect(this.Commands.command).to.have.always.returned(this.Commands);
      });

      it('should always return the instance of Commands from `comply`', function() {
        expect(this.Commands.comply)
          .to.have.been.calledOnce
          .and.to.have.always.returned(this.Commands);
      });

      it('should be called with the correct context', function() {
        expect(this.callback).to.have.always.been.calledOn(this.context);
      });
    });

    describe('with many arguments', function() {
      beforeEach(function() {
        this.context = {};
        this.Commands.comply('myCommand', this.callback, this.context);
        this.Commands.command('myCommand', 'argOne', 'argTwo', 'argThree', 'argFour', 'argFive');
      });

      it('should pass all of the arguments', function() {
        expect(this.callback)
          .to.have.been.calledOnce
          .and.calledWithExactly('argOne', 'argTwo', 'argThree', 'argFour', 'argFive');
      });
    });
  });

  describe('when commanding an action multiple times that has a handler', function() {
    beforeEach(function() {
      this.callback = stub();

      this.Commands.comply('myCommand', this.callback);
      this.Commands.command('myCommand');
      this.Commands.command('myCommand');
      this.Commands.command('myCommand');
    });

    it('should always return Commands from `command`.', function() {
      expect(this.Commands.command)
        .to.have.been.calledThrice
        .and.to.have.always.returned(this.Commands);
    });

    it('should always return the instance of Commands from `comply`', function() {
      expect(this.Commands.comply)
        .to.have.been.calledOnce
        .and.to.have.always.returned(this.Commands);
    });

    describe('and has a "default" handler', function() {
      beforeEach(function() {
        this.defaultCallback = stub();
        this.Commands.comply('default', this.defaultCallback);
        this.Commands.command('myCommand');
      });

      it('should not call the "default" handler', function() {
        expect(this.defaultCallback).to.have.not.been.called;
      });
    });
  });

  describe('when commanding an action multiple times that has a `once` handler', function() {
    beforeEach(function() {
      this.callback = stub();

      this.Commands.complyOnce('myCommand', this.callback);
    });

    describe('and has no "default" handler', function() {
      beforeEach(function() {
        this.Commands.command('myCommand', 'argOne', 'argTwo');
        this.Commands.command('myCommand', 'argOne');
        this.Commands.command('myCommand', 'argTwo');
      });

      it('should call the handler just once, passing the arguments.', function() {
        expect(this.callback)
          .to.have.been.calledOnce
          .and.calledWithExactly('argOne', 'argTwo');
      });

      it('should always return the instance of Commands from `command`.', function() {
        expect(this.Commands.command)
          .to.have.been.calledThrice
          .and.to.have.always.returned(this.Commands);
      });

      it('should always return the instance of Commands from `complyOnce`', function() {
        expect(this.Commands.complyOnce)
          .to.have.been.calledOnce
          .and.to.have.always.returned(this.Commands);
      });
    });

    describe('and has a "default" handler', function() {
      beforeEach(function() {
        this.defaultCallback = stub();

        this.Commands.comply('default', this.defaultCallback);
        this.Commands.command('myCommand', 'argOne', 'argTwo');
        this.Commands.command('myCommand', 'argOne');
        this.Commands.command('myCommand', 'argTwo');
      });

      it('should call the "default" handler for subsequent calls', function() {
        expect(this.defaultCallback)
          .to.have.been.calledTwice
          .and.calledAfter(this.callback)
          .and.calledWithExactly('myCommand', 'argOne')
          .and.calledWithExactly('myCommand', 'argTwo');
      });
    });
  });

  describe('when commanding an action with a `once` handler with the context set', function() {
    beforeEach(function() {
      this.context = {};
      this.callback = stub();

      this.Commands.complyOnce('myCommand', this.callback, this.context);
      this.Commands.command('myCommand', 'argOne', 'argTwo');
    });

    it('should call the handler just once, passing the arguments.', function() {
      expect(this.callback)
        .to.have.been.calledOnce
        .and.calledWithExactly('argOne', 'argTwo');
    });

    it('should always return the instance of Commands from `complyOnce`', function() {
      expect(this.Commands.complyOnce)
        .to.have.been.calledOnce
        .and.to.have.always.returned(this.Commands);
    });

    it('should always be called with the right context', function() {
      expect(this.callback).and.to.have.always.been.calledOn(this.context);
    });
  });

  describe('when unregistering a handler from an object with no commands handlers', function() {
    beforeEach(function() {
      this.stopComplying = _.partial(this.Commands.stopComplying, 'myCommand');
    });

    it('should not throw an Error.', function() {
      expect(this.stopComplying).to.not.throw(Error);
    });
  });

  describe('when calling stopComplying from a Commands instance', function() {
    beforeEach(function() {
      this.commandOne = stub();
      this.commandTwo = stub();
      this.commandThree = stub();
      this.contextOne = {};
      this.contextTwo = {};
      this.Commands.comply('commandOne', this.commandOne);
      this.Commands.comply('commandTwo', this.commandTwo);
      this.Commands.comply('commandThree', this.commandTwo, this.contextOne);
      this.Commands.comply('commandFour', this.commandTwo, this.contextTwo);
      this.Commands.comply('commandFive', this.commandThree, this.contextTwo);
    });

    describe('and passing a name', function() {
      beforeEach(function() {
        this.Commands.stopComplying('commandOne');
      });

      it('should remove the specified handler', function() {
        expect(this.Commands._commands).to.not.contain.keys('commandOne');
      });

      it('should leave the other handlers untouched', function() {
        expect(this.Commands._commands).to.have.keys(['commandTwo', 'commandThree', 'commandFour', 'commandFive']);
      });

      it('should return the instance of Commands from stopComplying', function() {
        expect(this.Commands.stopComplying).to.have.always.returned(this.Commands);
      });
    });

    describe('and not passing any arguments', function() {
      beforeEach(function() {
        this.Commands.stopComplying();
      });

      it('should remove all of the handlers', function() {
        expect(this.Commands._commands).to.be.undefined;
      });

      it('should return the instance of Commands from stopComplying', function() {
        expect(this.Commands.stopComplying).to.have.always.returned(this.Commands);
      });
    });

    describe('and passing just a callback', function() {
      beforeEach(function() {
        this.Commands.stopComplying(undefined, this.commandTwo);
      });

      it('should remove all handlers with that callback', function() {
        expect(this.Commands._commands).to.not.contain.keys('commandTwo', 'commandThree', 'commandFour');
      });

      it('should leave the other handlers', function() {
        expect(this.Commands._commands).to.have.keys(['commandOne', 'commandFive']);
      });

      it('should return the instance of Commands from stopComplying', function() {
        expect(this.Commands.stopComplying).to.have.always.returned(this.Commands);
      });
    });

    describe('and passing just a context', function() {
      beforeEach(function() {
        this.Commands.stopComplying(undefined, undefined, this.contextTwo);
      });

      it('should remove all handlers with that context', function() {
        expect(this.Commands._commands).to.not.contain.keys('commandFour', 'commandFive');
      });

      it('should leave the other handlers', function() {
        expect(this.Commands._commands).to.have.keys(['commandOne', 'commandTwo', 'commandThree']);
      });

      it('should return the instance of Commands from stopComplying', function() {
        expect(this.Commands.stopComplying).to.have.always.returned(this.Commands);
      });
    });

    describe('and passing a callback and a context', function() {
      beforeEach(function() {
        this.Commands.stopComplying(undefined, this.commandTwo, this.contextTwo);
      });

      it('should remove only matched handlers', function() {
        expect(this.Commands._commands).to.not.contain.keys('commandFour');
      });

      it('should leave the other handlers', function() {
        expect(this.Commands._commands).to.have.keys(['commandOne', 'commandTwo', 'commandThree', 'commandFive']);
      });

      it('should return the instance of Commands from stopComplying', function() {
        expect(this.Commands.stopComplying).to.have.always.returned(this.Commands);
      });
    });

    describe('and passing a name, callback, and context', function() {
      beforeEach(function() {
        this.Commands.stopComplying('commandThree', this.commandTwo, this.contextOne);
      });

      it('should remove that handler', function() {
        expect(this.Commands._commands).to.not.contain.keys('commandThree');
      });

      it('should leave the other handlers', function() {
        expect(this.Commands._commands).to.have.keys(['commandOne', 'commandTwo', 'commandFour', 'commandFive']);
      });

      it('should return the instance of Commands from stopComplying', function() {
        expect(this.Commands.stopComplying).to.have.always.returned(this.Commands);
      });
    });
  });

  describe('when calling `command` with object', function() {
    beforeEach(function() {
      this.Commands.command({
        commandOne: 'argOne',
        commandTwo: 'argTwo'
      });
    });

    it('should return `this`', function() {
      expect(this.Commands.command).to.have.always.returned(this.Commands);
    });

    it('should call the set of commands', function() {
      expect(this.Commands.command)
        .to.have.been.calledThrice
        .and.calledWith('commandOne', 'argOne')
        .and.calledWith('commandTwo', 'argTwo');
    });
  });

  describe('when calling `comply` with object', function() {
    beforeEach(function() {
      this.commandOneStub = stub();
      this.commandTwoStub = stub();

      this.context = {};

      this.Commands.comply({
        commandOne: this.commandOneStub,
        commandTwo: this.commandTwoStub
      }, this.context);
    });

    it('should return `this`', function() {
      expect(this.Commands.comply).to.have.always.returned(this.Commands);
    });

    it('should call the set of commands', function() {
      expect(this.Commands.comply)
        .to.have.been.calledThrice
        .and.calledWith('commandOne', this.commandOneStub, this.context)
        .and.calledWith('commandTwo', this.commandTwoStub, this.context);
    });
  });

  describe('when calling `complyOnce` with object', function() {
    beforeEach(function() {
      this.commandOneStub = stub();
      this.commandTwoStub = stub();

      this.context = {};

      this.Commands.complyOnce({
        commandOne: this.commandOneStub,
        commandTwo: this.commandTwoStub
      }, this.context);
    });

    it('should return `this`', function() {
      expect(this.Commands.complyOnce).to.have.always.returned(this.Commands);
    });

    it('should call the set of commands', function() {
      expect(this.Commands.complyOnce)
        .to.have.been.calledThrice
        .and.calledWith('commandOne', this.commandOneStub, this.context)
        .and.calledWith('commandTwo', this.commandTwoStub, this.context);
    });
  });

  describe('when calling `stopComplying` with object', function() {
    beforeEach(function() {
      this.Commands.stopComplying({
        commandOne: null,
        commandTwo: null
      });
    });

    it('should return `this`', function() {
      expect(this.Commands.stopComplying).to.have.always.returned(this.Commands);
    });

    it('should call the set of commands', function() {
      expect(this.Commands.stopComplying)
        .to.have.been.calledThrice
        .and.calledWith('commandOne')
        .and.calledWith('commandTwo');
    });
  });

  describe('when calling `command` with space-separated commands', function() {
    beforeEach(function() {
      this.Commands.command('commandOne commandTwo', 'argOne', 'argTwo');
    });

    it('should call `command` with the correct commands', function() {
      expect(this.Commands.command)
        .to.have.been.calledThrice
        .and.calledWith('commandOne', 'argOne', 'argTwo')
        .and.calledWith('commandTwo', 'argOne', 'argTwo');
    });
  });

  describe('when calling `comply` with space-separated commands', function() {
    beforeEach(function() {
      this.Commands.comply('commandOne commandTwo', 'argOne', 'argTwo');
    });

    it('should call `comply` with the correct commands', function() {
      expect(this.Commands.comply)
        .to.have.been.calledThrice
        .and.calledWith('commandOne', 'argOne', 'argTwo')
        .and.calledWith('commandTwo', 'argOne', 'argTwo');
    });
  });

  describe('when calling `complyOnce` with space-separated commands', function() {
    beforeEach(function() {
      this.Commands.complyOnce('commandOne commandTwo', 'argOne', 'argTwo');
    });

    it('should call `complyOnce` with the correct commands', function() {
      expect(this.Commands.complyOnce)
        .to.have.been.calledThrice
        .and.calledWith('commandOne', 'argOne', 'argTwo')
        .and.calledWith('commandTwo', 'argOne', 'argTwo');
    });
  });

  describe('when calling `stopComplying` with space-separated commands', function() {
    beforeEach(function() {
      this.Commands.stopComplying('commandOne commandTwo');
    });

    it('should call `stopComplying` with the correct commands', function() {
      expect(this.Commands.stopComplying)
        .to.have.been.calledThrice
        .and.calledWith('commandOne')
        .and.calledWith('commandTwo');
    });
  });

  describe('when registering a command with `complyFor`, then executing it', function() {
    beforeEach(function() {
      this.CommandsTwo = _.clone(Backbone.Radio.Commands);
      this.callback = stub();
      this.Commands.complyFor(this.CommandsTwo, 'myCommand', this.callback);
      this.CommandsTwo.command('myCommand');
    });

    it('should execute the callback with the correct context', function() {
      expect(this.callback)
        .to.have.been.calledOnce
        .and.to.have.always.been.calledOn(this.Commands);
    });
  });

  describe('when registering a command with `complyFor` and an event map, and then executing one of the commands', function() {
    beforeEach(function() {
      this.CommandsTwo = _.clone(Backbone.Radio.Commands);
      this.callbackOne = stub();
      this.callbackTwo = stub();
      this.Commands.complyFor(this.CommandsTwo, {
        commandOne: this.callbackOne,
        commandTwo: this.callbackTwo
      });
      this.CommandsTwo.command('commandOne');
    });

    it('should execute the callback with the correct context', function() {
      expect(this.callbackOne)
        .to.have.been.calledOnce
        .and.to.have.always.been.calledOn(this.Commands);
    });

    it('should not execute the callbacks not specified', function() {
      expect(this.callbackTwo).to.not.have.been.called;
    });
  });

  describe('`complyForOnce`', function() {
    beforeEach(function() {
      this.CommandsTwo = _.clone(Backbone.Radio.Commands);
      this.callback = stub();
      this.Commands.complyForOnce(this.CommandsTwo, 'myCommand', this.callback);
      this.CommandsTwo.command('myCommand');
    });

    it('should execute the callback with the correct context', function() {
      expect(this.callback)
        .to.have.been.calledOnce
        .and.to.have.always.been.calledOn(this.Commands);
    });

    it('should remove the reference from the original object', function() {
      expect(this.CommandsTwo._commands).to.deep.equal({});
    });
  });

  describe('`complyForOnce` with an event map', function() {
    beforeEach(function() {
      this.CommandsTwo = _.clone(Backbone.Radio.Commands);
      this.callbackOne = stub();
      this.callbackTwo = stub();
      this.Commands.complyForOnce(this.CommandsTwo, {
        commandOne: this.callbackOne,
        commandTwo: this.callbackTwo
      });
      this.CommandsTwo.command('commandOne');
    });

    it('should execute the callback with the correct context', function() {
      expect(this.callbackOne)
        .to.have.been.calledOnce
        .and.to.have.always.been.calledOn(this.Commands);
    });

    it('should not execute the callbacks not specified', function() {
      expect(this.callbackTwo).to.not.have.been.called;
    });

    it('should remove the key for a', function() {
      expect(this.CommandsTwo._commands).to.not.have.key('commandOne');
    });

    it('should keep the key for b', function() {
      expect(this.CommandsTwo._commands).to.have.key('commandTwo');
    });
  });

  describe('`stopComplyingFor` with the first argument', function() {
    beforeEach(function() {
      this.CommandsTwo = _.clone(Backbone.Radio.Commands);
      this.CommandsThree = _.clone(Backbone.Radio.Commands);
      this.callbackOne = stub();
      this.callbackTwo = stub();
      this.callbackThree = stub();
      this.Commands.complyFor(this.CommandsTwo, {
        commandOne: this.callbackOne,
        commandTwo: this.callbackTwo
      });
      this.Commands.complyFor(this.CommandsThree, 'commandThree', this.callbackThree);
      this.Commands.stopComplyingFor(this.CommandsTwo);
    });
    
    it('should only remove the callbacks on CommandsTwo', function() {
      expect(this.CommandsTwo._commands).to.deep.equal({});
    });

    it('should leave the callback on CommandThree', function() {
      expect(this.CommandsThree._commands).to.have.key('commandThree');
    });
  });

  describe('`stopComplyingFor` with the first two arguments', function() {
    beforeEach(function() {
      this.CommandsTwo = _.clone(Backbone.Radio.Commands);
      this.CommandsThree = _.clone(Backbone.Radio.Commands);
      this.callbackOne = stub();
      this.callbackTwo = stub();
      this.callbackThree = stub();
      this.Commands.complyFor(this.CommandsTwo, {
        commandOne: this.callbackOne,
        commandTwo: this.callbackTwo
      });
      this.Commands.complyFor(this.CommandsThree, 'commandThree', this.callbackThree);
      this.Commands.stopComplyingFor(this.CommandsTwo, 'commandOne');
    });
    
    it('should only remove the proper callback on CommandsTwo', function() {
      expect(this.CommandsTwo._commands).to.not.have.key('commandOne');
    });

    it('should not touch the other callback on CommandsTwo', function() {
      expect(this.CommandsTwo._commands).to.have.key('commandTwo');
    });

    it('should leave the callback on CommandThree', function() {
      expect(this.CommandsThree._commands).to.have.key('commandThree');
    });
  });

  describe('`stopComplyingFor` with the all three arguments', function() {
    beforeEach(function() {
      this.CommandsTwo = _.clone(Backbone.Radio.Commands);
      this.CommandsThree = _.clone(Backbone.Radio.Commands);
      this.callbackOne = stub();
      this.callbackTwo = stub();
      this.callbackThree = stub();
      this.Commands.complyFor(this.CommandsTwo, {
        commandOne: this.callbackOne,
        commandTwo: this.callbackTwo
      });
      this.Commands.complyFor(this.CommandsThree, 'commandThree', this.callbackThree);
      this.Commands.stopComplyingFor(this.CommandsTwo, 'commandOne', this.callbackOne);
    });
    
    it('should only remove the proper callback on CommandsTwo', function() {
      expect(this.CommandsTwo._commands).to.not.have.key('commandOne');
    });

    it('should not touch the other callback on CommandsTwo', function() {
      expect(this.CommandsTwo._commands).to.have.key('commandTwo');
    });

    it('should leave the callback on CommandThree', function() {
      expect(this.CommandsThree._commands).to.have.key('commandThree');
    });
  });

  describe('`stopComplyingFor` with just the second argument', function() {
    beforeEach(function() {
      this.CommandsTwo = _.clone(Backbone.Radio.Commands);
      this.CommandsThree = _.clone(Backbone.Radio.Commands);
      this.callbackOne = stub();
      this.callbackTwo = stub();
      this.callbackThree = stub();
      this.Commands.complyFor(this.CommandsTwo, {
        commandOne: this.callbackOne,
        commandTwo: this.callbackOne
      });
      this.Commands.complyFor(this.CommandsThree, {
        commandTwo: this.callbackThree,
        commandThree: this.callbackThree
      });
      this.Commands.stopComplyingFor(undefined, 'commandTwo');
    });
    
    it('should only remove the proper callback on CommandsTwo', function() {
      expect(this.CommandsTwo._commands).to.not.have.key('commandTwo');
      expect(this.CommandsTwo._commands).to.have.key('commandOne');
    });

    it('should not touch the other callback on CommandsTwo', function() {
      expect(this.CommandsThree._commands).to.not.have.key('commandTwo');
      expect(this.CommandsThree._commands).to.have.key('commandThree');
    });
  });

  describe('`stopComplyingFor` with just the third argument', function() {
    beforeEach(function() {
      this.CommandsTwo = _.clone(Backbone.Radio.Commands);
      this.CommandsThree = _.clone(Backbone.Radio.Commands);
      this.callbackOne = stub();
      this.callbackTwo = stub();
      this.Commands.complyFor(this.CommandsTwo, {
        commandOne: this.callbackOne,
        commandTwo: this.callbackOne
      });
      this.Commands.complyFor(this.CommandsThree, 'commandThree', this.callbackTwo);
      this.Commands.stopComplyingFor(undefined, undefined, this.callbackOne);
    });
    
    it('should only remove the proper callback on CommandsTwo', function() {
      expect(this.CommandsTwo._commands).to.deep.equal({});
    });

    it('should not touch the other callback on CommandsTwo', function() {
      expect(this.CommandsThree._commands).to.have.key('commandThree');
    });
  });
});
