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
  taskMode: null,
  drawingArea: null,

  shape: {
    id: '',
    sourceType: 'LineString',
    layerType: 'line',
    geoPoints: [],
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

    if(this.get('selectedFeature')) {
      this.loadShape();
    }
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
    this.set('path', null);
    this.set('path', new paper.Path({
      strokeColor: 'rgba(204,14,14,1)',
      strokeWeight: 8,
      selectedColor: 'rgba(204,14,14,1)',
      fillColor: 'rgba(204,14,14,0.2)'
    }));
  },

  drawingDrag: function(e) {
    // TODO uncomment on final system
    if(this.get('activeCursorId') === e.event.detail) {
      this.get('path').add(e.point);
    }
  },

  drawingUp: function() {
    if(this.get('path').length === 0) {
      this.addPoint();
    } else {
      this.get('path').flatten(50);
      this.saveShape();
    }

    if(this.get('selectedAddShape')) {
      this.set('taskMode', 'addShape');
    } else {
      this.set('taskMode', 'newTask');
    }
  },

  editingDown: function(e) {
    var hitResult = this.get('path').hitTest(e.point, {
      segments: true,
      stroke: true,
      tolerance: 30
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

  editingUp: function(e) {
    if ( this.get('segment') ) {
      this.set('segment', null);
      this.saveShape();
    }
  },

  saveShape: function() {
    this.isPolygon();
    this.get('path').fullySelected = true;
    paper.view.draw();
    this.set('shape.geoPoints', []);
    this.pxToLatLng();
    this.set('paperMode', 'editing');

    this.set('shape.anchor', this.get('path').lastSegment.point);
  },

  loadShape: function() {
    this.set('path', new paper.Path({
      strokeColor: 'rgba(204,14,14,1)',
      strokeWeight: 8,
      selectedColor: 'rgba(204,14,14,1)',
      fillColor: 'rgba(204,14,14,0.2)'
    }));

    this.set('shape.geoPoints', this.get('selectedFeature').geometry.coordinates[0]);
    this.get('shape.geoPoints').forEach(bind(this, function(latLng) {
      var point = this.get('map').project({'lng': latLng.get('firstObject'), 'lat': latLng.get('lastObject')});
      this.get('path').add([point.x, point.y]);
    }));
    this.saveShape();
    this.set('taskMode', 'editTask');
    this.get('mapboxGl').removeMarker(this.get('selectedFeature.layer.id'));
  },

  isPolygon: function() {
    var first = this.get('path').firstSegment.point,
        last = this.get('path').lastSegment.point,
        dist = first.getDistance(last);

    if (dist < 50) {
      this.get('path').add(first);
      this.get('path').closed = true;

      this.set('shape.sourceType', 'Polygon');
      this.set('shape.layerType', 'fill');
      return true;
    } else {
      this.set('shape.sourceType', 'LineString');
      this.set('shape.layerType', 'line');
    }
    console.log(this.get('shape.sourceType'));
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

    // A Polygon neads to be inside of an extra array
    if(this.get('shape.sourceType') === 'Polygon') {
      this.set('shape.geoPoints', [this.get('shape.geoPoints')]);
    }
  },

  addPoint: function() {
    new Shape.Circle(new Point(80, 50), 30);
    shape.strokeColor = 'black';
  },

  actions: {
    addTaskLayer: function(task) {
      // this.get('mapboxGl').setMarkerToAllMaps(task);
      this.sendAction('drawingMode');
    },

    removeTaskShape: function() {
      // remove path
      this.get('path').remove();
      this.set('shape.geoPoints', []);
      this.set('paperMode', 'none');
      this.set('taskMode', null);
    }
  }
});