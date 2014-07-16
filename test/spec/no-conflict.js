describe('No conflict:', function() {
  beforeEach(function() {
    this.noConflictSpy = spy(Backbone.Radio, 'noConflict');
    this.radio = Backbone.Radio;
    Backbone.Radio.noConflict();
  });

  afterEach(function() {
    Backbone.Radio = this.radio;
  });

  it('should have always returned the new instance of Backbone.Radio', function() {
    expect(this.noConflictSpy).to.have.always.returned(this.radio);
  });

  it('should set Backbone.Radio to be what it was before: undefined', function() {
    expect(Backbone.Radio).to.be.undefined;
  });
});
