describe('Requests:', function() {
  beforeEach(function() {
    this.actionName = 'foo';
    this.Requests = _.clone(Backbone.Radio.Requests);
    this.requestSpy = this.sinon.spy(this.Requests, 'request');
  });

  describe('when making a request that has no handler', function() {
    beforeEach(function() {
      this.Requests.request('foobar');
    });

    it('should not return anything.', function() {
      expect(this.requestSpy)
        .to.have.been.calledOnce
        .and.to.have.always.returned(undefined);
    });
  });

  describe('when making a request that has a handler', function() {
    beforeEach(function() {
      this.argumentOne = 'foo';
      this.argumentTwo = 'bar';

      this.callbackReturned = 'request complete';
      this.callbackStub = this.sinon.stub().returns(this.callbackReturned);

      this.Requests.respond(this.actionName, this.callbackStub);
      this.Requests.request(this.actionName, this.argumentOne, this.argumentTwo);
    });

    it('should pass along the arguments to the handler.', function() {
      expect(this.callbackStub)
        .to.have.been.calledOnce
        .and.calledWithExactly(this.argumentOne, this.argumentTwo);
    });

    it('should return the value of the handler.', function() {
      expect(this.requestSpy).to.have.always.returned(this.callbackReturned);
    });
  });

  describe('when making a request multiple times that has a handler', function() {
    beforeEach(function() {
      this.argumentOne = 'foo';
      this.argumentTwo = 'bar';

      this.callbackReturned = 'request complete';
      this.callbackStub = this.sinon.stub().returns(this.callbackReturned);

      this.Requests.respond(this.actionName, this.callbackStub);
      this.Requests.request(this.actionName, this.argumentOne, this.argumentTwo);
      this.Requests.request(this.actionName, this.argumentOne);
      this.Requests.request(this.actionName, this.argumentTwo);
    });

    it('should return the value of the handler.', function() {
      expect(this.callbackStub)
        .to.have.been.calledThrice
        .and.to.have.been.calledWithExactly(this.argumentOne, this.argumentTwo)
        .and.to.have.always.returned(this.callbackReturned);
    });
  });

  describe('when making a request multiple times that has a `once` handler', function() {
    beforeEach(function() {
      this.argumentOne = 'foo';
      this.argumentTwo = 'bar';

      this.callbackReturned = 'request complete';
      this.callbackStub = this.sinon.stub().returns(this.callbackReturned);

      this.Requests.respondOnce(this.actionName, this.callbackStub);
      this.Requests.request(this.actionName, this.argumentOne);
      this.Requests.request(this.actionName, this.argumentTwo);
      this.Requests.request(this.actionName, this.argumentTwo, this.argumentOne);
    });

    it('should call the handler just once.', function() {
      expect(this.callbackStub)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly(this.argumentOne);
    });

    it('should return the value of the handler once.', function() {
      expect(this.requestSpy.returnValues[0]).to.equal(this.callbackReturned);
      expect(this.requestSpy.returnValues[1]).to.be.undefined;
      expect(this.requestSpy.returnValues[2]).to.be.undefined;
    });
  });

  describe('when making a request that has a flat value as a handler', function() {
    beforeEach(function() {
      this.response = 'foobar';
      this.Requests.respond(this.actionName, this.response);
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
      this.Requests.stopResponding(this.requestName);
      this.stopResponding = _.partial(this.Requests.stopResponding, this.requestName);
    });

    it('should not throw an Error.', function() {
      expect(this.stopResponding).to.not.throw(Error);
    });
  });
});
