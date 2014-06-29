var previousRadio = Backbone.Radio;

var Radio = Backbone.Radio = {};

Radio.VERSION = '<%= version %>';

Radio.noConflict = function () {
  Backbone.Radio = previousRadio;
  return this;
};
