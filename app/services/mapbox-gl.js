import Ember from 'ember';

export default Ember.Service.extend({
  markers: {},
  maps: {},
  
  setupMap: function(elementId, settings) {
    var maps = this.get('maps'),
        interactive = settings.baseMap === true ? false : true;
    
    maps[elementId] = new mapboxgl.Map({
      container: elementId,
      style: 'https://www.mapbox.com/mapbox-gl-styles/styles/light-v7.json',
      center: settings.geoPoint,
      zoom: settings.zoom,
      hash: true
    });
    this.set('maps', maps);   
  },

  setMarker: function(id, lat, lng, title) {
    //TODO: add marker on selected map
  },
  
  getMarker: function(id) {
    //TODO: get marker from selected map
  }

});
