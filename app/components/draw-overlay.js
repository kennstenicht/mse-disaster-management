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

  isDrawing: false,
  newTaskShape: false,
  layerId: 0,
  drawingArea: null,

  shape: {
    layerId: '',
    sourceType: 'LineString',
    layerType: 'line',
    points: [],
    geoPoints: [],
    geoPoints2: [],
    anchor: null,
  },

  map: computed(function() {
    var id = this.get('mapId');
    return this.get('mapboxGl').maps[id];
  }),

  didInsertElement: function() {
    // Set canvas to element size
    var drawingArea = this.$('.draw-overlay__drawing-area').get(0);
    drawingArea.width = this.$().innerWidth();
    drawingArea.height = this.$().innerHeight();

    // set drawingArea propertys!
    this.set('drawingArea', drawingArea.getContext('2d') );
    this.get('drawingArea').strokeStyle = '#c28989';
    this.get('drawingArea').lineWidth = '8';

  },

  touchstart: function() {
    console.log('touch');
  },

  mouseDown: function(e) {
    // Start drawing mode
    this.set('isDrawing', true);
    this.get('shape.points').push({'x': e.offsetX, 'y': e.offsetY});

    // Move to start point
    this.get('drawingArea').beginPath();
    this.get('drawingArea').moveTo(
      this.get('shape.points').get('firstObject').x,
      this.get('shape.points').get('firstObject').y
    );
  },

  mouseMove: function(e) {
    if(this.get('isDrawing')) {
      // Push all points into an array of coordinates
      this.get('shape.points').push({'x': e.offsetX, 'y': e.offsetY});

      // Translate to geojson and push into an array if geo coordinates
      var geoPoint = this.get('map').unproject([e.offsetX, e.offsetY]);
      this.get('shape.geoPoints').push([geoPoint.lng, geoPoint.lat]);
      this.get('shape.geoPoints2').push({"lat": geoPoint.lat, "lng": geoPoint.lng});

      // Draw the current path
      this.get('drawingArea').lineTo( e.offsetX , e.offsetY )
      this.get('drawingArea').stroke();
    }
  },

  mouseUp: function(e) {
    //Close canvas path
    this.get('drawingArea').closePath();

    //Stop drawing mode
    this.set('isDrawing', false);
    if(!this.get('newTaskShape')) {
      var first = this.get('shape.points').get('firstObject');
      var last = this.get('shape.points').get('lastObject');

      // Calc the distance betwean first and last point
      var dist = Math.sqrt( Math.pow((first.x-last.x), 2) + Math.pow((first.y-last.y), 2) );

      if(dist <= 20) {
        // Push the first point at the end to create a Polygon, if distance is smaller than 20
        this.get('shape.points').push( this.get('shape.points').get('firstObject') );

        // Change shape settings to Polygon
        this.set('shape.sourceType', 'Polygon');
        this.set('shape.layerType', 'fill');
      } else {
        // Change shape settings to Line
        this.set('shape.sourceType', 'LineString');
        this.set('shape.layerType', 'line');
      }
      this.set('shape.anchor', last)
      this.set('newTaskShape', true);
    }
  },

  actions: {
    addTaskShape: function() {
      this.set('shape.layerId', this.get('elementId')+"_"+this.get('layerId'));
      this.set('layerId', this.get('layerId')+1);
      console.log(this.get('shape.layerId'));
      this.get('mapboxGl').setMarker(this.get('map'), this.get('shape'));
      this.send('removeTaskShape');
    },

    removeTaskShape: function() {
      // reset all points and geoPoints
      this.set('shape.points', []);
      this.set('shape.geoPoints', []);

      // remove everything from the canvas
      this.get('drawingArea').clearRect(0, 0, this.$().innerWidth(), this.$().innerHeight());
      this.set('newTaskShape', false);
    }
  }
});
