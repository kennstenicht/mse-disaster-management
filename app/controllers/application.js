import Ember from 'ember';
import Notify from 'ember-notify';


const {
  Controller,
  computed,
  observer,
  computed: {
    filterBy
  },
  run: {
    bind
  }
} = Ember;

export default Controller.extend({
  init: function() {

     // var model = this.store.createRecord('task-option', {
     //   title: 'Gebiet Sichern',
     // });
     // model.save();
  },

  tasksWithoutShape: observer('tasks.@each', function() {
    if(this.get('tasks')) {
      this.get('tasks').filter(bind(this, function(task, index, self) {
        if(!task.get('geoPoints')) {

          Notify.info({
            raw: 'Die Aufgabe <b>"'+task.get('title')+'"</b> wurde ohne Geoposition hinzugefügt.',
            closeAfter: null,
            action: 'addShapeToTask',
            value: task
          });
        }
      }));
    }
  }),

  actions: {
    addLence: function(object) {
      var lence = this.get('maps').filterBy('markerId', object.symbolId).objectAt(0);
      lence.set('active', true).save();
    },

    removeLence: function(object) {
      var lence = this.get('maps').filterBy('markerId', object.symbolId).objectAt(0);
      lence.set('active', false).save();
    },

    updateLence: function(object) {
      var lence = this.get('maps').filterBy('markerId', object.symbolId).objectAt(0);
      lence
        .set('posX', object.clientX)
        .set('posY', object.clientY)
      .set('angle', object.angle);
    },

    addShapeToTask: function() {
      console.log('check action');
    }
  }
});
