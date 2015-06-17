import Ember from 'ember';
import PaperJs from 'mse-disaster-management/mixins/paperjs';
import Map from 'mse-disaster-management/mixins/map';

const {
  Component,
  observer,
  String: {
    fmt
  },
  run: {
    bind
  }
} = Ember;

export default Component.extend(PaperJs, Map, {
  classNames: ['draw-overlay'],

  papers: [],
  paperMode: 'none',
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

  didInsertElement: function() {
    // Get a reference to the canvas object
    var drawingArea = this.$().find('.draw-overlay__drawing-area').get(0);
    drawingArea.width = this.$().innerWidth();
    drawingArea.height = this.$().innerHeight();

    this.get('papers')[this.get('elementId')] = new paper.PaperScope();
    paper = this.get('papers')[this.get('elementId')];

    // Create an paperjs project
    paper.setup(drawingArea);
    paper.settings.handleSize = 10;

    // Setup Tool for paperjs
    this.set('tool', new paper.Tool() );

    // Trigger Paperjs Events
    this.get('tool').onMouseDown = bind(this, this.onMouseDown);
    this.get('tool').onMouseDrag = bind(this, this.onMouseDrag);
    this.get('tool').onMouseUp = bind(this, this.onMouseUp);
  },

  onMouseDown: function(e) {
    let fn = fmt(this.get('paperMode')+"%@", 'Down');
    this.trigger(fn, e);
  },

  onMouseUp: function(e) {
    let fn = fmt(this.get('paperMode')+"%@", 'Up');
    this.trigger(fn, e);
  },

  onMouseDrag: function(e) {
    let fn = fmt(this.get('paperMode')+"%@", 'Drag');
    this.trigger(fn, e);
  },

  noneDown: function(e) {
    this.set('paperMode', 'drawing');
    this.set('activeCursorId', e.event.detail);
    this.set('path', new paper.Path({
      strokeColor: 'rgba(204,14,14,1)',
      strokeWeight: 8,
      selectedColor: 'rgba(204,14,14,1)',
      fillColor: 'rgba(204,14,14,0.2)'
    }));
  },

  drawingDrag: function(e) {
    // TODO uncomment on final system
    // if(this.get('activeCursorId') === e.event.detail) {
      this.get('path').add(e.point);
    // }
  },

  drawingUp: function() {
    this.isPolygon();
    this.get('path').fullySelected = true;
    this.get('path').flatten(100);
    this.set('paperMode', 'editing');
    this.set('shape.anchor', this.get('path').firstSegment.point);
    this.set('newTaskShape', true);
  },

  editingDown: function(e) {
    var hitResult = this.get('path').hitTest(e.point, {
      segments: true,
      stroke: true,
      tolerance: 40
    });
    if (!hitResult) {
      return;
    }

    switch(hitResult.type) {
      case 'segment' :
        this.set('segment', hitResult.segment);
        break;
      case 'stroke' :
        this.set('segment', this.get('path').insert(hitResult.location.index + 1, e.point) );
        break;
    }
  },

  editingDrag: function(e) {
    if ( this.get('segment') ) {
      this.get('segment').point = e.point;
    }
  },

  loadShape: observer('selectedFeature', function() {
    this.set('path', new paper.Path({
      strokeColor: 'rgba(204,14,14,1)',
      strokeWeight: 8,
      selectedColor: 'rgba(204,14,14,1)',
      fillColor: 'rgba(204,14,14,0.2)'
    }));

    this.get('selectedFeature').geometry.coordinates[0].forEach(bind(this, function(latLng) {
      var point = this.get('map').project({'lng': latLng.get('firstObject'), 'lat': latLng.get('lastObject')});
      this.get('path').add([point.x, point.y]);
    }));

    this.isPolygon();
    this.get('path').fullySelected = true;
    this.set('paperMode', 'editing');
    this.set('shape.anchor', this.get('path').firstSegment.point);
    this.set('newTaskShape', true);
  }),

  isPolygon: function() {
    var first = this.get('path').firstSegment.point,
        last = this.get('path').lastSegment.point,
        dist = first.getDistance(last);

    if (dist < 100) {
      this.get('path').add(first);
      this.get('path').closed = true;

      this.set('shape.sourceType', 'Polygon');
      this.set('shape.layerType', 'fill');
      return true;
    } else {
      this.set('shape.sourceType', 'LineString');
      this.set('shape.layerType', 'line');
    }
  },

  pxToLatLng: function() {
    var segments = this.get('path').segments;
    segments.forEach(bind(this, function(segment) {
      // Translate to geojson and push into an array of geo coordinates
      var latLng = this.get('map').unproject([
        segment.point.x,
        segment.point.y
      ]);

      this.get('shape.geoPoints').push([
        latLng.lng,
        latLng.lat
      ]);
    }));
  },

  actions: {
    addTaskLayer: function() {
      this.pxToLatLng();
      this.set('shape.layerId', this.get('elementId')+"_"+this.get('layerId'));
      this.set('layerId', this.get('layerId')+1);
      this.get('mapboxGl').setMarker(this.get('shape'));
      this.send('removeTaskShape');
    },

    removeTaskShape: function() {
      // remove path
      this.get('path').remove();
      this.set('paperMode', 'none');
      this.set('newTaskShape', false);
    }
  }
});