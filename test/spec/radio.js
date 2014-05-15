describe('Calling channel on a nonexistent channel', function() {
  var channel;

  beforeEach(function() {
    channel = Backbone.Radio.channel('global');
  });

  it('should create a new instance of the Channel', function() {
    expect(channel).to.be.instanceOf(Backbone.Radio.Channel);
  });
});

describe('Calling channel twice with the same name', function() {
  var channelOne, channelTwo;

  beforeEach(function() {
    channelOne = Backbone.Radio.channel('global');
    channelTwo = Backbone.Radio.channel('global');
  });

  it('should return the same channel', function() {
    expect(channelOne).to.equal(channelTwo);
  });
});
