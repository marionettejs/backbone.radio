global._ = require('underscore');
global.Backbone = require('backbone');
global.Radio = require('../../.tmp/backbone.radio');

var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;
