import Ember from 'ember';

const {
  Component,
  computed,
  inject
} = Ember;

export default Component.extend({
  classNames: ['mapbox-gl-map'],
  classNameBindings: ['settings.baseMap'],

  mapboxGl: inject.service('mapboxGl'),

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
    }
  },

  click: function(e) {
    var self = this;
    this.get('map').featuresAt({'x': e.offsetX, 'y': e.offsetY}, {radius: 5}, function(err, tasks) {
      this.set(task+".anchor", {'x': e.offsetX, 'y': e.offsetY});
      self.set('selectedTask', tasks.get('firstObject'));
      if(tasks.get('firstObject')) {
        console.log(tasks.get('firstObject'));
      }
    });
  }
});
