function setupTestHelpers() {
  beforeEach(function() {
    this.sinon = sinon.sandbox.create();
    global.stub = _.bind(this.sinon.stub, this.sinon);
    global.spy  = _.bind(this.sinon.spy, this.sinon);
  });

  afterEach(function() {
    Backbone.Radio.DEBUG = false;
    _.invoke(Backbone.Radio._channels, 'reset');
    this.sinon.restore();
    delete global.stub;
    delete global.spy;
  });
}

// when running in node
if (typeof exports !== 'undefined') {
  setupTestHelpers();
}

// when running in browser
else {
  this.global = window;
  mocha.setup('bdd');

  window.expect = chai.expect;
  window.sinon = sinon;

  onload = function() {
    mocha.checkLeaks();
    mocha.globals(['stub', 'spy']);
    mocha.run();
    setupTestHelpers();
  };
}
