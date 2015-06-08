import Ember from 'ember';

const {
  Controller,
  inject,
  computed
} = Ember;

export default Controller.extend({
  mapboxGl: inject.service('mapboxGl'),
  tuio: inject.service('tuio'),
  baseMap: '',

  activeLences: [],
  baseMapSettings: {
    'geoPoint': {
      'lat': 51.282785,
      'lng': 6.762270
    },
    'zoom': 16,
    'baseMap': true,
  },

  lence0: {
    'active': false,
    'title': "Lence zero",
    'geoPoint': {
      'lat': 51.282785,
      'lng': 6.762270
    },
    'point': {
      'x': 120,
      'y':150
    },
    'zoom': 16,
    'baseMap': false
  },

  lence1: {
    'active': false,
    'title': "Lence one",
    'geoPoint': {
      'lat': 51.282785,
      'lng': 6.762270
    },
    'point': {
      'x': 120,
      'y':150
    },
    'zoom': 16,
    'baseMap': false
  },

  lence2: {
    'active': false,
    'title': "Lence two",
    'geoPoint': {
      'lat': 51.282785,
      'lng': 6.762270
    },
    'point': {
      'x': 600,
      'y':200
    },
    'zoom': 12,
    'baseMap': false
  },


  init: function() {
    // Setup Tuio Client
    this.get('tuio').setupClient();
  },

  actions: {
    setBaseMap: function(elementId) {
      this.set('baseMap', elementId);
    }
  }
});
