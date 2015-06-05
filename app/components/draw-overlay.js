import Ember from 'ember';

const {
  Component,
  computed,
  $,
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
  drawingArea: null,
  
  layer: computed('layerId', function() {
    return this.get('elementId') + "_" + this.get('layerId');
  }),
  
  map: computed(function() {
    var id = this.get('mapId');
    return this.get('mapboxGl').maps[id];
  }),
  
  didInsertElement: function() {
    // Set canvas to element size
    var drawingArea = this.$('.draw-overlay__drawing-area').get(0);
    drawingArea.width = this.$().innerWidth();
    drawingArea.height = this.$().innerHeight();
    
    // Beginn path, ready to draw!
    this.set('drawingArea', drawingArea.getContext('2d') );
    this.get('drawingArea').strokeStyle = '#c28989';
    this.get('drawingArea').lineWidth = '8';
    this.get('drawingArea').beginPath();
  },
  
  mouseDown: function(e) {
    // Start drawing mode 
    this.set('isDrawing', true);
    this.set('firstPoint', {'x': e.pageX, 'y': e.pageY});
    // Move to start point
    this.get('drawingArea').moveTo(this.get('firstPoint').x, this.get('firstPoint').y);
  },
  
  mouseMove: function(e) {
    if(this.get('isDrawing')) {
      // Push all points into an array od coordinates
      this.get('points').push({'x': e.pageX, 'y': e.pageY});
      
      // Draw the current path
      this.get('drawingArea').lineTo( e.pageX , e.pageY );
      this.get('drawingArea').stroke();
    }
  },
  
  mouseUp: function(e) {
    //Close canvas path
    this.get('drawingArea').closePath();
    
    //Stop drawing mode
    this.set('isDrawing', false);
    
    if(!this.get('createTask')) {
      this.set('lastPoint', {'x': e.pageX, 'y': e.pageY});
    
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
      // remove everything from the canvas
      this.get('drawingArea').clearRect(0, 0, this.$().innerWidth(), this.$().innerHeight())
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
          "fill-color": "#cc0e0e",
          "fill-opacity": "0.2",
          "fill-outline-color": "#cc0e0e",
          "outline-size": 8,
          "line-color": "#cc0e0e",
          "line-width": 8
        }
      });
      
      // Reset Points
      this.send('resetPoints');
      
      // Increase LayerId by one
      this.set('layerId', this.get('layerId')+1);
    }
  }
});
