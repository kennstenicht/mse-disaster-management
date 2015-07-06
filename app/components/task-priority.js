import Ember from 'ember';

const {
  Component,
  computed,
  observer
} = Ember;

export default Component.extend({
  classNames: ['task-priority'],

  priorities: [
    {
      'name' : 'Niedrig',
      'id': 0
    },
    {
      'name' : 'Mittel',
      'id': 1
    },
    {
      'name' : 'Hoch',
      'id': 2
    }
  ],

  actions: {
    setPriority: function(id) {
      var priority = this.get('priorities').filterBy('id', id);
      this.set('task.priority', priority[0].id);
    }
  }
});
