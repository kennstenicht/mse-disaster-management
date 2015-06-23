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
        title: 'Neue Aufgabe ohne Titel',
        description: '',
        priority: 3,
        progress: 0,
        timestamp: moment().format('DD.MM.YYYY HH:mm:ss'),
        date: moment().format('x'),
        status: 'new',
        unit: 'firefighter',
        parent: '0',
        geoPoints: this.get('shape.geoPoints'),
        layerType: this.get('shape.layerType'),
        sourceType: this.get('shape.sourceType'),
      });
      task.save();

      this.sendAction('removeTaskShape');
    },

    cancelTask: function() {
      this.sendAction('removeTaskShape');
    },

    saveTask: function() {
      this.store.find('task', this.get('selectedFeature.layer.id') ).then( (task) => {
        task.set('geoPoints', this.get('shape.geoPoints')).save();
        this.sendAction('addTaskLayer', task);
      });

      this.sendAction('removeTaskShape');
    },

    deleteTask: function() {
      this.store.find('task', this.get('selectedFeature.layer.id') ).then( (task) => {
        task.destroyRecord()
      });
      this.sendAction('removeTaskShape');
    },

    addShape: function() {
      this.store.find('task', this.get('selectedAddShape.id') ).then((task) => {
        task.set('geoPoints', this.get('shape.geoPoints'));
        task.save();
        task.set('layerType', this.get('shape.layerType'));
        task.save();
        task.set('sourceType', this.get('shape.sourceType'));
        task.save();


        this.sendAction('removeTaskShape');
      });
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
