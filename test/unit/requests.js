describe('Requests:', function() {
  beforeEach(function() {
    this.Requests = _.clone(Backbone.Radio.Requests);
    spy(this.Requests, 'request');
    spy(this.Requests, 'reply');
    spy(this.Requests, 'replyOnce');
    spy(this.Requests, 'stopReplying');
  });

  describe('when making a request that has no handler', function() {
    beforeEach(function() {
      this.Requests.request('unhandledEvent');
    });

    it('should not return anything.', function() {
      expect(this.Requests.request)
        .to.have.been.calledOnce
        .and.to.have.always.returned(undefined);
    });

    describe('but has a "default" handler', function() {
      beforeEach(function() {
        this.callback = stub();

        this.Requests.reply('default', this.callback);
        this.Requests.request('unhandledEvent', 'argOne', 'argTwo');
      });

      it('should pass along the arguments to the "default" handler.', function() {
        expect(this.callback)
          .to.have.been.calledOnce
          .and.calledWithExactly('unhandledEvent', 'argOne', 'argTwo');
      });
    });
  });

  describe('when making a request that has a handler', function() {
    beforeEach(function() {
      this.callback = stub().returns('myResponse');
    });

    describe('and no context', function() {
      beforeEach(function() {
        this.Requests.reply('myRequest', this.callback);
        this.Requests.request('myRequest', 'argOne', 'argTwo');
      });

      it('should pass along the arguments to the handler.', function() {
        expect(this.callback)
          .to.have.been.calledOnce
          .and.calledWithExactly('argOne', 'argTwo');
      });

      it('should return the value of the handler from `request`.', function() {
        expect(this.Requests.request).to.have.always.returned('myResponse');
      });

      it('should return Requests from `reply`', function() {
        expect(this.Requests.reply).to.have.always.returned(this.Requests);
      });

      it('should be called with the Requests object as the context', function() {
        expect(this.callback).to.have.always.been.calledOn(this.Requests);
      });
    });

    describe('and a context', function() {
      beforeEach(function() {
        this.context = {};
        this.Requests.reply('myRequest', this.callback, this.context);
        this.Requests.request('myRequest', 'argOne', 'argTwo');
      });

      it('should pass along the arguments to the handler.', function() {
        expect(this.callback)
          .to.have.been.calledOnce
          .and.calledWithExactly('argOne', 'argTwo');
      });

      it('should return the value of the handler from `request`.', function() {
        expect(this.Requests.request).to.have.always.returned('myResponse');
      });

      it('should return Requests from `reply`', function() {
        expect(this.Requests.reply).to.have.always.returned(this.Requests);
      });

      it('should be called with the correct context', function() {
        expect(this.callback).to.have.always.been.calledOn(this.context);
      });
    });

    describe('with many arguments', function() {
      beforeEach(function() {
        this.context = {};
        this.Requests.reply('myRequest', this.callback, this.context);
        this.Requests.request('myRequest', 'argOne', 'argTwo', 'argThree', 'argFour', 'argFive');
      });

      it('should pass all of the arguments', function() {
        expect(this.callback)
          .to.have.been.calledOnce
          .and.calledWithExactly('argOne', 'argTwo', 'argThree', 'argFour', 'argFive');
      });
    });
  });

  describe('when making a request multiple times that has a handler', function() {
    beforeEach(function() {
      this.callback = stub().returns('myResponse');

      this.Requests.reply('myRequest', this.callback);
      this.Requests.request('myRequest', 'argOne', 'argTwo');
      this.Requests.request('myRequest', 'argOne');
      this.Requests.request('myRequest', 'argTwo');
    });

    it('should always return the value of the handler from `request`.', function() {
      expect(this.callback)
        .to.have.been.calledThrice
        .and.to.have.been.calledWithExactly('argOne', 'argTwo')
        .and.to.have.always.returned('myResponse');
    });

    it('should return Requests from `reply`', function() {
      expect(this.Requests.reply).to.have.always.returned(this.Requests);
    });

    describe('and has a "default" handler', function() {
      beforeEach(function() {
        this.defaultCallback = stub();
        this.Requests.reply('default', this.defaultCallback);
        this.Requests.request('myRequest', 'argTwo');
      });

      it('should not call the "default" handler', function() {
        expect(this.defaultCallback).not.have.been.called;
      });
    });
  });

  describe('when making a request multiple times that has a `once` handler', function() {
    beforeEach(function() {
      this.callback = stub().returns('myResponse');

      this.Requests.replyOnce('myRequest', this.callback);
    });

    describe('and has no "default" handler', function() {
      beforeEach(function() {
        this.Requests.request('myRequest', 'argOne');
        this.Requests.request('myRequest', 'argTwo');
        this.Requests.request('myRequest', 'argTwo', 'argOne');
      });

      it('should call the handler just once.', function() {
        expect(this.callback)
          .to.have.been.calledOnce
          .and.to.have.been.calledWithExactly('argOne');
      });

      it('should return the value of the handler once for `request`.', function() {
        expect(this.Requests.request.returnValues[0]).to.equal('myResponse');
        expect(this.Requests.request.returnValues[1]).to.be.undefined;
        expect(this.Requests.request.returnValues[2]).to.be.undefined;
      });

      it('should return Requests from `replyOnce`', function() {
        expect(this.Requests.replyOnce).to.have.always.returned(this.Requests);
      });
    });

    describe('and has a "default" handler', function() {
      beforeEach(function() {
        this.defaultCallback = stub();

        this.Requests.reply('default', this.defaultCallback);
        this.Requests.request('myRequest', 'argOne', 'argTwo');
        this.Requests.request('myRequest', 'argOne');
        this.Requests.request('myRequest', 'argTwo');
      });

      it('should call the "default" handler for subsequent calls', function() {
        expect(this.defaultCallback)
          .to.have.been.calledTwice
          .and.calledAfter(this.callback)
          .and.calledWithExactly('myRequest', 'argOne')
          .and.calledWithExactly('myRequest', 'argTwo');
      });
    });
  });

  describe('when making a request that has a `once` handler & a context', function() {
    beforeEach(function() {
      this.context = {};
      this.callback = stub().returns('myResponse');

      this.Requests.replyOnce('myRequest', this.callback, this.context);
      this.Requests.request('myRequest', 'argOne', 'argTwo');
    });

    it('should pass along the arguments to the handler.', function() {
      expect(this.callback)
        .to.have.been.calledOnce
        .and.calledWithExactly('argOne', 'argTwo');
    });

    it('should return the value of the handler from `request`.', function() {
      expect(this.Requests.request).to.have.always.returned('myResponse');
    });

    it('should return Requests from `reply`', function() {
      expect(this.Requests.reply).to.have.always.returned(this.Requests);
    });

    it('should be called with the correct context', function() {
      expect(this.callback).to.have.always.been.calledOn(this.context);
    });
  });

  describe('when making a request that has a flat value as a handler', function() {
    beforeEach(function() {
      this.Requests.reply('myRequest', 'myResponse');
      this.Requests.request('myRequest');
    });

    it('should return that value.', function() {
      expect(this.Requests.request)
        .to.have.been.calledOnce
        .and.to.have.always.returned('myResponse');
    });
  });

  describe('when unregistering a handler from an object with no requests handlers', function() {
    beforeEach(function() {
      this.Requests.stopReplying('myRequest');
      this.stopReplying = _.partial(this.Requests.stopReplying, 'myRequest');
    });

    it('should not throw an Error.', function() {
      expect(this.stopReplying).to.not.throw(Error);
    });
  });

  describe('when calling stopReplying from a Requests instance', function() {
    beforeEach(function() {
      this.requestOne = stub();
      this.requestTwo = stub();
      this.requestThree = stub();
      this.contextOne = {};
      this.contextTwo = {};
      this.Requests.reply('requestOne', this.requestOne);
      this.Requests.reply('requestTwo', this.requestTwo);
      this.Requests.reply('requestThree', this.requestTwo, this.contextOne);
      this.Requests.reply('requestFour', this.requestTwo, this.contextTwo);
      this.Requests.reply('requestFive', this.requestThree, this.contextTwo);
    });

    describe('and passing a name', function() {
      beforeEach(function() {
        this.Requests.stopReplying('requestOne');
      });

      it('should remove the specified handler', function() {
        expect(this.Requests._requests).to.not.contain.keys('requestOne');
      });

      it('should leave the other handlers untouched', function() {
        expect(this.Requests._requests).to.have.keys(['requestTwo', 'requestThree', 'requestFour', 'requestFive']);
      });

      it('should return the instance of Requests from stopReplying', function() {
        expect(this.Requests.stopReplying).to.have.always.returned(this.Requests);
      });
    });

    describe('and not passing any arguments', function() {
      beforeEach(function() {
        this.Requests.stopReplying();
      });

      it('should remove all of the handlers', function() {
        expect(this.Requests._requests).to.be.undefined;
      });

      it('should return the instance of Requests from stopReplying', function() {
        expect(this.Requests.stopReplying).to.have.always.returned(this.Requests);
      });
    });

    describe('and passing just a callback', function() {
      beforeEach(function() {
        this.Requests.stopReplying(undefined, this.requestTwo);
      });

      it('should remove all handlers with that callback', function() {
        expect(this.Requests._requests).to.not.contain.keys('requestTwo', 'requestThree', 'requestFour');
      });

      it('should leave the other handlers', function() {
        expect(this.Requests._requests).to.have.keys(['requestOne', 'requestFive']);
      });

      it('should return the instance of Requests from stopReplying', function() {
        expect(this.Requests.stopReplying).to.have.always.returned(this.Requests);
      });
    });

    describe('and passing just a context', function() {
      beforeEach(function() {
        this.Requests.stopReplying(undefined, undefined, this.contextTwo);
      });

      it('should remove all handlers with that context', function() {
        expect(this.Requests._requests).to.not.contain.keys('requestFour', 'requestFive');
      });

      it('should leave the other handlers', function() {
        expect(this.Requests._requests).to.have.keys(['requestOne', 'requestTwo', 'requestThree']);
      });

      it('should return the instance of Requests from stopReplying', function() {
        expect(this.Requests.stopReplying).to.have.always.returned(this.Requests);
      });
    });

    describe('and passing a callback and a context', function() {
      beforeEach(function() {
        this.Requests.stopReplying(undefined, this.requestTwo, this.contextTwo);
      });

      it('should remove only matched handlers', function() {
        expect(this.Requests._requests).to.not.contain.keys('requestFour');
      });

      it('should leave the other handlers', function() {
        expect(this.Requests._requests).to.have.keys(['requestOne', 'requestTwo', 'requestThree', 'requestFive']);
      });

      it('should return the instance of Requests from stopReplying', function() {
        expect(this.Requests.stopReplying).to.have.always.returned(this.Requests);
      });
    });

    describe('and passing a name, callback, and context', function() {
      beforeEach(function() {
        this.Requests.stopReplying('requestThree', this.requestTwo, this.contextOne);
      });

      it('should remove that handler', function() {
        expect(this.Requests._requests).to.not.contain.keys('requestThree');
      });

      it('should leave the other handlers', function() {
        expect(this.Requests._requests).to.have.keys(['requestOne', 'requestTwo', 'requestFour', 'requestFive']);
      });

      it('should return the instance of Requests from stopReplying', function() {
        expect(this.Requests.stopReplying).to.have.always.returned(this.Requests);
      });
    });
  });

  describe('when calling `request` with object', function() {
    beforeEach(function() {
      this.Requests.reply('requestOne', 'replyOne');
      this.Requests.reply('requestTwo', 'replyTwo');
      this.Requests.request({
        'requestOne': 'argOne',
        'requestTwo': 'argTwo'
      });
    });

    it('should call the set of requests', function() {
      expect(this.Requests.request)
        .to.have.been.calledThrice
        .and.calledWith('requestOne', 'argOne')
        .and.calledWith('requestTwo', 'argTwo');
    });

    it('should return an object of replies', function() {
      expect(this.Requests.request)
        .to.have.returned({
          requestOne: 'replyOne',
          requestTwo: 'replyTwo'
        });
    });
  });

  describe('when calling `reply` with object', function() {
    beforeEach(function() {
      this.requestOneStub = stub();
      this.requestTwoStub = stub();

      this.context = {};

      this.Requests.reply({
        requestOne: this.requestOneStub,
        requestTwo: this.requestTwoStub
      }, this.context);
    });

    it('should return `this`', function() {
      expect(this.Requests.reply).to.have.always.returned(this.Requests);
    });

    it('should call the set of requests', function() {
      expect(this.Requests.reply)
        .to.have.been.calledThrice
        .and.calledWith('requestOne', this.requestOneStub, this.context)
        .and.calledWith('requestTwo', this.requestTwoStub, this.context);
    });
  });

  describe('when calling `replyOnce` with object', function() {
    beforeEach(function() {
      this.requestOneStub = stub();
      this.requestTwoStub = stub();

      this.context = {};

      this.Requests.replyOnce({
        requestOne: this.requestOneStub,
        requestTwo: this.requestTwoStub
      }, this.context);
    });

    it('should return `this`', function() {
      expect(this.Requests.replyOnce).to.have.always.returned(this.Requests);
    });

    it('should call the set of requests', function() {
      expect(this.Requests.replyOnce)
        .to.have.been.calledThrice
        .and.calledWith('requestOne', this.requestOneStub, this.context)
        .and.calledWith('requestTwo', this.requestTwoStub, this.context);
    });
  });

  describe('when calling `stopReplying` with object', function() {
    beforeEach(function() {
      this.Requests.stopReplying({
        requestOne: null,
        requestTwo: null
      });
    });

    it('should return `this`', function() {
      expect(this.Requests.stopReplying).to.have.always.returned(this.Requests);
    });

    it('should call the set of requests', function() {
      expect(this.Requests.stopReplying)
        .to.have.been.calledThrice
        .and.calledWith('requestOne')
        .and.calledWith('requestTwo');
    });
  });

  describe('when calling `request` with space-separated requests', function() {
    beforeEach(function() {
      this.Requests.reply('requestOne', 'replyOne');
      this.Requests.reply('requestTwo', 'replyTwo');
      this.Requests.request('requestOne requestTwo', 'argOne', 'argTwo');
    });

    it('should call `request` with the correct requests', function() {
      expect(this.Requests.request)
        .to.have.been.calledThrice
        .and.calledWith('requestOne', 'argOne', 'argTwo')
        .and.calledWith('requestTwo', 'argOne', 'argTwo');
    });

    it('should return an object of replies', function() {
      expect(this.Requests.request)
        .to.have.returned({
          requestOne: 'replyOne',
          requestTwo: 'replyTwo'
        });
    });
  });

  describe('when calling `reply` with space-separated requests', function() {
    beforeEach(function() {
      this.Requests.reply('requestOne requestTwo', 'argOne', 'argTwo');
    });

    it('should call `reply` with the correct requests', function() {
      expect(this.Requests.reply)
        .to.have.been.calledThrice
        .and.calledWith('requestOne', 'argOne', 'argTwo')
        .and.calledWith('requestTwo', 'argOne', 'argTwo');
    });
  });

  describe('when calling `replyOnce` with space-separated requests', function() {
    beforeEach(function() {
      this.Requests.replyOnce('requestOne requestTwo', 'argOne', 'argTwo');
    });

    it('should call `replyOnce` with the correct requests', function() {
      expect(this.Requests.replyOnce)
        .to.have.been.calledThrice
        .and.calledWith('requestOne', 'argOne', 'argTwo')
        .and.calledWith('requestTwo', 'argOne', 'argTwo');
    });
  });

  describe('when calling `stopReplying` with space-separated requests', function() {
    beforeEach(function() {
      this.Requests.stopReplying('requestOne requestTwo');
    });

    it('should call `stopReplying` with the correct requests', function() {
      expect(this.Requests.stopReplying)
        .to.have.been.calledThrice
        .and.calledWith('requestOne')
        .and.calledWith('requestTwo');
    });
  });

  describe('when calling `request` with object with space-separated keys of requests', function() {
    beforeEach(function() {
      this.Requests.reply('requestOne', 'replyOne');
      this.Requests.reply('requestTwo', 'replyTwo');
      this.Requests.reply('requestThree', 'replyThree');
      this.Requests.request({
        'requestOne requestTwo': 'argOne',
        'requestThree': 'argTwo'
      });
    });

    it('should call the set of requests', function() {
      expect(this.Requests.request)
        .to.have.callCount(5)
        .and.calledWith('requestOne', 'argOne')
        .and.calledWith('requestTwo', 'argOne')
        .and.calledWith('requestThree', 'argTwo');
    });

    it('should return an object of replies', function() {
      expect(this.Requests.request)
        .to.have.returned({
          requestOne: 'replyOne',
          requestTwo: 'replyTwo',
          requestThree: 'replyThree'
        });
    });
  });

  describe('when calling `request` with object with space-separated keys of requests with matching with matching keys', function() {
    beforeEach(function() {
      this.Requests.reply('requestOne requestTwo', _.identity);
      this.Requests.request({
        'requestOne requestTwo': 'argOne',
        'requestTwo': 'argTwo'
      });
    });

    it('should call the set of requests', function() {
      expect(this.Requests.request)
        .to.have.callCount(5)
        .and.calledWith('requestOne', 'argOne')
        .and.calledWith('requestTwo', 'argOne')
        .and.calledWith('requestTwo', 'argTwo');
    });

    it('should return an object of replies override duplicate keys', function() {
      expect(this.Requests.request)
        .to.have.returned({
          requestOne: 'argOne',
          requestTwo: 'argTwo'
        });
    });
  });
});
