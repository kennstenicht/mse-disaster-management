import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['task-item'],

  didInsertElement: function() {
    this.$().css({'top': this.get('anchor').y, 'left': this.get('anchor').x});
  },


  actions: {
    createTask: function() {
      this.sendAction('addTaskShape');
    },

    cancelTask: function() {
      this.sendAction('removeTaskShape');
    }
  }
});
