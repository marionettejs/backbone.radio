describe('Requests:', function() {
  beforeEach(function() {
    this.actionName = 'actionName';
    this.Requests = _.clone(Backbone.Radio.Requests);
    this.requestSpy = spy(this.Requests, 'request');
    this.replySpy = spy(this.Requests, 'reply');
    this.replyOnceSpy = spy(this.Requests, 'replyOnce');
    this.stopReplyingSpy = spy(this.Requests, 'stopReplying');
  });

  describe('when making a request that has no handler', function() {
    beforeEach(function() {
      this.Requests.request('unhandledEvent');
    });

    it('should not return anything.', function() {
      expect(this.requestSpy)
        .to.have.been.calledOnce
        .and.to.have.always.returned(undefined);
    });
  });

  describe('when making a request that has a handler', function() {
    beforeEach(function() {
      this.argumentOne = 'argOne';
      this.argumentTwo = 'argTwo';

      this.callbackReturned = 'request complete';
      this.callbackStub = stub().returns(this.callbackReturned);
    });

    describe('and no context', function() {
      beforeEach(function() {
        this.Requests.reply(this.actionName, this.callbackStub);
        this.Requests.request(this.actionName, this.argumentOne, this.argumentTwo);
      });

      it('should pass along the arguments to the handler.', function() {
      expect(this.callbackStub)
        .to.have.been.calledOnce
        .and.calledWithExactly(this.argumentOne, this.argumentTwo);
      });

      it('should return the value of the handler from `request`.', function() {
        expect(this.requestSpy).to.have.always.returned(this.callbackReturned);
      });

      it('should return Requests from `reply`', function() {
        expect(this.replySpy).to.have.always.returned(this.Requests);
      });

      it('should be called with the Requests object as the context', function() {
        expect(this.callbackStub).to.have.always.been.calledOn(this.Requests);
      });
    });

    describe('and a context', function() {
      beforeEach(function() {
        this.context = {};
        this.Requests.reply(this.actionName, this.callbackStub, this.context);
        this.Requests.request(this.actionName, this.argumentOne, this.argumentTwo);
      });

      it('should pass along the arguments to the handler.', function() {
        expect(this.callbackStub)
          .to.have.been.calledOnce
          .and.calledWithExactly(this.argumentOne, this.argumentTwo);
      });

      it('should return the value of the handler from `request`.', function() {
        expect(this.requestSpy).to.have.always.returned(this.callbackReturned);
      });

      it('should return Requests from `reply`', function() {
        expect(this.replySpy).to.have.always.returned(this.Requests);
      });

      it('should be called with the correct context', function() {
        expect(this.callbackStub).to.have.always.been.calledOn(this.context);
      });
    });
  });

  describe('when making a request multiple times that has a handler', function() {
    beforeEach(function() {
      this.argumentOne = 'argOne';
      this.argumentTwo = 'argTwo';

      this.callbackReturned = 'request complete';
      this.callbackStub = stub().returns(this.callbackReturned);

      this.Requests.reply(this.actionName, this.callbackStub);
      this.Requests.request(this.actionName, this.argumentOne, this.argumentTwo);
      this.Requests.request(this.actionName, this.argumentOne);
      this.Requests.request(this.actionName, this.argumentTwo);
    });

    it('should always return the value of the handler from `request`.', function() {
      expect(this.callbackStub)
        .to.have.been.calledThrice
        .and.to.have.been.calledWithExactly(this.argumentOne, this.argumentTwo)
        .and.to.have.always.returned(this.callbackReturned);
    });

    it('should return Requests from `reply`', function() {
      expect(this.replySpy).to.have.always.returned(this.Requests);
    });
  });

  describe('when making a request multiple times that has a `once` handler', function() {
    beforeEach(function() {
      this.argumentOne = 'argOne';
      this.argumentTwo = 'argTwo';

      this.callbackReturned = 'request complete';
      this.callbackStub = stub().returns(this.callbackReturned);

      this.Requests.replyOnce(this.actionName, this.callbackStub);
      this.Requests.request(this.actionName, this.argumentOne);
      this.Requests.request(this.actionName, this.argumentTwo);
      this.Requests.request(this.actionName, this.argumentTwo, this.argumentOne);
    });

    it('should call the handler just once.', function() {
      expect(this.callbackStub)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(this.argumentOne);
    });

    it('should return the value of the handler once for `request`.', function() {
      expect(this.requestSpy.returnValues[0]).to.equal(this.callbackReturned);
      expect(this.requestSpy.returnValues[1]).to.be.undefined;
      expect(this.requestSpy.returnValues[2]).to.be.undefined;
    });

    it('should return Requests from `replyOnce`', function() {
      expect(this.replyOnceSpy).to.have.always.returned(this.Requests);
    });
  });

  describe('when making a request that has a `once` handler & a context', function() {
    beforeEach(function() {
      this.argumentOne = 'argOne';
      this.argumentTwo = 'argTwo';
      this.context = {};

      this.callbackReturned = 'request complete';
      this.callbackStub = stub().returns(this.callbackReturned);

      this.Requests.replyOnce(this.actionName, this.callbackStub, this.context);
      this.Requests.request(this.actionName, this.argumentOne, this.argumentTwo);
    });

    it('should pass along the arguments to the handler.', function() {
      expect(this.callbackStub)
        .to.have.been.calledOnce
        .and.calledWithExactly(this.argumentOne, this.argumentTwo);
    });

    it('should return the value of the handler from `request`.', function() {
      expect(this.requestSpy).to.have.always.returned(this.callbackReturned);
    });

    it('should return Requests from `reply`', function() {
      expect(this.replySpy).to.have.always.returned(this.Requests);
    });

    it('should be called with the correct context', function() {
      expect(this.callbackStub).to.have.always.been.calledOn(this.context);
    });
  });

  describe('when making a request that has a flat value as a handler', function() {
    beforeEach(function() {
      this.response = 'a response';
      this.Requests.reply(this.actionName, this.response);
      this.Requests.request(this.actionName);
    });

    it('should return that value.', function() {
      expect(this.requestSpy)
        .to.have.been.calledOnce
        .and.to.have.always.returned(this.response);
    });
  });

  describe('when unregistering a handler from an object with no requests handlers', function() {
    beforeEach(function() {
      this.Requests.stopReplying(this.requestName);
      this.stopReplying = _.partial(this.Requests.stopReplying, this.requestName);
    });

    it('should not throw an Error.', function() {
      expect(this.stopReplying).to.not.throw(Error);
    });
  });

  describe('when calling stopReplying from a Requests instance', function() {
    beforeEach(function() {
      this.requestOne = 'requestOne';
      this.requestTwo = 'requestTwo';
      this.requestOneStub = stub();
      this.requestTwoStub = stub();
      this.Requests.reply(this.requestOne, this.requestOneStub);
      this.Requests.reply(this.requestTwo, this.requestTwoStub);
      this.Requests.stopReplying();
    });

    it('should remove all of the handlers', function() {
      expect(this.Requests._requests).to.be.undefined;
    });

    it('should return the instance of Requests from stopReplying', function() {
      expect(this.stopReplyingSpy).to.have.always.returned(this.Requests);
    });

    describe('and subsequently calling the handler', function() {
      beforeEach(function() {
        this.Requests.request(this.requestOne);
        this.Requests.request(this.requestTwo);
      });

      it('should not execute them', function() {
        expect(this.requestOneStub).to.have.not.beenCalled;
        expect(this.requestTwoStub).to.have.not.beenCalled;
      });
    });
  });
});
