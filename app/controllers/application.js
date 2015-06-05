import Ember from 'ember';

const {
  Controller,
  inject,
  computed
} = Ember;

export default Controller.extend({
  mapboxGl: inject.service('mapboxGl'),
  baseMap: '',

  baseMapSettings: {
    'geoPoint': {
      'lat': 51.282785,
      'lng': 6.762270
    },
    'zoom': 16,
    'baseMap': true,
  },

  actions: {
    // createLence: function(geoPoint, point, zoom) {
    //   var geoPoint = {
    //     'lat': 51.282785,
    //     'lng': 6.762270
    //   }
    //
    //   var point = {
    //     'x': 200,
    //     'y': 200
    //   }
    //
    //   var zoom = 16;
    //
    //   this.set('lences.lences', []);
    //   console.log(this.get('lences.lences'));
    //   this.get('lences.lences').push([{
    //     'id': this.get('lenceId'),
    //     'geoPoint': geoPoint,
    //     'point': point,
    //     'zoom': zoom+1
    //   }]);
    //
    //   this.set('lenceId', this.get('lenceId')+1);
    // },
    //
    // moveLence: function() {
    //   var geoPoint = {
    //     'lat': 51.282785,
    //     'lng': 6.762270
    //   }
    //
    //   var point = {
    //     'x': 100,
    //     'y': 100
    //   }
    //
    //   var zoom = 16;
    //
    //   this.set('lences.lence1', {
    //     'id': 1,
    //     'geoPoint': geoPoint,
    //     'point': point,
    //     'zoom': zoom+1
    //   });
    // },

    setBaseMap: function(elementId) {
      this.set('baseMap', elementId);
    }
  }
});
