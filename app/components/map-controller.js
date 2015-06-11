import Ember from 'ember';

const {
  Component,
  observer
} = Ember;

export default Component.extend({
  classNames: ['map-controller'],

  setPosition: observer('mapControllerPositionX', 'mapControllerPositionY', function() {
    this.$().css({
      'top': this.get('mapControllerPositionY')+"px",
      'left': this.get('mapControllerPositionX')+"px"
    });
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
