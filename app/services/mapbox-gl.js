import Ember from 'ember';

const {
  Service,
  run: {
    bind
  }
} = Ember;

export default Service.extend({
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
      interactive: interactive
    });
    this.set('maps', maps);

    // TODO: uncomment on final system
    // this.addLayers(maps[elementId], 'walls');
    // this.addLayers(maps[elementId], 'rooms');
    // this.addLayers(maps[elementId], 'hubs');
  },

  setMarker: function(shape) {
    // A Polygon neads to be inside of an extra array
    if(shape.sourceType === 'Polygon') {
      shape.geoPoints = [shape.geoPoints];
    }

    // Add source to all maps
    for(var map in this.get('maps')) {
      map = this.get('maps.'+map);
      map.addSource(shape.layerId, {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": shape.sourceType,
            "coordinates": shape.geoPoints
          }
        }
      });

      // Add layer to map and link source to this layer + styling of the layer
      map.addLayer({
        "id": shape.layerId,
        "type": shape.layerType,
        "source": shape.layerId,
        "interactive": true,
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "fill-color": "#cc0e0e",
          "fill-opacity": "0.2",
          "fill-outline-color": "#cc0e0e",
          "outline-size": 8,
          "line-color": "#cc0e0e",
          "line-width": 8
        }
      });
    }
  },

  addLayers: function(map, source) {
    map.on('style.load', function() {
      $.getJSON( "geojson/"+source+".geojson", function(data) {
        map.addSource(source, {
          "type": "geojson",
          "data": data
        });
      });

      $.getJSON( "geojson/"+source+"-style.json", function(data) {
        map.addLayer(data);
      });
    });
  },

  removeMarker: function(id) {
    // Remove source from all maps
    for(var map in this.get('maps')) {
      map = this.get('maps.'+map);

      map.removeSource(id);
      map.update();
    }
  },

  getMarker: function(map, e) {

  }
});
