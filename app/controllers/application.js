import Ember from 'ember';
import Lences from 'mse-disaster-management/models/lences';

export default Ember.Controller.extend({
  mapboxGl: Ember.inject.service('mapboxGl'),
  lences: Lences.create(),
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
    createLence: function(geoPoint, point, zoom) {
      var data = {
        'geoPoint': geoPoint,
        'point': point,
        'zoom': zoom+1
      };
      console.log(data);
      this.get('lences').addObject(data);
    },
    
    setBaseMap: function(elementId) {
      this.set('baseMap', elementId);
    }
  }
});
