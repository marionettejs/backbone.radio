import { expect } from 'chai';
import sinonCreate from 'sinon';
import Radio from '../../src/';

describe('Tune-in:', function() {
  let sinon;

  beforeEach(() => {
    sinon = sinonCreate.createSandbox();
  });

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(function() {
    this.channel = Radio.channel('myChannel');
    sinon.stub(console, 'log');
    Radio.tuneIn('myChannel');
  });

  afterEach(function() {
    Radio.tuneOut('myChannel');
  });

  describe('both methods, tuneIn and tuneOut,', function() {
    beforeEach(function() {
      sinon.spy(Radio, 'tuneIn');
      sinon.spy(Radio, 'tuneOut');
      Radio.tuneIn('myChannel');
      Radio.tuneOut('myChannel');
    });

    it('should return the Radio object', function() {
      expect(Radio.tuneIn)
        .to.have.been.calledOnce
        .and.to.have.always.returned(Radio);
      expect(Radio.tuneOut)
        .to.have.been.calledOnce
        .and.to.have.always.returned(Radio);
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
      Radio.tuneOut('myChannel');
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
      Radio.tuneOut('myChannel');
      this.channel.request('some:event');
    });

    it('should not log that activity', function() {
      expect(console.log).to.not.have.been.called;
    });
  });

  describe('When providing a custom logging function and tuning it', function() {
    beforeEach(function() {
      sinon.stub(Radio, 'log');
      this.channel.request('some:event', 'argOne', 'argTwo');
    });

    it('should log your custom message', function() {
      expect(Radio.log)
        .to.have.been.calledOnce
        .and.calledOn(this.channel)
        .and.calledWithExactly('myChannel', 'some:event', 'argOne', 'argTwo');
    });
  });
});
