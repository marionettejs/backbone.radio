var requireHelper = require('./require_helper');
var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');

global._ = require('underscore');
global.Backbone = require('backbone');
global.Radio = requireHelper('backbone.radio');

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;
