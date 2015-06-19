import Ember from 'ember';
import Map from 'mse-disaster-management/mixins/map';

const {
  Component,
  computed,
  observer,
  inject,
  $,
  run: {
    bind
  }
} = Ember;

export default Component.extend(Map, {
  classNames: ['mapbox-gl-map'],
  classNameBindings: ['settings.baseMap'],

  // Services
  tuio: inject.service('tuio'),

  //Variables
  drawingMode: false,
  selectedFeature: null,
  isMapController: false,
  mapControllerPositionX: null,
  mapControllerPositionY: null,

  mapId: computed(function() {
    return this.get('elementId');
  }),

  map: computed(function() {
    return this.get('mapboxGl').maps[this.get('elementId')];
  }),

  didInsertElement: function() {
    this.get('mapboxGl').setupMap(
      this.get('elementId'),
      this.get('settings'),
      this.get('tasks')
    );

    this.get('map').on('style.load', bind(this, function() {
      this.loadDefaultLayer();
      this.addTaskShapes();
    }));

    this.sendAction('setMap', this.get('map'));
  },

  // Touch Events
  press: function(e) {
    var e = e.originalEvent.gesture.pointers[0];

    this.get('map').featuresAt({'x': e.offsetX, 'y': e.offsetY}, {radius: 5}, bind(this, function(err, tasks) {
      if(tasks.length) {
        var selectedFeature = tasks.get('firstObject');
        selectedFeature.anchor = {'x': e.offsetX, 'y': e.offsetY};

        this.set('selectedFeature', selectedFeature);
        this.set('drawingMode', true );
      }
    }));
  },

  // Tuio Events
  addMapController: function() {
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

  addTaskShapes: function() {
    this.get('tasks').forEach(bind(this, function(task) {
      this.get('mapboxGl').setMarker(this.get('map'), task);
    }));
  },

  loadDefaultLayer: function() {
    var layers = ['walls', 'hubs', 'rooms'];
    layers.forEach(bind(this, function(layer) {
      this.get('mapboxGl').addLayer(this.get('map'), layer);
    }));
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
    },

    toogleDrawingMode: function() {
      this.toggleProperty('drawingMode');
    }
  },
});
