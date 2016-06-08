var jsdom  = require('jsdom'),
    assert = require('assert');

var client;

before(function(done) {
  jsdom.env({
    'html': '<html><body></body></html>',
    'scripts': [
      __dirname + '/../bower_components/bluebird/js/browser/bluebird.core.js',
      __dirname + '/../dist/recreio.js'
    ],
    'done': function(errors, window) {
      // todo: move API key to an env var
      client = new RecreIO.Client('k5DhHdZF7ZGdV3ndSS2VqLTwHCvJNg8m');
      done(errors);
    }
  });
});

// helper to invoke failure from JSON error responses
function errorAssert(done) {
  return function(status, response) {
    done(status);
    console.log("Error response: " + status + " " + response.message);
  };
};

describe('Authentication', function() {

  it('Sign in with username', function(done) {
    client.signInWithUsername('demo', 'demo').then(function(data) {
        assert.strictEqual(data.username, 'demo');
        done();
    }).catch(function(exception) {
        assert(false, exception);
        done();
    });
  });

  // it('Sign in with username', function(done) {
  //   client.signInWithUsername('demo', 'demo').then(function(data) {
  //       assert.strictEqual(status, 200);
  //       done();
  //   }).catch(function(exception) {
  //       done();
  //   });
  // });

});
