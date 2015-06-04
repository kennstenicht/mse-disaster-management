import Ember from 'ember';

const {
  Component,
  computed,
  inject
} = Ember;

export default Component.extend({
  classNames: ['draw-overlay'],
  
  mapboxGl: inject.service('mapboxGl'),
  firstPoint: {},
  points: [],
  lastPoint: {},
  sourceType: 'LineString',
  layerType: 'line',
  isDrawing: false,
  layerId: 0,
  createTask: false,
  
  layer: computed('layerId', function() {
    return this.get('elementId') + "_" + this.get('layerId');
  }),
  
  map: computed(function() {
    var id = this.get('mapId');
    return this.get('mapboxGl').maps[id];
  }),
  
  drawing: computed('points', function() {
    console.log('drawing');
    var canvas = this.$('.drawing-area').getContext('2d');
    canvas.fillStyle = '#f00';

    canvas.beginPath();
    canvas.moveTo(this.get('points').get('firstObject').x, this.get('points').get('firstObject').y);
    
    this.get('points').forEach( function(point) {
      canvas.lineTo( point.x , point.y );
    });

    canvas.closePath();
    canvas.fill();
  }),
  
  didInsertElement: function() {

  },
  
  mouseDown: function(e) {
    this.set('isDrawing', true);
    this.set('firstPoint', {'x': e.offsetX, 'y': e.offsetY});
  },
  
  mouseMove: function(e) {
    if(this.get('isDrawing')) {
      // Push all Points into an array od coordinates
      this.get('points').push({'x': e.offsetX, 'y': e.offsetY});
    }
  },
  
  mouseUp: function(e) {
    this.set('isDrawing', false);
    if(!this.get('createTask')) {
      this.set('lastPoint', {'x': e.offsetX, 'y': e.offsetY});
    
      var first = this.get('firstPoint');
      var last = this.get('lastPoint');
    
      // Calc the distance betwean first and last point
      var dist = Math.sqrt( Math.pow((first.x-last.x), 2) + Math.pow((first.y-last.y), 2) );
    
    
      if(dist <= 20) {
        // Push the first point at the end to create a Polygon, if distance is small
        this.get('points').push( this.get('points').get('firstObject') );

        this.set('sourceType', 'Polygon');
        this.set('layerType', 'fill');
      } else {
        this.set('sourceType', 'LineString');
        this.set('layerType', 'line');
      }
      this.set('createTask', true);
    }
  },
  
  actions: {
    createTask: function() {
      this.send('translatePoints');
      this.send('addSourceToMap');
      this.set('createTask', false);
    },
    
    deleteTask: function() {
      this.send('resetPoints');
      this.set('createTask', false);
    },
    
    resetPoints: function() {
      this.set('points', []);
    },
    
    translatePoints: function() {
      // translate x/y to lat/lng
      var dumpPoints = [];
      var self = this;
      this.get('points').forEach(function(point) {
        point = self.get('map').unproject([point.x, point.y]);
        dumpPoints.push([point.lng, point.lat]);
      });
      this.set('points', dumpPoints);
    },
    
    addSourceToMap: function() {
      // A Polygon neads to be inside of an extra array
      if(this.get('sourceType') == 'Polygon') {
        this.set('points', [this.get('points')]);
      }
      
      // Add source to map
      this.get('map').addSource(this.get('layer'), {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": this.get('sourceType'),
            "coordinates": this.get('points')
          }
        }
      });
      
      // Add layer to map and link source to this layer + styling of the layer
      this.get('map').addLayer({
        "id": this.get('layer'),
        "type": this.get('layerType'),
        "source": this.get('layer'),
        "interactive": true,
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "fill-outline-color": "#ff0000",
          "fill-color": "#00ff00",
          "line-width": 8,
          "line-color": "#333"
        }
      });
      
      // Reset Points
      this.set('points', []);
      
      // Increase LayerId by one
      this.set('layerId', this.get('layerId')+1);
    }
  }
});
