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
  });

  describe('when making a request multiple times that has a `once` handler', function() {
    beforeEach(function() {
      this.callback = stub().returns('myResponse');

      this.Requests.replyOnce('myRequest', this.callback);
      this.Requests.request('myRequest', 'argOne', 'argTwo');
      this.Requests.request('myRequest');
      this.Requests.request('myRequest');
    });

    it('should call the handler just once.', function() {
      expect(this.callback)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly('argOne', 'argTwo');
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
      this.Requests.reply('requestOne', this.requestOne);
      this.Requests.reply('requestTwo', this.requestTwo);
      this.Requests.stopReplying();
    });

    it('should remove all of the handlers', function() {
      expect(this.Requests._requests).to.be.undefined;
    });

    it('should return the instance of Requests from stopReplying', function() {
      expect(this.Requests.stopReplying).to.have.always.returned(this.Requests);
    });

    describe('and subsequently calling the handler', function() {
      beforeEach(function() {
        this.Requests.request(this.requestOne);
        this.Requests.request(this.requestTwo);
      });

      it('should not execute them', function() {
        expect(this.requestOne).to.have.not.beenCalled;
        expect(this.requestTwo).to.have.not.beenCalled;
      });
    });
  });
});
