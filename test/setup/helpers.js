function setupTestHelpers() {
  beforeEach(function() {
    this.sinon = sinon.sandbox.create();
  });

  afterEach(function() {
    Backbone.Radio.DEBUG = false;
    _.invoke(Backbone.Radio._channels, 'reset');
    this.sinon.restore();
  });
}

// when running in node
if (typeof exports !== 'undefined') {
  setupTestHelpers();
}

// when running in browser
else {
  mocha.setup('bdd');

  window.expect = chai.expect;
  window.sinon = sinon;

  onload = function() {
    mocha.checkLeaks();
    mocha.run();
    setupTestHelpers();
  };
}
