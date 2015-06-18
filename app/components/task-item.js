import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['task-item'],
  newTask: false,
  editTask: false,

  didInsertElement: function() {
    this.$().css({'top': this.get('shape.anchor').y, 'left': this.get('shape.anchor').x});
    this.$().attr('tabindex',0);
    this.$().focus();
  },

  actions: {
    createTask: function() {
      var task = this.store.createRecord('task', {
        title: 'Task Titel',
        description: 'You can store and sync data in realtime without a backend.',
        geoPoints: this.get('shape.geoPoints'),
        layerType: this.get('shape.layerType'),
        sourceType: this.get('shape.sourceType'),
      });
      task.save();

      this.sendAction('addTaskLayer', task);
    },

    cancelTask: function() {
      this.sendAction('removeTaskShape');
    },

    closeTask: function() {
      this.sendAction('clearEditTask');
    },

    deleteTask: function() {
      this.sendAction('removeTaskLayer');
      // TODO: delete layer and task
    }
  },

  keyUp: function (e) {
    e.preventDefault();
    e.stopPropagation();

    const keyMap = {
      27: 'cancelTask',
      13: 'createTask'
    };
    let fn = keyMap[event.keyCode];

    if (fn) {
      this.send(fn);
    }
  }
});
