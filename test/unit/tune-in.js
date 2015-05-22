describe('Tune-in:', function() {
  beforeEach(function() {
    this.channel = Backbone.Radio.channel('myChannel');
    stub(console, 'log');
    Backbone.Radio.tuneIn('myChannel');
  });

  afterEach(function() {
    Backbone.Radio.tuneOut('myChannel');
  });

  describe('both methods, tuneIn and tuneOut,', function() {
    beforeEach(function() {
      spy(Backbone.Radio, 'tuneIn');
      spy(Backbone.Radio, 'tuneOut');
      Backbone.Radio.tuneIn('myChannel');
      Backbone.Radio.tuneOut('myChannel');
    });

    it('should return the Radio object', function() {
      expect(Backbone.Radio.tuneIn)
        .to.have.been.calledOnce
        .and.to.have.always.returned(Backbone.Radio);
      expect(Backbone.Radio.tuneOut)
        .to.have.been.calledOnce
        .and.to.have.always.returned(Backbone.Radio);
    });
  });

  describe('when tuned into a channel and emitting an event', function() {
    beforeEach(function() {
      this.warning = '[myChannel] "some:event"';
      this.channel.trigger('some:event', 'argOne', 'argTwo');
    });

    it('should log that activity, with the arguments', function() {
      expect(console.log).to.have.been.calledOnce.and.calledWithExactly(this.warning, ['argOne', 'argTwo']);
    });
  });

  describe('when tuning in, then out, and emitting an event', function() {
    beforeEach(function() {
      Backbone.Radio.tuneOut('myChannel');
      this.channel.trigger('some:event');
    });

    it('should not log that activity', function() {
      expect(console.log).to.not.have.been.called;
    });
  });

  describe('when tuned into a channel and making a request', function() {
    beforeEach(function() {
      this.warning = '[myChannel] "some:event"';
      this.channel.request('some:event', 'argOne', 'argTwo');
    });

    it('should log that activity', function() {
      expect(console.log).to.have.been.calledOnce.and.calledWithExactly(this.warning, ['argOne', 'argTwo']);
    });
  });

  describe('when tuning in, then out, and making a request', function() {
    beforeEach(function() {
      Backbone.Radio.tuneOut('myChannel');
      this.channel.request('some:event');
    });

    it('should not log that activity', function() {
      expect(console.log).to.not.have.been.called;
    });
  });

  describe('When providing a custom logging function and tuning it', function() {
    beforeEach(function() {
      stub(Backbone.Radio, 'log');
      this.channel.request('some:event', 'argOne', 'argTwo');
    });

    it('should log your custom message', function() {
      expect(Backbone.Radio.log)
        .to.have.been.calledOnce
        .and.calledOn(this.channel)
        .and.calledWithExactly('myChannel', 'some:event', 'argOne', 'argTwo');
    });
  });
});
