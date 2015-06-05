import Ember from 'ember';

const {
  Component,
  $
} = Ember;

export default Ember.Component.extend({
  classNames: ['lence-overlay'],
  
  didInsertElement: function() {
    this.$().css({'top': this.get('settings').point.y, 'left': this.get('settings').point.x});
  },
  
  mouseDown: function(e) {
    console.log(e.offsetX);
  }
});
