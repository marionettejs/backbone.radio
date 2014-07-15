### [0.5.2](https://github.com/jmeas/backbone.radio/releases/tag/v0.5.2)

- Fixes a bug where the top-level API would not pass the correct arguments to the underlying methods.

### [0.5.1](https://github.com/jmeas/backbone.radio/releases/tag/v0.5.1)

- Fixes Radio.VERSION in the built library

### [0.5.0](https://github.com/jmeas/backbone.radio/releases/tag/v0.5.0)

- Commands.react has been renamed to Commands.comply

### [0.4.1](https://github.com/jmeas/backbone.radio/releases/tag/v0.4.1)

- The Channel convenience methods no longer bind the context, instead deferring that
responsibility to the wrapped methods themselves. This aids in stack traces and gives you
the ability to unregister the methods individually.

### [0.4.0](https://github.com/jmeas/backbone.radio/releases/tag/v0.4.0)

- Debug mode now informs you when you attempt to unregister an event that was never registered. This is to help prevent memory leaks.
- `respond` has been renamed to `reply`
- More methods now return `this`, making the API more consistent internally, and with Backbone.Events

### [0.3.0](https://github.com/jmeas/backbone.radio/releases/tag/v0.3.0)

- More test coverage
- Tests completely rewritten
- Numerous bug fixes; more work on the library
