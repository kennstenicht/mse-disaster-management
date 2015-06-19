import Ember from 'ember';

const {
  Component,
  run: {
    bind
  }
} = Ember;

export default Component.extend({
  classNames: ['task-item'],

  didInsertElement: function() {
    this.$().css({
      'top': this.get('shape.anchor').y,
      'left': this.get('shape.anchor').x
    });
    this.$().attr('tabindex', 0);
    this.$().focus();
  },

  actions: {
    createTask: function() {
      var task = this.store.createRecord('task', {
        title: 'Task Titel',
        description: 'You can store and sync data in realtime without a backend.',
        geoPoints: this.get('shape.geoPoints'),
        points: this.get('shape.points'),
        layerType: this.get('shape.layerType'),
        sourceType: this.get('shape.sourceType'),
      });
      task.save();

      this.sendAction('addTaskLayer', task);
      this.sendAction('removeTaskShape');
    },

    cancelTask: function() {
      this.sendAction('removeTaskShape');
    },

    saveTask: function() {
      var geoPoint = this.get('shape.geoPoints');
      this.store.find('task', this.get('selectedFeature.layer.id') ).then( bind(this, (task) => {
        console.log(geoPoint);
        task.set('geoPoints', geoPoint).save();
        this.sendAction('addTaskLayer', task);
      }));

      this.sendAction('removeTaskShape');
    },

    deleteTask: function() {
      this.store.find('task', this.get('selectedFeature.layer.id') ).then( (task) => {
        task.destroyRecord()
      });
      this.sendAction('removeTaskShape');
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
