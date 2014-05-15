(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], function(Backbone, _) {
      return factory(Backbone, _);
    });
  }
  else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    module.exports = factory(Backbone, _);
  }
  else {
    factory(root.Backbone, root._);
  }
}(this, function(Backbone, _) {
  'use strict';

  var previousRadio = Backbone.Radio;

  var Radio = Backbone.Radio = {};

  Backbone.Radio.VERSION = '<%= version %>';

  Backbone.Radio.noConflict = function () {
    Backbone.Radio = previousRadio;
    return this;
  };

  // @include radio.js
  // @include methods.js
  // @include factory.js
  // @include commands.js
  // @include requests.js
  // @include channel.js
  // @include proxy.js

  return Backbone.Radio;
}));
