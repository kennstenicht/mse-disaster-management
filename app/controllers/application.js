import Ember from 'ember';

const {
  Controller
} = Ember;

export default Controller.extend({
  baseMap: '',

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
    'zoom': 13,
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
    'zoom': 13,
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
    'zoom': 13,
    'baseMap': false
  }
});
