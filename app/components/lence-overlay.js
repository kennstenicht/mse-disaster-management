import Ember from 'ember';

const {
  Component,
  $
} = Ember;

export default Ember.Component.extend({
  classNames: ['lence-overlay'],
  classNameBindings: ['settings.active:lence-overlay--active'],

  didInsertElement: function() {
    this.$().css({'top': this.get('settings').point.y, 'left': this.get('settings').point.x});
  },

  mouseDown: function(e) {
    if($(e.target).hasClass("lence-overlay")) {
      this.set('isDragging', true);
      this.set('startX', e.offsetX);
      this.set('startY', e.offsetY);
    }
  },

  mouseMove: function(e) {
    if(this.get('isDragging')) {
      var x = e.pageX-this.get('startX');
      var y = e.pageY-this.get('startY');
      this.$().css({'top': y, 'left': x});
    }
  },

  mouseUp: function(e) {
    if(this.get('isDragging')) {
      this.set('isDragging', false);
    }
  }
});
