var previousRadio = Backbone.Radio;

var Radio = Backbone.Radio = {};

/**
 * Current Version of Radio
 * @readonly
 * @constant {String} VERSION
 */
Radio.VERSION = '<%= version %>';

/**
 * Restores the previous Backbone.Radio
 * @method
 * @return this
 */
Radio.noConflict = function () {
  Backbone.Radio = previousRadio;
  return this;
};
