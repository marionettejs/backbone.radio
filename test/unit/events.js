import _ from 'underscore';
import { expect } from 'chai';
import sinonCreate from 'sinon';
import { Events } from '../../src/';

// Tests copied from Backbone.Events

describe('Events:', function() {
  let sinon;

  beforeEach(function() {
    sinon = sinonCreate.createSandbox();
    this.Events = _.clone(Events);
  });

  afterEach(() => {
    sinon.restore();
  });

  specify('on and trigger', function() {
    const obj = {counter: 0};
    _.extend(obj, this.Events);
    obj.on('event', function() { obj.counter += 1; });
    obj.trigger('event');
    expect(obj.counter).to.equal(1);
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    expect(obj.counter).to.equal(5);
  });

  specify('binding and triggering multiple events', function() {
    const obj = {counter: 0};
    _.extend(obj, this.Events);

    obj.on('a b c', function() { obj.counter += 1; });

    obj.trigger('a');
    expect(obj.counter).to.equal(1);

    obj.trigger('a b');
    expect(obj.counter).to.equal(3);

    obj.trigger('c');
    expect(obj.counter).to.equal(4);

    obj.off('a c');
    obj.trigger('a b c');
    expect(obj.counter).to.equal(5);
  });

  specify('binding and triggering with event maps', function() {
    const obj = {counter: 0};
    _.extend(obj, this.Events);

    const increment = function() {
      this.counter += 1;
    };

    obj.on({
      a: increment,
      b: increment,
      c: increment
    }, obj);

    obj.trigger('a');
    expect(obj.counter).to.equal(1);

    obj.trigger('a b');
    expect(obj.counter).to.equal(3);

    obj.trigger('c');
    expect(obj.counter).to.equal(4);

    obj.off({
      a: increment,
      c: increment
    }, obj);
    obj.trigger('a b c');
    expect(obj.counter).to.equal(5);
  });

  specify('binding and triggering multiple event names with event maps', function() {
    const obj = {counter: 0};
    _.extend(obj, this.Events);

    const increment = function() {
      this.counter += 1;
    };

    obj.on({
      'a b c': increment
    });

    obj.trigger('a');
    expect(obj.counter).to.equal(1);

    obj.trigger('a b');
    expect(obj.counter).to.equal(3);

    obj.trigger('c');
    expect(obj.counter).to.equal(4);

    obj.off({
      'a c': increment
    });
    obj.trigger('a b c');
    expect(obj.counter).to.equal(5);
  });

  specify('binding and trigger with event maps context', function() {
    const obj = {counter: 0};
    const context = {};
    _.extend(obj, this.Events);

    obj.on({
      a: function() {
        expect(this).to.eql(context);
      }
    }, context).trigger('a');

    obj.off().on({
      a: function() {
        expect(this).to.eql(context);
      }
    }, this, context).trigger('a');
  });

  specify('listenTo and stopListening', function() {
    const stub = sinon.stub()
    const a = _.extend({}, this.Events);
    const b = _.extend({}, this.Events);
    a.listenTo(b, 'all', stub);
    a.stopListening();
    b.trigger('anything');
    expect(stub).to.not.have.been.called;
    expect(_.size(a._listeningTo)).to.equal(0);
  });

  specify('listenTo and stopListening with event maps', function() {
    const a = _.extend({}, this.Events);
    const b = _.extend({}, this.Events);
    const cb = sinon.stub();
    a.listenTo(b, {event: cb});
    b.trigger('event');
    a.listenTo(b, {event2: cb});
    b.on('event2', cb);
    a.stopListening(b, {event2: cb});
    b.trigger('event event2');
    a.stopListening();
    b.trigger('event event2');
    expect(cb).to.have.callCount(4);
  });

  specify('stopListening with omitted args', function() {
    const a = _.extend({}, this.Events);
    const b = _.extend({}, this.Events);
    const cb = sinon.stub();
    a.listenTo(b, 'event', cb);
    b.on('event', cb);
    a.listenTo(b, 'event2', cb);
    a.stopListening(null, {event: cb});
    b.trigger('event event2');
    b.off();
    a.listenTo(b, 'event event2', cb);
    a.stopListening(null, 'event');
    a.stopListening();
    b.trigger('event2');
    expect(cb).to.have.callCount(2);
  });

  specify('listenToOnce', function() {
    // Same as the previous test, but we use once rather than having to explicitly unbind
    const obj = {counterA: 0, counterB: 0};
    _.extend(obj, this.Events);
    const incrA = function(){ obj.counterA += 1; obj.trigger('event'); };
    const incrB = function(){ obj.counterB += 1; };
    obj.listenToOnce(obj, 'event', incrA);
    obj.listenToOnce(obj, 'event', incrB);
    obj.trigger('event');
    expect(obj.counterA).to.equal(1);
    expect(obj.counterB).to.equal(1);
  });

  specify('listenToOnce and stopListening', function() {
    const a = _.extend({}, this.Events);
    const b = _.extend({}, this.Events);
    const stub1 = sinon.stub();
    const stub2 = sinon.stub();
    a.listenToOnce(b, 'all', stub1);
    b.trigger('anything');
    b.trigger('anything');
    a.listenToOnce(b, 'all', stub2);
    a.stopListening();
    b.trigger('anything');
    expect(stub1).to.be.calledOnce;
    expect(stub2).to.not.have.been.called;
  });

  specify('listenTo, listenToOnce and stopListening', function() {
    const a = _.extend({}, this.Events);
    const b = _.extend({}, this.Events);
    const stub1 = sinon.stub();
    const stub2 = sinon.stub();
    a.listenToOnce(b, 'all', stub1);
    b.trigger('anything');
    b.trigger('anything');
    a.listenTo(b, 'all', stub2);
    a.stopListening();
    b.trigger('anything');
    expect(stub1).to.be.calledOnce;
    expect(stub2).to.not.have.been.called;
  });

  specify('listenTo and stopListening with event maps', function() {
    const a = _.extend({}, this.Events);
    const b = _.extend({}, this.Events);
    const stub1 = sinon.stub();
    const stub2 = sinon.stub();
    a.listenTo(b, {change: stub1});
    b.trigger('change');
    a.listenTo(b, {change: stub2});
    a.stopListening();
    b.trigger('change');
    expect(stub1).to.be.calledOnce;
    expect(stub2).to.not.have.been.called;
  });

  specify('listenTo yourself', function() {
    const e = _.extend({}, this.Events);
    const cb = sinon.stub();
    e.listenTo(e, 'foo', cb);
    e.trigger('foo');
    expect(cb).to.have.been.calledOnce;
  });

  specify('listenTo yourself cleans yourself up with stopListening', function() {
    const e = _.extend({}, this.Events);
    const cb = sinon.stub();
    e.listenTo(e, 'foo', cb);
    e.trigger('foo');
    e.stopListening();
    e.trigger('foo');
    expect(cb).to.have.been.calledOnce;
  });

  specify('stopListening cleans up references', function() {
    const a = _.extend({}, this.Events);
    const b = _.extend({}, this.Events);
    const fn = function() {};
    b.on('event', fn);
    a.listenTo(b, 'event', fn).stopListening();
    expect(_.size(a._listeningTo)).to.equal(0);
    expect(_.size(b._events.event)).to.equal(1);
    expect(_.size(b._listeners)).to.equal(0);
    a.listenTo(b, 'event', fn).stopListening(b);
    expect(_.size(a._listeningTo)).to.equal(0);
    expect(_.size(b._events.event)).to.equal(1);
    expect(_.size(b._listeners)).to.equal(0);
    a.listenTo(b, 'event', fn).stopListening(b, 'event');
    expect(_.size(a._listeningTo)).to.equal(0);
    expect(_.size(b._events.event)).to.equal(1);
    expect(_.size(b._listeners)).to.equal(0);
    a.listenTo(b, 'event', fn).stopListening(b, 'event', fn);
    expect(_.size(a._listeningTo)).to.equal(0);
    expect(_.size(b._events.event)).to.equal(1);
    expect(_.size(b._listeners)).to.equal(0);
  });

  specify('stopListening cleans up references from listenToOnce', function() {
    const a = _.extend({}, this.Events);
    const b = _.extend({}, this.Events);
    const fn = function() {};
    b.on('event', fn);
    a.listenToOnce(b, 'event', fn).stopListening();
    expect(_.size(a._listeningTo)).to.equal(0);
    expect(_.size(b._events.event)).to.equal(1);
    expect(_.size(b._listeners)).to.equal(0);
    a.listenToOnce(b, 'event', fn).stopListening(b);
    expect(_.size(a._listeningTo)).to.equal(0);
    expect(_.size(b._events.event)).to.equal(1);
    expect(_.size(b._listeners)).to.equal(0);
    a.listenToOnce(b, 'event', fn).stopListening(b, 'event');
    expect(_.size(a._listeningTo)).to.equal(0);
    expect(_.size(b._events.event)).to.equal(1);
    expect(_.size(b._listeners)).to.equal(0);
    a.listenToOnce(b, 'event', fn).stopListening(b, 'event', fn);
    expect(_.size(a._listeningTo)).to.equal(0);
    expect(_.size(b._events.event)).to.equal(1);
    expect(_.size(b._listeners)).to.equal(0);
  });

  specify('listenTo and off cleaning up references', function() {
    const a = _.extend({}, this.Events);
    const b = _.extend({}, this.Events);
    const fn = function() {};
    a.listenTo(b, 'event', fn);
    b.off();
    expect(_.size(a._listeningTo)).to.equal(0);
    expect(_.size(b._listeners)).to.equal(0);
    a.listenTo(b, 'event', fn);
    b.off('event');
    expect(_.size(a._listeningTo)).to.equal(0);
    expect(_.size(b._listeners)).to.equal(0);
    a.listenTo(b, 'event', fn);
    b.off(null, fn);
    expect(_.size(a._listeningTo)).to.equal(0);
    expect(_.size(b._listeners)).to.equal(0);
    a.listenTo(b, 'event', fn);
    b.off(null, null, a);
    expect(_.size(a._listeningTo)).to.equal(0);
    expect(_.size(b._listeners)).to.equal(0);
  });

  specify('listenTo and stopListening cleaning up references', function() {
    const a = _.extend({}, this.Events);
    const b = _.extend({}, this.Events);
    const cb = sinon.stub();
    a.listenTo(b, 'all', cb);
    b.trigger('anything');
    a.listenTo(b, 'other', cb);
    a.stopListening(b, 'other');
    a.stopListening(b, 'all');
    expect(_.size(a._listeningTo)).to.equal(0);
    expect(cb).to.have.been.calledOnce;
  });

  specify('listenToOnce without context cleans up references after the event has fired', function() {
    const a = _.extend({}, this.Events);
    const b = _.extend({}, this.Events);
    const cb = sinon.stub();
    a.listenToOnce(b, 'all', cb);
    b.trigger('anything');
    expect(_.size(a._listeningTo)).to.equal(0);
    expect(cb).to.have.been.calledOnce;
  });

  specify('listenToOnce with event maps cleans up references', function() {
    const a = _.extend({}, this.Events);
    const b = _.extend({}, this.Events);
    const cb = sinon.stub();
    a.listenToOnce(b, {
      one: cb,
      two: cb
    });
    b.trigger('one');
    expect(_.size(a._listeningTo)).to.equal(1);
    expect(cb).to.have.been.calledOnce;
  });

  specify('listenToOnce with event maps binds the correct `this`', function() {
    const a = _.extend({}, this.Events);
    const b = _.extend({}, this.Events);
    const stub1 = sinon.stub();
    const stub2 = sinon.stub();
    a.listenToOnce(b, {
      one: stub1,
      two: stub2
    });
    b.trigger('one');
    expect(stub1).to.be.calledOnce.and.calledOn(a);
    expect(stub2).to.not.have.been.called;
  });

  specify('listenTo with empty callback doesn\'t throw an error', function() {
    const e = _.extend({}, this.Events);
    e.listenTo(e, 'foo', null);
    expect(() => { e.trigger('foo') }).not.to.throw();
  });

  specify('trigger all for each event', function() {
    let a, b;
    const obj = {counter: 0};
    _.extend(obj, this.Events);
    obj.on('all', function(event) {
      obj.counter++;
      if (event === 'a') a = true;
      if (event === 'b') b = true;
    })
    .trigger('a b');
    expect(a).to.be.true;
    expect(b).to.be.true;
    expect(obj.counter).to.equal(2);
  });

  specify('on, then unbind all functions', function() {
    const obj = {counter: 0};
    _.extend(obj, this.Events);
    const callback = function() { obj.counter += 1; };
    obj.on('event', callback);
    obj.trigger('event');
    obj.off('event');
    obj.trigger('event');
    expect(obj.counter).to.equal(1);
  });

  specify('bind two callbacks, unbind only one', function() {
    const obj = {counterA: 0, counterB: 0};
    _.extend(obj, this.Events);
    const callback = function() { obj.counterA += 1; };
    obj.on('event', callback);
    obj.on('event', function() { obj.counterB += 1; });
    obj.trigger('event');
    obj.off('event', callback);
    obj.trigger('event');
    expect(obj.counterA).to.equal(1);
    expect(obj.counterB).to.equal(2);
  });

  specify('unbind a callback in the midst of it firing', function() {
    const obj = {counter: 0};
    _.extend(obj, this.Events);
    const callback = function() {
      obj.counter += 1;
      obj.off('event', callback);
    };
    obj.on('event', callback);
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    expect(obj.counter).to.equal(1);
  });

  specify('two binds that unbind themeselves', function() {
    const obj = {counterA: 0, counterB: 0};
    _.extend(obj, this.Events);
    const incrA = function(){ obj.counterA += 1; obj.off('event', incrA); };
    const incrB = function(){ obj.counterB += 1; obj.off('event', incrB); };
    obj.on('event', incrA);
    obj.on('event', incrB);
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    expect(obj.counterA).to.equal(1);
    expect(obj.counterB).to.equal(1);
  });

  specify('bind a callback with a default context when none supplied', function() {
    const obj = _.extend({
      assertTrue: function() {
        expect(this).to.equal(obj);
      }
    }, this.Events);

    obj.once('event', obj.assertTrue);
    obj.trigger('event');
  });

  specify('bind a callback with a supplied context', function() {
    const TestClass = function() {
      return this;
    };
    TestClass.prototype.assertTrue = sinon.stub();

    const obj = _.extend({}, this.Events);
    obj.on('event', function() { this.assertTrue(); }, new TestClass);
    obj.trigger('event');
    expect(TestClass.prototype.assertTrue).to.have.been.calledOnce;
  });

  specify('nested trigger with unbind', function() {
    const obj = {counter: 0};
    _.extend(obj, this.Events);
    const incr1 = function(){ obj.counter += 1; obj.off('event', incr1); obj.trigger('event'); };
    const incr2 = function(){ obj.counter += 1; };
    obj.on('event', incr1);
    obj.on('event', incr2);
    obj.trigger('event');
    expect(obj.counter).to.equal(3);
  });

  specify('callback list is not altered during trigger', function() {
    let counter = 0;
    const obj = _.extend({}, this.Events);
    const incr = function(){ counter++; };
    const incrOn = function(){ obj.on('event all', incr); };
    const incrOff = function(){ obj.off('event all', incr); };

    obj.on('event all', incrOn).trigger('event');
    expect(counter).to.equal(0);

    obj.off().on('event', incrOff).on('event all', incr).trigger('event');
    expect(counter).to.equal(2);
  });

  specify('#1282 - "all" callback list is retrieved after each event.', function() {
    let counter = 0;
    const obj = _.extend({}, this.Events);
    const incr = function(){ counter++; };
    obj.on('x', function() {
      obj.on('y', incr).on('all', incr);
    })
    .trigger('x y');
    expect(counter).to.equal(2);
  });

  specify('if no callback is provided, `on` is a noop', function() {
    expect(() => { _.extend({}, this.Events).on('test').trigger('test') }).not.to.throw();
  });

  specify('if callback is truthy but not a function, `on` should throw an error just like jQuery', function() {
    const view = _.extend({}, this.Events).on('test', 'noop');
    expect(() => { view.trigger('test') }).to.throw();
  });

  specify('remove all events for a specific context', function() {
    const obj = _.extend({}, this.Events);
    const stub1 = sinon.stub();
    const stub2 = sinon.stub();
    obj.on('x y all', stub1);
    obj.on('x y all', stub2, obj);
    obj.off(null, null, obj);
    obj.trigger('x y');
    expect(stub1).to.have.callCount(4);
    expect(stub2).to.not.have.been.called;
  });

  specify('remove all events for a specific callback', function() {
    const obj = _.extend({}, this.Events);
    const success = sinon.stub();
    const fail = sinon.stub();
    obj.on('x y all', success);
    obj.on('x y all', fail);
    obj.off(null, fail);
    obj.trigger('x y');
    expect(success).to.have.callCount(4);
    expect(fail).to.not.have.been.called;
  });

  specify('#1310 - off does not skip consecutive events', function() {
    const obj = _.extend({}, this.Events);
    const cb = sinon.stub();
    obj.on('event', cb, obj);
    obj.on('event', cb, obj);
    obj.off(null, null, obj);
    obj.trigger('event');
    expect(cb).to.not.have.been.called;
  });

  specify('once', function() {
    // Same as the previous test, but we use once rather than having to explicitly unbind
    const obj = {counterA: 0, counterB: 0};
    _.extend(obj, this.Events);
    const incrA = function(){ obj.counterA += 1; obj.trigger('event'); };
    const incrB = function(){ obj.counterB += 1; };
    obj.once('event', incrA);
    obj.once('event', incrB);
    obj.trigger('event');
    expect(obj.counterA).to.equal(1);
    expect(obj.counterB).to.equal(1);
  });

  specify('once constant one', function() {
    const f = sinon.stub();

    const a = _.extend({}, this.Events).once('event', f);
    const b = _.extend({}, this.Events).on('event', f);

    a.trigger('event');
    a.trigger('event');

    b.trigger('event');
    b.trigger('event');
    expect(f).to.have.callCount(3);
  });

  specify('once constant two', function() {
    const f = sinon.stub();
    const obj = _.extend({}, this.Events);

    obj
      .once('event', f)
      .on('event', f)
      .trigger('event')
      .trigger('event');

    expect(f).to.have.callCount(3);
  });

  specify('once with off', function() {
    const f = sinon.stub();
    const obj = _.extend({}, this.Events);

    obj.once('event', f);
    obj.off('event', f);
    obj.trigger('event');
    expect(f).to.not.have.been.called;
  });

  specify('once with event maps', function() {
    const obj = {counter: 0};
    _.extend(obj, this.Events);

    const increment = function() {
      this.counter += 1;
    };

    obj.once({
      a: increment,
      b: increment,
      c: increment
    }, obj);

    obj.trigger('a');
    expect(obj.counter).to.equal(1);

    obj.trigger('a b');
    expect(obj.counter).to.equal(2);

    obj.trigger('c');
    expect(obj.counter).to.equal(3);

    obj.trigger('a b c');
    expect(obj.counter).to.equal(3);
  });

  specify('bind a callback with a supplied context using once with object notation', function() {
    const obj = {counter: 0};
    const context = {};
    _.extend(obj, this.Events);

    obj.once({
      a: function() {
        expect(this).to.eql(context);
      }
    }, context).trigger('a');
  });

  specify('once with off only by context', function() {
    const context = {};
    const obj = _.extend({}, this.Events);
    const cb = sinon.stub();
    obj.once('event', cb, context);
    obj.off(null, null, context);
    obj.trigger('event');
    expect(cb).to.not.have.been.called;
  });

  specify('once with multiple events.', function() {
    const obj = _.extend({}, this.Events);
    const cb = sinon.stub();
    obj.once('x y', cb);
    obj.trigger('x y');
    expect(cb).to.have.been.calledTwice;
  });

  specify('Off during iteration with once.', function() {
    const obj = _.extend({}, this.Events);
    const cb = sinon.stub();
    const f = function(){ this.off('event', f); };
    obj.on('event', f);
    obj.once('event', function(){});
    obj.on('event',cb);

    obj.trigger('event');
    obj.trigger('event');
    expect(cb).to.have.been.calledTwice;
  });

  specify('once without a callback is a noop', function() {
    expect(() => { _.extend({}, this.Events).once('event').trigger('event') }).to.not.throw();
  });

  specify('listenToOnce without a callback is a noop', function() {
    const obj = _.extend({}, this.Events);
    expect(() => { obj.listenToOnce(obj, 'event').trigger('event') }).to.not.throw();
  });

  specify('event functions are chainable', function() {
    const obj = _.extend({}, this.Events);
    const obj2 = _.extend({}, this.Events);
    const fn = function() {};
    expect(obj).to.equal(obj.trigger('noeventssetyet'));
    expect(obj).to.equal(obj.off('noeventssetyet'));
    expect(obj).to.equal(obj.stopListening('noeventssetyet'));
    expect(obj).to.equal(obj.on('a', fn));
    expect(obj).to.equal(obj.once('c', fn));
    expect(obj).to.equal(obj.trigger('a'));
    expect(obj).to.equal(obj.listenTo(obj2, 'a', fn));
    expect(obj).to.equal(obj.listenToOnce(obj2, 'b', fn));
    expect(obj).to.equal(obj.off('a c'));
    expect(obj).to.equal(obj.stopListening(obj2, 'a'));
    expect(obj).to.equal(obj.stopListening());
  });

  specify('#3448 - listenToOnce with space-separated events', function() {
    const one = _.extend({}, this.Events);
    const two = _.extend({}, this.Events);
    let count = 1;
    one.listenToOnce(two, 'x y', function(n) { expect(n).to.equal(count++); });
    two.trigger('x', 1);
    two.trigger('x', 1);
    two.trigger('y', 2);
    two.trigger('y', 2);
  });

  specify('#3611 - listenTo is compatible with non-Backbone event libraries', function() {
    const obj = _.extend({}, this.Events);
    const cb = sinon.stub();
    const other = {
      events: {},
      on: function(name, callback) {
        this.events[name] = callback;
      },
      trigger: function(name) {
        this.events[name]();
      }
    };

    obj.listenTo(other, 'test', cb);
    other.trigger('test');
    expect(cb).to.have.been.calledOnce;
  });

  specify('#3611 - stopListening is compatible with non-Backbone event libraries', function() {
    const obj = _.extend({}, this.Events);
    const cb = sinon.stub();
    const other = {
      events: {},
      on: function(name, callback) {
        this.events[name] = callback;
      },
      off: function() {
        this.events = {};
      },
      trigger: function(name) {
        const fn = this.events[name];
        if (fn) fn();
      }
    };

    obj.listenTo(other, 'test', cb);
    obj.stopListening(other);
    other.trigger('test');
    expect(cb).to.not.have.been.called;
    expect(_.size(obj._listeningTo)).to.equal(0);
  });
});
