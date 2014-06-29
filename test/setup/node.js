var requireHelper = require('./require_helper');
var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');

global._ = require('underscore');
global.Backbone = require('backbone');

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;

global.slice = Array.prototype.slice;

requireHelper('misc');
global.Radio = Backbone.Radio;

requireHelper('radio');
requireHelper('tune-in');
requireHelper('commands');
requireHelper('requests');
requireHelper('channel');
requireHelper('proxy');
