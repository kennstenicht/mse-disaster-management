import Ember from 'ember';

const {
  Component,
  computed,
  inject,
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
      console.log(this.get('editTask'));
      this.get('mapboxGl').removeMarker(this.get('editTask.layer.id'));
      this.send('clearEditTask');
    }
  },

  click: function(e) {
    this.get('map').featuresAt({'x': e.offsetX, 'y': e.offsetY}, {radius: 5}, bind(this, function(err, tasks) {
      if(tasks.length) {
        this.set('editTask', tasks.get('firstObject'));
        this.set('editTask.anchor', {'x': e.offsetX, 'y': e.offsetY});
      }
    }));
  }
});
