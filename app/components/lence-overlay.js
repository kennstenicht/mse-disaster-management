import Ember from 'ember';

const {
  Component,
  $
} = Ember;

export default Ember.Component.extend({
  classNames: ['lence-overlay'],
  
  didInsertElement: function() {
    var x = this.get('settings.point.x'),
    y = this.get('settings.point.y');
    
    $(this.get('element')).css({'left': x, 'top': y});
  }
});
