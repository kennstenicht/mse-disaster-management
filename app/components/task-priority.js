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
      'id': 1
    },
    {
      'name' : 'Mittel',
      'id': 2
    },
    {
      'name' : 'Hoch',
      'id': 3
    }
  ],

  actions: {
    setPriority: function(id) {
      var priority = this.get('priorities').filterBy('id', id);
      this.set('selectedPriority', priority[0].id);
    }
  }
});
