describe('Calling channel on a nonexistent channel', function() {
  beforeEach(function() {
    this.channel = Backbone.Radio.channel('foobar');
  });

  it('should create a new instance of the Channel', function() {
    expect(this.channel).to.be.instanceOf(Backbone.Radio.Channel);
  });
});

describe('Calling channel twice with the same name', function() {
  beforeEach(function() {
    this.channelOne = Backbone.Radio.channel('foobar');
    this.channelTwo = Backbone.Radio.channel('foobar');
  });

  it('should return the same channel', function() {
    expect(this.channelOne).to.equal(this.channelTwo);
  });
});
