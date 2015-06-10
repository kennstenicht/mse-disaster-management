import Ember from 'ember';

const {
  Component,
  $,
  on,
} = Ember;

export default Component.extend({
  classNames: ['map-controller'],
  classNameBindings: ['isVisible:map-controller--visible'],
  isVisible: false,

  didInsertElement: function() {
    this.set('windowW', $(window).width());
    this.set('windowH', $(window).height());
  },

  setPosition: function(object) {
    this.$().css({
      'top': Math.round(object.yPos * this.get('windowH')),
      'left': Math.round(object.xPos * this.get('windowW'))
    });
  },

  movedDistance: function(object) {
    var prevPosition = object.path[object.path.length-2],
        currPosition = object.path[object.path.length-1],
        xDist = Math.round((currPosition.xPos - prevPosition.xPos) * this.get('windowW')),
        yDist = Math.round((currPosition.yPos - prevPosition.yPos) * this.get('windowH'));

    return [xDist*-1, yDist*-1];
  },

  onAddMapController: on('addMapController', function() {
    this.set('isVisible', true);
  }),

  onUpdateMapController: on('updateMapController', function(object) {
    if(object.path.length > 2) {
      this.sendAction('moveMap', this.movedDistance(object));
    }
    this.sendAction('rotateMap', object.getAngleDegrees());
    this.setPosition(object);
  }),

  onRemoveMapController: on('removeMapController', function() {
    this.set('isVisible', false);
  }),

  actions: {
    zoomIn: function() {
      this.sendAction('zoomIn');
    },

    zoomOut: function() {
      this.sendAction('zoomOut');
    }
  }
});
