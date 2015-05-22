describe('When Radio is attached to your application', function() {
  it('should attach itself to Backbone.Radio', function() {
    expect(Backbone.Radio).to.exist;
  });

  it('should have a VERSION attribute', function() {
    expect(Backbone.Radio.VERSION).to.exist;
  });

  it('should have a noConflict method', function() {
    expect(Backbone.Radio.noConflict).to.exist;
  });

  it('should have the channel method', function() {
    expect(Backbone.Radio.channel).to.exist;
  });

  it('should have the Channel Class attached to it', function() {
    expect(Backbone.Radio.Channel).to.exist;
  });

  it('should have the Requests Class attached to it', function() {
    expect(Backbone.Radio.Requests).to.exist;
  });
});
