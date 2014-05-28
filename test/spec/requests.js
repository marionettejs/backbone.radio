describe('Requests:', function() {
  beforeEach(function() {
    this.actionName = 'foo';
    this.Requests = _.clone(Backbone.Radio.Requests);
  });

  describe('when making a request that has no handler', function() {
    beforeEach(function() {
      this.returned = this.Requests.request('foobar');
    });

    it('should not return anything.', function() {
      expect(this.returned).to.be.undefined;
    });
  });

  describe('when making a request that has a handler', function() {
    beforeEach(function() {
      this.argumentOne = 'foo';
      this.argumentTwo = 'bar';

      this.callbackReturned = 'request complete';
      this.callbackStub = this.sinon.stub().returns(this.callbackReturned);

      this.Requests.respond(this.actionName, this.callbackStub);
      this.returned = this.Requests.request(this.actionName, this.argumentOne, this.argumentTwo);
    });

    it('should pass along the arguments to the handler.', function() {
      expect(this.callbackStub).to.have.been.calledOnce.and.calledWithExactly(this.argumentOne, this.argumentTwo);
    });

    it('should return the value of the handler.', function() {
      expect(this.returned).to.equal(this.callbackReturned);
    });
  });

  describe('when making a request that has a flat value as a handler', function() {
    beforeEach(function() {
      this.response = 'foobar';
      this.Requests.respond(this.actionName, this.response);
      this.returned = this.Requests.request(this.actionName);
    });

    it('should return that value.', function() {
      expect(this.returned).to.equal(this.response);
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
