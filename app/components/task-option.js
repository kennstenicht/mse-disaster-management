import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['task-option cancel-drag'],

  actions: {
    setOption: function(value) {
      this.set('selectedOption', value);
    }
  }
});
