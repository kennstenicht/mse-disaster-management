/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'mse-disaster-management',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    contentSecurityPolicy: {
      'font-src': "'self' data:",
      'script-src': "'self' 'unsafe-eval' 'unsafe-inline' api.tiles.mapbox.com",
      'child-src': "'self' 'blob'",
      'connect-src': "'self' *.mapbox.com ws://localhost:5000 http://localhost:5000",
      'img-src': "'self' data: *.mapbox.com",
      'style-src': "'self' 'unsafe-eval' 'unsafe-inline' fonts.googleapis.com api.tiles.mapbox.com",
      'object-src': "'self'"
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
