import Ember from 'ember';

const {
  Component,
  inject,
  $,
  observer
} = Ember;

export default Component.extend({
  classNames: ['map-controller'],
  classNameBindings: ['visible:map-controller--visible'],

  tuio: inject.service('tuio'),
  visible: false,

  didInsertElement: function() {
    this.set('windowW', $(window).width());
    this.set('windowH', $(window).height());
    var self = this;

    this.get('tuio').client.on("addTuioObject", function(object) {
      if (object.symbolId === 35) {
        self.set('visible', true);
      }
    });

    this.get('tuio').client.on("updateTuioObject", function(object) {
      if (object.symbolId === 35) {
        if(object.path.length > 3) {
          self.sendAction('moveMap', self.movedDistance(object));
        }
        self.sendAction('rotateMap', object.getAngleDegrees());
        self.setPosition(object);
      }
    });

    this.get('tuio').client.on("removeTuioObject", function(object) {
      if (object.symbolId === 35) {
        self.set('visible', false);
      }
    });
  },

  setPosition: function(object) {
    this.$().css({
      'top': Math.round(object.yPos * this.get('windowH')),
      'left': Math.round(object.xPos * this.get('windowW'))
    });
  },

  movedDistance: function(object) {
    var prevPosition = object.path[object.path.length-3],
        currPosition = object.path[object.path.length-1],
        xDist = Math.round((currPosition.xPos - prevPosition.xPos) * this.get('windowW')),
        yDist = Math.round((currPosition.yPos - prevPosition.yPos) * this.get('windowH'));

    return [xDist*-1, yDist*-1];
  }
});
