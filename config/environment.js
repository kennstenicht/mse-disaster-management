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

  ENV.mobileTouch = {

      //which gesture families to allow, will create a recognizer for each
      //a minimum of tap must be present, turning off unused gestures can help performance
      use : ['tap', 'press', 'pan', 'swipe'],

      //whether to alias "press" to tap within Ember's eventing
      // very useful if you don't need to distinguish and don't want to lose
      // taps from people who tap longer
      alwaysTapOnPress : false,

      //whether links and actions should trigger tap behavior on press as well
      // if eventName or "on" has not been explicitly defined
      // currently does not work with actions
      defaultTapOnPress : true,

      //passed to new Hammer.Manager(element, options)
      options : {
         domEvents : true
      },

      //passed to the respective recognizer
      tune : {
        tap : { time : 250, threshold : 9 }, //Hammer default is 250 / 2
        press : { time : 500, threshold : 9 }, //Hammer default is 500 / 5
        swipe : { direction : 6, velocity : 0.3, threshold : 25 },
        pan : { direction : 6 },
        pinch : {},
        rotate : {}
      },

      //what default Ember events should be disabled
      events : [
        'touchstart',
        'touchmove',
        'touchend',
        'touchcancel',
        'click', //not removed, re-aliased to internalClick.  Use cautiously.
        'dblclick',
        'mouseenter',
        'mouseleave'
      ]

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
