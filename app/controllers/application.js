import Ember from 'ember';

const {
  Controller,
  inject,
  computed
} = Ember;

export default Controller.extend({
  mapboxGl: inject.service('mapboxGl'),
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

  lence1: {
    'active': true,
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

  actions: {
    setBaseMap: function(elementId) {
      this.set('baseMap', elementId);
    }
  }
});
