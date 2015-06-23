import Ember from 'ember';

const {
  Component,
  computed,
  observer,
  run: {
    bind
  }
} = Ember;

export default Component.extend({
  classNames: ['tasks-without-shape'],
  parentId: '0',

  tasksWithoutShape: computed('tasks.@each', function() {
    if(this.get('tasks')) {
      return this.get('tasks').filter(bind(this, function(task, index, self) {
        if(!task.get('geoPoints') && task.get('parent') === this.get('parentId')) {
          return task;
        }
      }));
    }
  }),

  actions: {
    addShapeToTask: function(value) {
      this.sendAction('addShapeToTask', value);
    }
  }
});
