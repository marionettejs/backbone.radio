module.exports = function(root) {
  global._ = require('underscore');
  global.Backbone = require('backbone');
  global.expect = global.chai.expect;
  global.slice = Array.prototype.slice;
  global.Radio = require('../../src/backbone.radio');

  beforeEach(function() {
    this.sinon = global.sinon.sandbox.create();
    global.stub = this.sinon.stub.bind(this.sinon);
    global.spy  = this.sinon.spy.bind(this.sinon);
  });

  afterEach(function() {
    global.Backbone.Radio.DEBUG = false;
    global.Backbone.Radio.reset();
    delete global.stub;
    delete global.spy;
    this.sinon.restore();
  });
};
