import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    changePriority: function(value) {
      this.set('priority', value);
    }
  }
});
