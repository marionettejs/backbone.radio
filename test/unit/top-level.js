import { expect } from 'chai';
import sinonCreate from 'sinon';
import Radio from '../../src/';


describe('Top-level API:', function() {
  let sinon;

  beforeEach(function() {
    sinon = sinonCreate.createSandbox();
    this.channel = Radio.channel('myChannel');
    sinon.stub(this.channel);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Reset', function() {
    beforeEach(function() {
      this.channelOne = Radio.channel('channelOne');
      this.channelTwo = Radio.channel('channelTwo');

      sinon.stub(this.channelOne, 'reset');
      sinon.stub(this.channelTwo, 'reset');
    });

    describe('when passing a channel name', function() {
      beforeEach(function() {
        Radio.reset('channelOne');
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
        Radio.reset();
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
      Radio.reply('myChannel', 'some:request', 'firstArg1', 'secondArg1');
      Radio.replyOnce('myChannel', 'some:request', 'firstArg2', 'secondArg2');
      Radio.stopReplying('myChannel', 'some:request', 'firstArg3', 'secondArg3');
      Radio.request('myChannel', 'some:request', 'firstArg4', 'secondArg4');
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
      Radio.listenTo('myChannel', 'some:event', 'firstArg1', 'secondArg1');
      Radio.listenToOnce('myChannel', 'some:event', 'firstArg2', 'secondArg2');
      Radio.stopListening('myChannel', 'some:event', 'firstArg3', 'secondArg3');
      Radio.trigger('myChannel', 'some:event', 'firstArg4', 'secondArg4');
      Radio.on('myChannel', 'some:event', 'firstArg5', 'secondArg5');
      Radio.once('myChannel', 'some:event', 'firstArg6', 'secondArg6');
      Radio.off('myChannel', 'some:event', 'firstArg7', 'secondArg7');
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
