import { expect } from 'chai';
import sinonCreate from 'sinon';
import Radio, { Events, Requests } from '../../src/';

describe('Channel:', function() {
  let sinon;

  beforeEach(() => {
    sinon = sinonCreate.createSandbox();
  });

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(function() {
    this.channel = Radio.channel('myChannel');
    this.channelTwo = Radio.channel('myOtherChannel');
  });

  describe('when calling Radio.channel with no name', function() {
    it('should throw an error', function() {
      expect(Radio.channel).to.throw(Error, 'You must provide a name for the channel.');
    });
  });

  describe('upon creation', function() {
    it('should create a new instance of the Channel', function() {
      expect(this.channel).to.be.instanceOf(Radio.Channel);
    });

    it('should have its name set', function() {
      expect(this.channel).to.have.property('channelName', 'myChannel');
    });

    it('should have all of the Backbone.Events methods', function() {
      expect(this.channel).to.contain(Events);
    });

    it('should have all of the Radio.Requests methods', function() {
      expect(this.channel).to.contain(Requests);
    });
  });

  describe('calling channel twice with the same name', function() {
    beforeEach(function() {
      this.channelCopy = Radio.channel('myChannel');
    });

    it('should return the same channel', function() {
      expect(this.channelCopy).to.deep.equal(this.channel);
    });
  });

  describe('executing the `reset` method of a Channel', function() {
    it('should call the reset functions of Events', function() {
      sinon.stub(this.channel, 'off');
      sinon.stub(this.channel, 'stopListening');


      this.channel.reset();
      expect(this.channel.off).to.have.been.calledOnce;
      expect(this.channel.stopListening).to.have.been.calledOnce;
    });

    it('should call the reset functions of Requests', function() {
      sinon.stub(this.channel, 'stopReplying');

      this.channel.reset();

      expect(this.channel.stopReplying).to.have.been.calledOnce;
    });

    it('should return the Channel', function() {
      sinon.spy(this.channel, 'reset');

      this.channel.reset();

      expect(this.channel.reset).to.have.always.returned(this.channel);
    });
  });

  describe('when executing an event that exists on two channels', function() {
    beforeEach(function() {
      this.callbackOne = sinon.stub();
      this.callbackTwo = sinon.stub();
    });

    describe('on Events', function() {
      beforeEach(function() {
        this.channel.on('some:event', this.callbackOne);
        this.channelTwo.on('some:event', this.callbackOne);

        this.channel.trigger('some:event');
      });

      it('should only trigger the callback on the channel specified', function() {
        expect(this.callbackOne).to.have.been.calledOnce;
        expect(this.callbackTwo).to.not.have.been.called;
      });
    });

    describe('on Requests', function() {
      beforeEach(function() {
        this.channel.reply('some:request', this.callbackOne);
        this.channelTwo.reply('some:request', this.callbackOne);

        this.channel.request('some:request');
      });

      it('should only trigger the callback on the channel specified', function() {
        expect(this.callbackOne).to.have.been.calledOnce;
        expect(this.callbackTwo).to.not.have.been.called;
      });
    });
  });
});
