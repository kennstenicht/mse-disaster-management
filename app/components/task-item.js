import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['task-item'],
  
  didInsertElement: function() {
    this.$().css({'top': this.get('anchor').y, 'left': this.get('anchor').x});
  },
  
  
  actions: {
    callback: function(callback, value) {
      this.sendAction(callback, value);
    }
  }
});
