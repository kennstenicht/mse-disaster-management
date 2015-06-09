import Ember from 'ember';
import Tuio from 'mse-disaster-management/mixins/tuio';
import Functions from 'mse-disaster-management/mixins/functions';

const {
  Component,
  computed,
  inject,
  $,
  on,
  run: {
    bind
  }
} = Ember;

export default Component.extend(Tuio, Functions, {
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
    latLngPoints: [],
    anchor: null,
  },

  map: computed(function() {
    return this.get('mapboxGl').maps[
      this.get('mapId')
    ];
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

  isPolygon: function() {
    var first = this.get('shape.points').get('firstObject'),
        last = this.get('shape.points').get('lastObject'),

        // Calc the distance betwean first and last point
        dist = Math.sqrt( Math.pow((first.x-last.x), 2) + Math.pow((first.y-last.y), 2) );

    if (dist < 20) {
      // Push the first point at the end to create a Polygon, if distance is smaller than 20
      this.get('shape.points').push( this.get('shape.points').get('firstObject') );
      return true;
    }
  },

  pxToLatLng: function() {
    this.get('shape.points').forEach(bind(this, function(point) {
      // Translate to geojson and push into an array of geo coordinates
      this.get('shape.latLngPoints').push(
        this.get('map').unproject([
          point.x,
          point.y
        ])
      );
      this.get('shape.geoPoints').push([
        this.get('shape.latLngPoints').lng,
        this.get('shape.latLngPoints').lat
      ]);
    }));
  },

  onAddTuioCursor: on('addTuioCursor', function(cursor) {
    // Start drawing mode
    this.set('isDrawing', true);
    this.get('shape.points').push({'x': this.getX(cursor.xPos), 'y': this.getY(cursor.yPos)});

    // Move to start point
    this.get('drawingArea').beginPath();
    this.get('drawingArea').moveTo(
      this.get('shape.points').get('firstObject').x,
      this.get('shape.points').get('firstObject').y
    );
  }),

  onUpdateTuioCursor: on('updateTuioCursor', function(cursor) {
    if(this.get('isDrawing')) {
      // Push all points into an array of coordinates
      this.get('shape.points').push({
        'x': this.getX(cursor.xPos),
        'y': this.getY(cursor.yPos)
      });

      // Draw the current path
      this.get('drawingArea').lineTo(
        this.getX(cursor.xPos),
        this.getY(cursor.yPos)
      );
      this.get('drawingArea').stroke();
    }
  }),

  onRemoveTuioCursor: on('removeTuioCursor', function() {
    //Close canvas path
    this.get('drawingArea').closePath();

    //Stop drawing mode
    this.set('isDrawing', false);

    if(!this.get('newTaskShape')) {
      if(this.isPolygon()) {
        // Change shape settings to Polygon
        this.set('shape.sourceType', 'Polygon');
        this.set('shape.layerType', 'fill');
      } else {
        // Change shape settings to Line
        this.set('shape.sourceType', 'LineString');
        this.set('shape.layerType', 'line');
      }
      this.set('shape.anchor', this.get('shape.points').get('lastObject'));
      this.set('newTaskShape', true);
    }
  }),

  actions: {
    addTaskLayer: function() {
      this.pxToLatLng();
      this.set('shape.layerId', this.get('elementId')+"_"+this.get('layerId'));
      this.set('layerId', this.get('layerId')+1);
      this.get('mapboxGl').setMarker(this.get('shape'));
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