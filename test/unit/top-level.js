describe('Top-level API:', function() {
  beforeEach(function() {
    this.channel = Backbone.Radio.channel('myChannel');
    stub(this.channel);
  });

  describe('Reset', function() {
    beforeEach(function() {
      this.channelOne = Backbone.Radio.channel('channelOne');
      this.channelTwo = Backbone.Radio.channel('channelTwo');

      stub(this.channelOne, 'reset');
      stub(this.channelTwo, 'reset');
    });

    describe('when passing a channel name', function() {
      beforeEach(function() {
        Backbone.Radio.reset('channelOne');
      });

      it('should reset that channel', function() {
        expect(this.channelOne.reset).to.have.been.calledOnce;
      });

      it('should not reset the other channels', function() {
        expect(this.channel.reset).to.not.have.been.called;
        expect(this.channelTwo.reset).to.not.have.been.called;
      });
    });

    describe('when not passing a channel name', function() {
      beforeEach(function() {
        Backbone.Radio.reset();
      });

      it('should reset all channels', function() {
        expect(this.channel.reset).to.have.been.calledOnce;
        expect(this.channelOne.reset).to.have.been.calledOnce;
        expect(this.channelTwo.reset).to.have.been.calledOnce;
      });
    });
  });

  describe('when executing Requests methods', function() {
    beforeEach(function() {
      Backbone.Radio.reply('myChannel', 'some:request', 'firstArg1', 'secondArg1');
      Backbone.Radio.replyOnce('myChannel', 'some:request', 'firstArg2', 'secondArg2');
      Backbone.Radio.stopReplying('myChannel', 'some:request', 'firstArg3', 'secondArg3');
      Backbone.Radio.request('myChannel', 'some:request', 'firstArg4', 'secondArg4');
    });

    it('should execute each method on the proper channel with the arguments.', function() {
      expect(this.channel.reply)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('some:request', 'firstArg1', 'secondArg1');

      expect(this.channel.replyOnce)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('some:request', 'firstArg2', 'secondArg2');

      expect(this.channel.stopReplying)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('some:request', 'firstArg3', 'secondArg3');

      expect(this.channel.request)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('some:request', 'firstArg4', 'secondArg4');
    });
  });

  describe('when executing Events methods', function() {
    beforeEach(function() {
      Backbone.Radio.listenTo('myChannel', 'some:event', 'firstArg1', 'secondArg1');
      Backbone.Radio.listenToOnce('myChannel', 'some:event', 'firstArg2', 'secondArg2');
      Backbone.Radio.stopListening('myChannel', 'some:event', 'firstArg3', 'secondArg3');
      Backbone.Radio.trigger('myChannel', 'some:event', 'firstArg4', 'secondArg4');
      Backbone.Radio.on('myChannel', 'some:event', 'firstArg5', 'secondArg5');
      Backbone.Radio.once('myChannel', 'some:event', 'firstArg6', 'secondArg6');
      Backbone.Radio.off('myChannel', 'some:event', 'firstArg7', 'secondArg7');
    });

    it('should execute each method on the proper channel with the arguments.', function() {
      expect(this.channel.listenTo)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('some:event', 'firstArg1', 'secondArg1');

      expect(this.channel.listenToOnce)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('some:event', 'firstArg2', 'secondArg2');

      expect(this.channel.stopListening)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('some:event', 'firstArg3', 'secondArg3');

      expect(this.channel.trigger)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('some:event', 'firstArg4', 'secondArg4');

      expect(this.channel.on)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('some:event', 'firstArg5', 'secondArg5');

      expect(this.channel.once)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('some:event', 'firstArg6', 'secondArg6');

      expect(this.channel.off)
        .to.have.been.calledOnce
        .and.to.have.been.calledOn(this.channel)
        .and.calledWithExactly('some:event', 'firstArg7', 'secondArg7');
    });
  });
});
