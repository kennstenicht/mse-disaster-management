import Ember from 'ember';
import Tasks from 'mse-disaster-management/models/tasks';

const {
  Component,
  computed,
  inject
} = Ember;

export default Component.extend({
  classNames: ['mapbox-gl-map'],
  classNameBindings: ['settings.baseMap'],

  mapboxGl: inject.service('mapboxGl'),
  tasks: Tasks.create(),

  drawingMode: false,

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

  actions: {
    moveMap: function(x, y) {
      this.get('map').panBy([x, y]);
    },

    rotateMap: function(deg) {
      this.get('map').rotateTo([deg]);
    },

    zoomtoLevel: function(zoom) {
      this.get('map').zoomTo(zoom)
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

    addToMap: function() {

    }
  },

  click: function(e) {
    var self = this;
    this.get('map').featuresAt({'x': e.pageX, 'y': e.pageY}, {radius: 5}, function(err, tasks) {
      self.set('selectedTask', tasks.get('firstObject'));
    });
  }

  // click: function(e) {
  //   var point = {
  //     'x': e.offsetX,
  //     'y': e.offsetY
  //   };
  //
  //   var id = this.get('elementId');
  //   var map = this.get('mapboxGl').maps[id];
  //   if(settings.baseMap) {
  //     this.sendAction('createLence', map.map.unproject(point), point, map.getZoom() );
  //   }
  // }
});
