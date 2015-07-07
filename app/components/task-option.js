import Ember from 'ember';

const {
  Component,
  computed,
  observer
} = Ember;

export default Component.extend({
  classNames: ['task-option cancel-drag'],

  actions: {
    setOption: function(value) {
      this.store.find('task-option', value).then( (taskOption) => {
        this.set('task.actions', taskOption);
      });
    }
  }
});
