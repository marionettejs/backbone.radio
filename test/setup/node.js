var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');

global._ = require('underscore');
global.Backbone = require('backbone');

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;

global.slice = Array.prototype.slice;

require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'backbone.radio');

global.Radio = Backbone.Radio;
