import Ember from 'ember';

const {
  Component,
  computed,
  inject,
  $,
  run: {
    bind
  }
} = Ember;

export default Component.extend({
  classNames: ['mapbox-gl-map'],
  classNameBindings: ['settings.baseMap'],

  // Services
  mapboxGl: inject.service('mapboxGl'),
  tuio: inject.service('tuio'),

  //Variables
  drawingMode: false,
  editTask: null,
  isMapController: false,
  mapControllerPositionX: null,
  mapControllerPositionY: null,

  map: computed(function() {
    var id = this.get('elementId');
    return this.get('mapboxGl').maps[id];
  }),

  didInsertElement: function() {
    this.get('mapboxGl').setupMap(
      this.get('elementId'),
      this.get('settings')
    );

    if(this.get('settings.baseMap') ) {
      this.sendAction('setBaseMap', this.get('elementId') );
    }
  },

  // Touch Events
  mouseDown: function(e) {
    var selectedFeature = this.get('mapboxGl').getMarker(this.get('map'), e);
    this.set('editTask', selectedFeature );
  },

  // Tuio Events
  addMapController: function(e) {
    this.set('isMapController', true);
  },

  updateMapController: function(e) {
    var object = e.originalEvent.detail;
    if(object.path.length > 2) {
      this.send('moveMap', this.movedDistance(object));
    }
    this.send('rotateMap', object.getAngleDegrees());
    this.set('mapControllerPositionX', object.clientX);
    this.set('mapControllerPositionY', object.clientY);
  },

  removeMapController: function() {
    this.set('isMapController', false);
  },


  // Helper Functions
  movedDistance: function(object) {
    var prevPosition = object.path[object.path.length-2],
        currPosition = object.path[object.path.length-1],
        xDist = Math.round((currPosition.xPos - prevPosition.xPos) * $(window).width()),
        yDist = Math.round((currPosition.yPos - prevPosition.yPos) * $(window).height());

    return [xDist*-1, yDist*-1];
  },

  // Actions
  actions: {
    moveMap: function(pos) {
      this.get('map').panBy(pos, {duration: 0, animate: false});
    },

    rotateMap: function(deg) {
      this.get('map').rotateTo([deg], {duration: 0, animate: false});
    },

    zoomtoLevel: function(zoom) {
      this.get('map').zoomTo(zoom);
    },

    zoomIn: function() {
      this.get('map').zoomIn();
    },

    zoomOut: function() {
      this.get('map').zoomOut();
    },

    toggleDrawingMode: function() {
      this.toggleProperty('drawingMode');
    },

    clearEditTask: function() {
      this.set('editTask', null);
    },

    removeTaskLayer: function() {
      this.get('mapboxGl').removeMarker(this.get('editTask.layer.id'));
      this.send('clearEditTask');
    }
  },
});
