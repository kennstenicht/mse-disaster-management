import Ember from 'ember';

const {
  Service,
  $,
  run: {
    bind
  }
} = Ember;

export default Service.extend({
  markers: {},
  maps: {},

  setupMap: function(elementId, settings, tasks) {
    var maps = this.get('maps'),
        interactive = settings.get('baseMap') ? false : true;

    maps[elementId] = new mapboxgl.Map({
      container: elementId,
      style: 'https://www.mapbox.com/mapbox-gl-styles/styles/light-v7.json',
      center: {'lat': settings.get('lat'), 'lng': settings.get('lng')},
      zoom: settings.get('zoom'),
      interactive: interactive
    });
    this.set('maps', maps);

    // TODO: uncomment on final system
    // this.addLayers(maps[elementId], 'walls');
    // this.addLayers(maps[elementId], 'rooms');
    // this.addLayers(maps[elementId], 'hubs');
    maps[elementId].on('style.load', bind(this, function() {
      tasks.forEach(bind(this, function(task) {
        this.setMarker(maps[elementId], task);
      }));
    }));
  },

  setMarkerToAllMaps: function(task) {
    for(var map in this.get('maps')) {
      this.setMarker(this.get('maps.'+map), task);
    };
  },

  setMarker: function(map, task) {
    // A Polygon neads to be inside of an extra array
    if(task.get('sourceType') === 'Polygon') {
      task.set('geoPoints', [task.get('geoPoints')]);
    }

    map.addSource(task.get('id'), {
      "type": "geojson",
      "data": {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": task.get('sourceType'),
          "coordinates": task.get('geoPoints')
        }
      }
    });

    // Add layer to map and link source to this layer + styling of the layer
    map.addLayer({
      "id": task.get('id'),
      "type": task.get('layerType'),
      "source": task.get('id'),
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
    map.update();
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
